<script lang="ts">
    import Canvas from "./Canvas.svelte";
    import Menu from "./Menu.svelte";
    import PokemonSelector from "../pokemonpicker/PokemonSelector.svelte";
    import SpriteEditor from "../spriteeditor/SpriteEditor.svelte";
    import { contextColorUpdateStore, contextCurrentLockedValueStore, dirtyImageDataStore } from "../spriteeditor/store";
    import { CurrentWindow } from "../spriteeditor/types";

    let canvas: Canvas;
    let currentWindow: string = CurrentWindow.SELECT;
    let selectedPokemonNr: number;
    let originalImageData: ImageData;

    const setImageData = (newImageData: ImageData) => {
        originalImageData = newImageData;
    };

    const resetPokemon = () => {
        $dirtyImageDataStore = new Uint8ClampedArray(originalImageData.data);
        $contextColorUpdateStore.clear();
        $contextCurrentLockedValueStore.clear();
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
