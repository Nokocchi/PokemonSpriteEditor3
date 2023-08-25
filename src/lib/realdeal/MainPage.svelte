<script lang="ts">
    import PokemonSelector from "./pokemonpicker/PokemonSelector.svelte";
    import Canvas from "./Canvas.svelte";
    import { CurrentWindow, canvasScaler, type NewColorResult } from "./colorpicker/types";
    import Menu from "./Menu.svelte";
    import SpriteEditor from "./colorpicker/SpriteEditor.svelte";

    let spriteEditor: SpriteEditor;
    let canvas: Canvas;
    let currentWindow: string = CurrentWindow.SELECT;
    let imageData: ImageData;
    let selectedPokemonNr: number;




    const updateColorAtPixels = (newColorResult: NewColorResult): void => {
        canvas.updateColor(newColorResult);
    };



    const setImageData = (newImageData: ImageData) => {
        imageData = newImageData;
    }

    //TODO: ImageData seems to be updated by SpriteEditor, and this updates originalImageData in Canvas
    //TODO: Clicking Reset puts the canvases back to original size, but keeps resize handle where it is
</script>


<div class="main-page">
    <Canvas bind:this={canvas} originalImageData={imageData}/>
    <div class="main-content" class:should-scroll={currentWindow === CurrentWindow.SELECT}>
        {#if currentWindow === CurrentWindow.SELECT}
            <PokemonSelector bind:selectedPokemonNr on:imageSelected={(e) => setImageData(e.detail)} />
        {:else if currentWindow === CurrentWindow.EDIT}
            <SpriteEditor
                bind:this={spriteEditor}
                imageData={imageData}
                on:resetPokemon={() => imageData = imageData}
                on:newColor={(newColorResult) =>
                    updateColorAtPixels(newColorResult.detail)}
            />
        {:else}
            <p>not implemented</p>
        {/if}
    </div>
    <Menu
        bind:currentWindow
        {imageData}
    />
</div>

<style>
    .main-page {
        display: flex;
        flex-direction: column;
        height: 100dvh;
        position: relative;
    }

    .main-content {
        overflow-y: hidden;
        flex-grow: 1;
    }
</style>
