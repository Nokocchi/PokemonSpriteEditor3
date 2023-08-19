<script lang="ts">
    import type { NewColorResult, RGB } from "./colorpicker/types";

    export let imageData: ImageData;
    let originalCanvas: HTMLCanvasElement;
    let resultCanvas: HTMLCanvasElement;

    $: imageData && setSelectedPokemon(imageData);

    const setSelectedPokemon = (imageData: ImageData): void => {
        originalCanvas.height = imageData.height;
        originalCanvas.width = imageData.width;
        getCanvasContext(originalCanvas).putImageData(imageData, 0, 0);

        resultCanvas.height = imageData.height;
        resultCanvas.width = imageData.width;
        getCanvasContext(resultCanvas).putImageData(imageData, 0, 0);
    };

    export const updateColor = (newColorResult: NewColorResult) => {
        const newColor: RGB = newColorResult.newColor;
        const pixelsToUpdate: number[] = newColorResult.pixelsToChange;
        const context: CanvasRenderingContext2D =
            getCanvasContext(resultCanvas);
        let width = resultCanvas.width;
        let height = resultCanvas.height;
        let resultImageData: ImageData = getCanvasContext(
            resultCanvas
        ).getImageData(0, 0, width, height);

        for (let i = 0; i < pixelsToUpdate.length; i++) {
            const pixelToUpdate: number = pixelsToUpdate[i];
            resultImageData.data[pixelToUpdate] = newColor.r;
            resultImageData.data[pixelToUpdate + 1] = newColor.g;
            resultImageData.data[pixelToUpdate + 2] = newColor.b;
        }
        context.putImageData(resultImageData, 0, 0);
    };

    let getCanvasContext = (
        canvas: HTMLCanvasElement
    ): CanvasRenderingContext2D => {
        return canvas.getContext("2d", { willReadFrequently: true });
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="canvas-container" class:pokemon-selected={imageData}>
    <canvas height="0" width="0" bind:this={originalCanvas} />
    <canvas height="0" width="0" bind:this={resultCanvas} />
</div>

<style>
    .canvas-container {
        display: flex;
        height: 150px;
        flex-direction: row;
        justify-content: space-around;
        background-color: blue;
        flex-shrink: 0;
    }

    .canvas-container.pokemon-selected {
        background-color: white;
    }
</style>
