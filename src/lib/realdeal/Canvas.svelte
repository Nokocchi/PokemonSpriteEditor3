<script context="module" lang="ts">
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
    import type { NewColorResult, RGB } from "./colorpicker/types";
    const dispatch = createEventDispatcher();

    /* onMount(() => {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    */

    export const setSelectedPokemon = (pkmnImage: HTMLImageElement): void => {
        if (pkmnImage) {
            originalCanvas.height = pkmnImage.height;
            originalCanvas.width = pkmnImage.width;
            resultCanvas.height = pkmnImage.height;
            resultCanvas.width = pkmnImage.width;
            console.log("Canvas, pkmnImage height", pkmnImage.height);
            console.log("Canvas, pkmnImage width", pkmnImage.width);
            getCanvasContext(originalCanvas).drawImage(pkmnImage, 0, 0);
            getCanvasContext(resultCanvas).drawImage(pkmnImage, 0, 0);
            dispatch("originalCanvasReady");
        }
    };

    export const getOriginalPixelData = (): ImageData => {
        let x = originalCanvas.width;
        let y = originalCanvas.height;
        console.log("Canvas, originalCanvas width", x);
        console.log("Canvas, originalCanvas height", y);
        return getCanvasContext(originalCanvas).getImageData(0, 0, x, y);
    };

    export const updateColor = (newColorResult: NewColorResult) => {
        const newColor: RGB = newColorResult.newColor;
        const pixelsToUpdate: number[] = newColorResult.pixelsToChange;
        const context: CanvasRenderingContext2D = getCanvasContext(resultCanvas);
        let width = resultCanvas.width;
        let height = resultCanvas.height;
        let resultImageData: ImageData = getCanvasContext(resultCanvas).getImageData(0, 0, width, height);

        for (let i = 0; i < pixelsToUpdate.length; i++) {
            const pixelToUpdate: number = pixelsToUpdate[i];
            resultImageData.data[pixelToUpdate] = newColor.r;
            resultImageData.data[pixelToUpdate+1] = newColor.g;
            resultImageData.data[pixelToUpdate+2] = newColor.b;
        }
        context.putImageData(resultImageData, 0, 0);
    }

    let originalCanvas: HTMLCanvasElement;
    let resultCanvas: HTMLCanvasElement;

    let getCanvasContext = (
        canvas: HTMLCanvasElement
    ): CanvasRenderingContext2D => {
        return canvas.getContext("2d", { willReadFrequently: true });
    };
</script>

<div class="canvas-container">
<canvas bind:this={originalCanvas} />
<canvas bind:this={resultCanvas} />
</div>

<style>
    .canvas-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 25px;
    }
</style>
