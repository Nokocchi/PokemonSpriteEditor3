<script lang="ts">
    import {
        canvasScaler,
        getMaxCanvasSize,
        type NewColorResult,
        type RGB,
    } from "./colorpicker/types";

    export let originalImageData: ImageData;
    let dirtyImageData: ImageData;
    let originalCanvas: HTMLCanvasElement;
    let resultCanvas: HTMLCanvasElement;
    let canvasHeight: number;
    let screenWidth: number;
    let maxCanvasSize: number;

    $: dirtyImageData = originalImageData;
    $: canvasHeight = originalImageData ? originalImageData.height * 2 : 0;
    $: maxCanvasSize = getMaxCanvasSize(originalImageData, screenWidth);
    $: setSelectedPokemon(originalImageData);
    $: resizeCanvas(canvasHeight);

    const resizeCanvas = (canvasHeight: number) => {
        presentImage(originalCanvas, originalImageData);
        presentImage(resultCanvas, dirtyImageData);
    };

    const updateCanvasHeight = (newValue: number) => {
        canvasHeight = newValue;
    };

    const presentImage = (canvas: HTMLCanvasElement, imageData: ImageData) => {
        if (!imageData) return;

        let height: number = imageData.height;
        let width: number = imageData.width;

        let scale: number = canvasHeight / height;

        canvas.height = height * scale;
        canvas.width = width * scale;

        let tempCanvas: OffscreenCanvas = new OffscreenCanvas(width, height);
        tempCanvas.getContext("2d").putImageData(imageData, 0, 0);

        let context = getCanvasContext(canvas);
        context.imageSmoothingEnabled = false;
        context.scale(scale, scale);
        context.drawImage(tempCanvas, 0, 0);
    };

    const setSelectedPokemon = (imageData: ImageData): void => {
        if (imageData) {
            presentImage(originalCanvas, imageData);
            presentImage(resultCanvas, imageData);
        }
    };

    export const updateColor = (newColorResult: NewColorResult) => {
        const newColor: RGB = newColorResult.newColor;
        const pixelsToUpdate: number[] = newColorResult.pixelsToChange;

        for (let i = 0; i < pixelsToUpdate.length; i++) {
            const pixelToUpdate: number = pixelsToUpdate[i];
            dirtyImageData.data[pixelToUpdate] = newColor.r;
            dirtyImageData.data[pixelToUpdate + 1] = newColor.g;
            dirtyImageData.data[pixelToUpdate + 2] = newColor.b;
        }
        presentImage(resultCanvas, dirtyImageData);
    };

    let getCanvasContext = (
        canvas: HTMLCanvasElement
    ): CanvasRenderingContext2D => {
        return canvas.getContext("2d", { willReadFrequently: true });
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="canvas-container" class:pokemon-selected={originalImageData}>
    <canvas bind:this={originalCanvas} />
    <canvas bind:this={resultCanvas} />
</div>
{#key maxCanvasSize}
    <div
        class="canvas-resize-handle"
        use:canvasScaler={[canvasHeight, maxCanvasSize, updateCanvasHeight]}
        class:hidden={!originalImageData}
    />
{/key}
<svelte:window bind:innerWidth={screenWidth} />

<style>
    .canvas-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        background-color: blue;
        height: 150px;
        flex-shrink: 0;
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
    }

    .canvas-resize-handle.hidden {
        display: none;
    }
</style>
