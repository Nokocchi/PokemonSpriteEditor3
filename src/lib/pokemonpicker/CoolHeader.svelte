<script lang="ts">
    import { onMount } from "svelte";
    import {
        RGBToHSL,
        extractPixelData,
        getAsRGB,
        type HSL,
        HSLToRGB,
        type RGB,
    } from "../spriteeditor/types";

    type CanvasPkmn = {
        xPos: number;
        yPos: number;
        velocity: number;
        primaryColorChangeMultiplier: number;
        secondaryColorChangeMultiplier: number;
        primaryColors: string[];
        secondaryColors: string[];
    };

    type FrameSpecificData = {
        pixelLocations: Map<string, number[]>;
        originalImageData: ImageData;
    };

    let frameOne: boolean = false;
    let previousFrameStartedAt = new Date();
    let screenWidth: number;
    let canvas: HTMLCanvasElement;
    let toDraw: Map<string, CanvasPkmn> = new Map<string, CanvasPkmn>();
    let frameOneData: Map<string, FrameSpecificData> = new Map<
        string,
        FrameSpecificData
    >();
    let frameTwoData: Map<string, FrameSpecificData> = new Map<
        string,
        FrameSpecificData
    >();

    import headerPokemons from "./spritecatalog/util/headerData.json";

    // Starting point!
    // 1: Add all pokemon from headerData.json to a map
    // 2: Then, start drawing
    onMount(() => {
        canvas.width = screenWidth;
        headerPokemons.forEach((pkmn) => {
            addPokemonToDrawMap(pkmn);
        });
        window.requestAnimationFrame(() => drawFrame());
    });

    // Animation loop
    // 1: Clear canvas with white background color before every frame to overwrite previous frames
    // 2: Draw each Pokemon separately - use drawImage instead of putImageData so that transparent pixels, imageSmoothing = false and scaling works
    // 3: Draw next frame
    const drawFrame = () => {
        if (!canvas) return;

        canvas.getContext("2d").clearRect(0, 0, screenWidth, 150);
        toDraw.forEach((canvasPkmn, url) => {
            drawPokemon(url, canvasPkmn);
        });
        window.requestAnimationFrame(() => drawFrame());
    };

    const addPokemonToDrawMap = (pkmn: any) => {
        let url: string = pkmn.url;

        let canvasPkmn: CanvasPkmn = createInitialRandomizedPokemon(pkmn, 50);
        toDraw.set(url, canvasPkmn);

        const frameOne = new Image();
        frameOne.src = url;
        frameOne.onload = () => {
            let imageData: ImageData = extractPixelData(frameOne);
            let originalColorPixelLocationsMap =
                getOriginalColorPixelLocationMap(imageData);
            frameTwoData.set(url, {
                pixelLocations: originalColorPixelLocationsMap,
                originalImageData: imageData,
            });
        };

        const frameTwo = new Image();
        frameTwo.src = url.replace("/frame2", "");
        frameTwo.onload = () => {
            let imageData: ImageData = extractPixelData(frameTwo);
            let originalColorPixelLocationsMap =
                getOriginalColorPixelLocationMap(imageData);
            frameOneData.set(url, {
                pixelLocations: originalColorPixelLocationsMap,
                originalImageData: imageData,
            });
        };
    };

    const drawPokemon = (url: string, canvasPkmn: CanvasPkmn) => {
        if(!frameOneData.get(url) || !frameTwoData.get(url)) return;

        let changedImageData: ImageData = changeAndGetImageData(
            url,
            canvasPkmn
        );

        canvasPkmn.xPos = canvasPkmn.xPos + 1 * canvasPkmn.velocity;

        let tempCanvas: OffscreenCanvas = new OffscreenCanvas(
            changedImageData.width,
            changedImageData.height
        );
        tempCanvas.getContext("2d").putImageData(changedImageData, 0, 0);

        let presentContext: CanvasRenderingContext2D = canvas.getContext("2d");
        presentContext.imageSmoothingEnabled = false;
        presentContext.drawImage(tempCanvas, canvasPkmn.xPos, canvasPkmn.yPos);

        if (canvasPkmn.xPos > screenWidth) {
            resetAndRandomize(toDraw.get(url));
        }
    };

    const changeAndGetImageData = (
        url: string,
        canvasPokemon: CanvasPkmn
    ): ImageData => {
        let frameData: FrameSpecificData;
        let currentFrameStartedAt: Date = new Date();
        let moreThanSecHasPassed: boolean = currentFrameStartedAt.getTime() > previousFrameStartedAt.getTime() + 1000;

        if (moreThanSecHasPassed) {
            frameOne = !frameOne
            previousFrameStartedAt = currentFrameStartedAt;
        } 
        if(frameOne){
            frameData = frameOneData.get(url);
        } else {
            frameData = frameTwoData.get(url);
        }

        let dirtyImagePixels: Uint8ClampedArray = new Uint8ClampedArray(
            frameData.originalImageData.data
        );

        frameData.pixelLocations.forEach((pixelLocations, colorKey) => {
            if (!colorKey) {
                for (let i = 0; i < pixelLocations.length; i++) {
                    const pixelToUpdate: number = pixelLocations[i];
                    dirtyImagePixels[pixelToUpdate] = 0;
                    dirtyImagePixels[pixelToUpdate + 1] = 0;
                    dirtyImagePixels[pixelToUpdate + 2] = 0;
                }
            } else {
                let delta = 0;

                if (canvasPokemon.primaryColors.includes(colorKey)) {
                    delta = canvasPokemon.primaryColorChangeMultiplier;
                } else if (canvasPokemon.secondaryColors.includes(colorKey)) {
                    delta = canvasPokemon.secondaryColorChangeMultiplier;
                }

                let hsl: HSL = RGBToHSL(getAsRGB(colorKey));
                hsl.h += canvasPokemon.xPos * delta;
                if (hsl.h < 0) {
                    hsl.h = Math.abs(hsl.h) % 359;
                }
                let rgb: RGB = HSLToRGB(hsl);

                for (let i = 0; i < pixelLocations.length; i++) {
                    const pixelToUpdate: number = pixelLocations[i];
                    dirtyImagePixels[pixelToUpdate] = rgb.r;
                    dirtyImagePixels[pixelToUpdate + 1] = rgb.g;
                    dirtyImagePixels[pixelToUpdate + 2] = rgb.b;
                }
            }
        });

        return new ImageData(
            dirtyImagePixels,
            frameData.originalImageData.width,
            frameData.originalImageData.height
        );
    };

    const resetAndRandomize = (canvasPokemon: CanvasPkmn) => {
        canvasPokemon.xPos = 0;
        canvasPokemon.yPos = getRandomYPos(50);
        canvasPokemon.primaryColorChangeMultiplier =
            getPrimaryColorChangeMultiplier();
        canvasPokemon.secondaryColorChangeMultiplier =
            getSecondaryColorChangeMultiplier();
    };

    // Don't just hardcode the image height to 50 pixels. Each frame should be the same size, so figure out how to pass that to this function..
    const createInitialRandomizedPokemon = (
        pkmn: any,
        height: number
    ): CanvasPkmn => {
        return {
            velocity: Math.random() + 1,
            xPos: getRandomXPos(),
            yPos: getRandomYPos(height),
            primaryColorChangeMultiplier: getPrimaryColorChangeMultiplier(),
            secondaryColorChangeMultiplier: getSecondaryColorChangeMultiplier(),
            primaryColors: pkmn.primaryColors,
            secondaryColors: pkmn.secondaryColors,
        };
    };

    const getOriginalColorPixelLocationMap = (imageData: ImageData) => {
        const imageHeight = imageData.height;
        const imageWidth = imageData.width;
        const imageRGBData = imageData.data;

        let originalColorPixelLocationsMap: Map<string, number[]> = new Map<
            string,
            number[]
        >();

        //4 indexes for each pixel
        for (let i = 0; i < imageHeight * imageWidth * 4; i += 4) {
            let r: number = imageRGBData[i];
            let g: number = imageRGBData[i + 1];
            let b: number = imageRGBData[i + 2];
            const colorKey: string =
                imageRGBData[i + 3] < 255 ? null : r + ":" + g + ":" + b;
            if (!originalColorPixelLocationsMap.has(colorKey)) {
                originalColorPixelLocationsMap.set(colorKey, []);
            }
            originalColorPixelLocationsMap.get(colorKey).push(i);
        }
        return originalColorPixelLocationsMap;
    };

    const getRandomXPos = () => {
        return Math.random() * screenWidth;
    };

    const getRandomYPos = (imageHeight: number) => {
        return Math.max(0, Math.random() * 150 - imageHeight);
    };

    const getPrimaryColorChangeMultiplier = (): number => {
        let primaryColorChangeMultiplier: number = Math.random() / 2;
        return Math.random() > 0.5
            ? primaryColorChangeMultiplier
            : -primaryColorChangeMultiplier;
    };

    const getSecondaryColorChangeMultiplier = (): number => {
        let secondaryColorChangeMultiplier: number = Math.random();
        return Math.random() > 0.5
            ? secondaryColorChangeMultiplier
            : -secondaryColorChangeMultiplier;
    };
</script>

<div class="cool-header">
    <canvas bind:this={canvas} height="150" />
</div>
<svelte:window bind:innerWidth={screenWidth} />

<style>
    .cool-header {
        height: fit-content;
        background-color: white;
    }
</style>
