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
        primaryColorDeltaMultiplier: number;
        secondaryColorDeltaMultiplier: number;
        pixelLocations: Map<string, number[]>;
        imageData: ImageData;
        primaryColors: string[];
        secondaryColors: string[];
    };

    let screenWidth: number;
    let canvas: HTMLCanvasElement;
    let toDraw: Map<string, CanvasPkmn> = new Map<string, CanvasPkmn>();

    import headerPokemons from "./spritecatalog/util/headerData.json";

    onMount(() => {
        canvas.width = screenWidth;
        headerPokemons.forEach((pkmn) => {
            addPokemonToDrawMap(pkmn);
        });

        window.requestAnimationFrame(() => drawFrame());
    });

    const addPokemonToDrawMap = (pkmn: any) => {
        let url: string = pkmn.url;

        const image = new Image();
        image.src = url;
        image.onload = () => {
            let imageData: ImageData = extractPixelData(image);
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
                    imageRGBData[i + 3] < 255 ? "alpha" : r + ":" + g + ":" + b;
                if (!originalColorPixelLocationsMap.has(colorKey)) {
                    originalColorPixelLocationsMap.set(colorKey, []);
                }
                originalColorPixelLocationsMap.get(colorKey).push(i);
            }

            let canvasPkmn: CanvasPkmn = {
                velocity: Math.random() + 1,
                xPos: Math.random() * screenWidth,
                yPos: Math.max(
                    0,
                    Math.random() * 150 - imageData.height
                ),
                primaryColorDeltaMultiplier: Math.random() / 2,
                secondaryColorDeltaMultiplier: Math.random(),
                pixelLocations: originalColorPixelLocationsMap,
                imageData: imageData,
                primaryColors: pkmn.primaryColors,
                secondaryColors: pkmn.secondaryColors
            };
            toDraw.set(url, canvasPkmn);
        };
    };

    const drawFrame = () => {
        if (!canvas) return;
        toDraw.forEach((canvasPkmn, url) => {
            drawPokemon(url, canvasPkmn);
        });
        window.requestAnimationFrame(() => drawFrame());
    };

    const drawPokemon = (url: string, canvasPkmn: CanvasPkmn) => {
        let dirtyImagePixels: Uint8ClampedArray = new Uint8ClampedArray(
            canvasPkmn.imageData.data
        );

        canvasPkmn.pixelLocations.forEach((pixelLocations, colorKey) => {
            if (colorKey === "alpha") {
                for (let i = 0; i < pixelLocations.length; i++) {
                    const pixelToUpdate: number = pixelLocations[i];
                    dirtyImagePixels[pixelToUpdate] = 0;
                    dirtyImagePixels[pixelToUpdate + 1] = 0;
                    dirtyImagePixels[pixelToUpdate + 2] = 0;
                }
            } else {
                let delta = 0;

                if (canvasPkmn.primaryColors.includes(colorKey)) {
                    delta = canvasPkmn.primaryColorDeltaMultiplier;
                } else if (canvasPkmn.secondaryColors.includes(colorKey)) {
                    delta = canvasPkmn.secondaryColorDeltaMultiplier;
                }
                let hsl: HSL = RGBToHSL(getAsRGB(colorKey));
                hsl.h += canvasPkmn.xPos * delta;
                let rgb: RGB = HSLToRGB(hsl);

                for (let i = 0; i < pixelLocations.length; i++) {
                    const pixelToUpdate: number = pixelLocations[i];
                    dirtyImagePixels[pixelToUpdate] = rgb.r;
                    dirtyImagePixels[pixelToUpdate + 1] = rgb.g;
                    dirtyImagePixels[pixelToUpdate + 2] = rgb.b;
                }
            }
        });

        let dirtyImageData: ImageData = new ImageData(
            dirtyImagePixels,
            canvasPkmn.imageData.width,
            canvasPkmn.imageData.height
        );

        canvasPkmn.xPos = canvasPkmn.xPos + (1 * canvasPkmn.velocity);

        canvas
            .getContext("2d")
            .putImageData(dirtyImageData, canvasPkmn.xPos, canvasPkmn.yPos);

        if (canvasPkmn.xPos > screenWidth) {
            toDraw.delete(url);
            let pkmnToDraw: any = headerPokemons[Math.floor(Math.random() * headerPokemons.length)];
            addPokemonToDrawMap(pkmnToDraw);
        }
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
