<script lang="ts">
    import PokemonSelector from "./pokemonpicker/PokemonSelector.svelte";
    import Canvas from "./Canvas.svelte";
    import {
        CurrentWindow,
        canvasScaler,
        type NewColorResult,
    } from "./colorpicker/types";
    import Menu from "./Menu.svelte";
    import SpriteEditor from "./colorpicker/SpriteEditor.svelte";
    import { dirtyImageDataStore } from "./colorpicker/store";

    let canvas: Canvas;
    let currentWindow: string = CurrentWindow.SELECT;
    let selectedPokemonNr: number;
    let originalImageData: ImageData;

    const setImageData = (newImageData: ImageData) => {
        originalImageData = newImageData;
    };

    const resetPokemon = () => {
        $dirtyImageDataStore = new Uint8ClampedArray(originalImageData.data);
        originalImageData = originalImageData;
    };
</script>

<div class="main-page">
    <Canvas bind:this={canvas} {originalImageData} />
    <div
        class="main-content"
        class:should-scroll={currentWindow === CurrentWindow.SELECT}
    >
        <PokemonSelector
            bind:selectedPokemonNr
            on:imageSelected={(e) => setImageData(e.detail)}
            invisible={currentWindow !== CurrentWindow.SELECT}
        />
        {#key originalImageData}
            <SpriteEditor
                invisible={currentWindow !== CurrentWindow.EDIT}
                {originalImageData}
                on:resetPokemon={resetPokemon}
            />
        {/key}
    </div>
    <Menu bind:currentWindow noPokemonSelected={!originalImageData} />
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
