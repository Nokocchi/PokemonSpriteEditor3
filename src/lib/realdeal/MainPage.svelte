<script lang="ts">
    import PokemonSelector from "./pokemonpicker/PokemonSelector.svelte";
    import Canvas from "./Canvas.svelte";
    import { CurrentWindow, type NewColorResult } from "./colorpicker/types";
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

    const showPage = (page: string) => {
        currentWindow = page;
    };
</script>

<div class="main-page">
    <Canvas bind:this={canvas} {imageData} />
    <div class="main-content" class:should-scroll={currentWindow === CurrentWindow.SELECT}>
        {#if currentWindow === CurrentWindow.SELECT}
            <PokemonSelector bind:selectedPokemonNr bind:imageData />
        {:else if currentWindow === CurrentWindow.EDIT}
            <SpriteEditor
                bind:this={spriteEditor}
                bind:imageData
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
        on:selectPokemon={() => showPage(CurrentWindow.SELECT)}
        on:editSprite={() => showPage(CurrentWindow.EDIT)}
        on:palettes={() => showPage(CurrentWindow.PALETTES)}
        {imageData}
    />
</div>

<style>
    .main-page {
        /*overflow-y: hidden;*/
        display: flex;
        flex-direction: column;
        height: 100dvh;
    }

    .main-content {
        overflow-y: hidden;
        flex-grow: 1;
    }
</style>
