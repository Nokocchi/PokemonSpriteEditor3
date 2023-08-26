<script lang="ts">
    import PokemonSelector from "./pokemonpicker/PokemonSelector.svelte";
    import Canvas from "./Canvas.svelte";
    import { CurrentWindow, canvasScaler, type NewColorResult } from "./colorpicker/types";
    import Menu from "./Menu.svelte";
    import SpriteEditor from "./colorpicker/SpriteEditor.svelte";

    let canvas: Canvas;
    let currentWindow: string = CurrentWindow.SELECT;
    let originalImageData: ImageData;
    let selectedPokemonNr: number;




    const updateColorAtPixels = (newColorResult: NewColorResult): void => {
        canvas.updateColor(newColorResult);
    };



    const setImageData = (newImageData: ImageData) => {
        originalImageData = newImageData;
    }

</script>


<div class="main-page">
    <Canvas bind:this={canvas} {originalImageData}/>
    <div class="main-content" class:should-scroll={currentWindow === CurrentWindow.SELECT}>
        {#if currentWindow === CurrentWindow.SELECT}
            <PokemonSelector bind:selectedPokemonNr on:imageSelected={(e) => setImageData(e.detail)} />
        {:else if currentWindow === CurrentWindow.EDIT}
            <SpriteEditor
                {originalImageData}
                on:resetPokemon={() => originalImageData = originalImageData}
                on:newColor={(newColorResult) =>
                    updateColorAtPixels(newColorResult.detail)}
            />
        {:else}
            <p>not implemented</p>
        {/if}
    </div>
    <Menu
        bind:currentWindow
        imageData={originalImageData}
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
