<script lang="ts">
    import { onMount } from "svelte";
    import {
    currentlySelectedColorPixelLocationsStore,
        dirtyImageDataStore,
        downloadPokemonStore,
    } from "../spriteeditor/store";
    import { canvasScaler, getMaxCanvasHeight } from "../spriteeditor/types";

    export let originalImageData: ImageData;
    const selectedColorBlinkSpeedMs: number = 500;
    let imageHeight: number;
    let imageWidth: number;
    let originalImagePixels: Uint8ClampedArray;
    let originalCanvas: HTMLCanvasElement;
    let resultCanvas: HTMLCanvasElement;
    let canvasHeight: number;
    let screenWidth: number;
    let maxCanvasSize: number;
    let shouldBlinkSelectedColor: boolean = false;
    let clearBlinkWhenSelectionStops: boolean = false;

    $: handleNewPokemon(originalImageData);
    $: updateDirtyCanvas($dirtyImageDataStore);
    $: $downloadPokemonStore && downloadPokemon();
    
    onMount(() => {
        handleNewPokemon(originalImageData);
        setInterval(() => {
            blinkSelectedColors(shouldBlinkSelectedColor);
            shouldBlinkSelectedColor = !shouldBlinkSelectedColor;
        }, selectedColorBlinkSpeedMs)
    })

    const blinkSelectedColors = (shouldBlinkSelectedColor: boolean) => {
        if(!$currentlySelectedColorPixelLocationsStore.size && clearBlinkWhenSelectionStops){
            presentImage(originalCanvas, originalImagePixels);
            clearBlinkWhenSelectionStops = false;
            return;
        }
        clearBlinkWhenSelectionStops = true;

        if(!shouldBlinkSelectedColor){
            presentImage(originalCanvas, originalImagePixels);
        } else {
            let highlightedPixels: Uint8ClampedArray = new Uint8ClampedArray(originalImagePixels);
            $currentlySelectedColorPixelLocationsStore.forEach((pixelLocations, colorKey) => {
                for (let i = 0; i < pixelLocations.length; i++) {
                const pixelToUpdate: number = pixelLocations[i];
                highlightedPixels[pixelToUpdate] = 255;
                highlightedPixels[pixelToUpdate + 1] = 255;
                highlightedPixels[pixelToUpdate + 2] = 255;
            }
            });
            presentImage(originalCanvas, highlightedPixels);
        }
    }

    const handleNewPokemon = (imageData: ImageData) => {
        if (!imageData || !resultCanvas) return;
        imageHeight = imageData.height;
        imageWidth = imageData.width;
        originalImagePixels = imageData.data;
        // Use previous canvasHeight if already set. But at most the new picture's maxHeight. Else, pick a default of two times the height of the sprite
        maxCanvasSize = getMaxCanvasHeight(
            imageHeight,
            imageWidth,
            screenWidth
        );
        canvasHeight = canvasHeight
            ? Math.min(canvasHeight, maxCanvasSize)
            : imageHeight * 2;
        presentImage(originalCanvas, originalImagePixels);
        presentImage(resultCanvas, originalImagePixels);
    };

    const updateDirtyCanvas = (dirtyImageData: Uint8ClampedArray) => {
        presentImage(resultCanvas, dirtyImageData);
    };

    const updateCanvasHeightFromResizeHandle = (newValue: number) => {
        canvasHeight = newValue;
        presentImage(originalCanvas, originalImagePixels);
        presentImage(resultCanvas, $dirtyImageDataStore);
    };

    const presentImage = (
        presentCanvas: HTMLCanvasElement,
        imagePixels: Uint8ClampedArray
    ) => {
        if (!originalImagePixels) return;

        let scale: number = canvasHeight / imageHeight;

        presentCanvas.height = imageHeight * scale;
        presentCanvas.width = imageWidth * scale;

        let tempCanvas: OffscreenCanvas = new OffscreenCanvas(
            imageWidth,
            imageHeight
        );
        let tempImageData: ImageData = new ImageData(
            imagePixels,
            imageWidth,
            imageHeight
        );
        tempCanvas.getContext("2d").putImageData(tempImageData, 0, 0);

        let presentContext: CanvasRenderingContext2D =
            getCanvasContext(presentCanvas);
        presentContext.imageSmoothingEnabled = false;
        presentContext.scale(scale, scale);
        presentContext.drawImage(tempCanvas, 0, 0);
    };

    let getCanvasContext = (
        canvas: HTMLCanvasElement
    ): CanvasRenderingContext2D => {
        return canvas.getContext("2d", { willReadFrequently: true });
    };

    const downloadPokemon = () => {
        // Offload dirty image data to a fresh temporary canvas with the correct height/width and no scaling. Download from this
        // If we didn't do it this way, and just downloaded from resultCanvas, we would download the resized/scaled sprite

        let tempCanvas: HTMLCanvasElement = document.createElement("canvas");
        tempCanvas.height = imageHeight;
        tempCanvas.width = imageWidth;

        let tempImageData: ImageData = new ImageData(
            $dirtyImageDataStore,
            imageWidth,
            imageHeight
        );
        tempCanvas.getContext("2d").putImageData(tempImageData, 0, 0);

        var dataUrl = tempCanvas.toDataURL("image/png");
        var link = document.createElement("a");
        link.download = "sprite.png";
        link.href = dataUrl.replace("image/png", "image/octet-stream");
        link.click();

        /*
        resultCanvas.toBlob((blob) => {
            let file = new Blob([blob], { type: "image/octet-stream" });
            let blobURL = URL.createObjectURL(file);
            window.location.href = blobURL;
        });
        */
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="canvas-container">
    <canvas bind:this={originalCanvas} />
    <canvas bind:this={resultCanvas} />
    {#key maxCanvasSize}
        <div
            class="canvas-resize-handle"
            use:canvasScaler={[
                canvasHeight,
                maxCanvasSize,
                updateCanvasHeightFromResizeHandle,
            ]}
        />
    {/key}
</div>
<svelte:window bind:innerWidth={screenWidth} />

<style>
    .canvas-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        background-color: white;
        height: auto;
        flex-shrink: 0;
        overflow-x: hidden;
    }

    .canvas-resize-handle {
        position: absolute;
        border-bottom: 6px solid purple;
        cursor: move;
        width: 100%;
        touch-action: none;
        top: 0;
    }
</style>
