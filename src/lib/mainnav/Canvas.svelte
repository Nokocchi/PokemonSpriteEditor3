<script lang="ts">
    import {
        dirtyImageDataStore,
        downloadPokemonStore,
    } from "../spriteeditor/store";
    import { canvasScaler, getMaxCanvasHeight } from "../spriteeditor/types";

    export let originalImageData: ImageData;
    let imageHeight: number;
    let imageWidth: number;
    let originalImagePixels: Uint8ClampedArray;
    let originalCanvas: HTMLCanvasElement;
    let resultCanvas: HTMLCanvasElement;
    let canvasHeight: number;
    let screenWidth: number;
    let maxCanvasSize: number;

    $: handleNewPokemon(originalImageData);
    $: updateDirtyCanvas($dirtyImageDataStore);
    $: $downloadPokemonStore && downloadPokemon();

    const handleNewPokemon = (imageData: ImageData) => {
        if (!imageData) return;
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
<div class="canvas-container" class:pokemon-selected={originalImageData}>
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
            class:hidden={!originalImageData}
        />
    {/key}
</div>
<svelte:window bind:innerWidth={screenWidth} />

<style>
    .canvas-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        background-color: blue;
        height: 150px;
        flex-shrink: 0;
        overflow-x: hidden;
    }

    .canvas-container.pokemon-selected {
        background-color: white;
        height: auto;
    }

    .canvas-resize-handle {
        position: absolute;
        border-bottom: 6px solid purple;
        cursor: move;
        width: 100%;
        touch-action: none;
        top: 0;
    }

    .canvas-resize-handle.hidden {
        display: none;
    }
</style>
