<script lang="ts">
    import PokemonSelector from "./pokemonpicker/PokemonSelector.svelte";
    import Canvas from "./Canvas.svelte";
    import ColorPickerContainer from "./colorpicker/ColorPickerContainer.svelte";
    import { CurrentWindow, type NewColorResult } from "./colorpicker/types";
    import Menu from "./Menu.svelte";

    let colorPickerContainer: ColorPickerContainer;
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
    <div class="main-content">
        {#if currentWindow == CurrentWindow.SELECT}
            <PokemonSelector bind:selectedPokemonNr bind:imageData />
        {:else if currentWindow == CurrentWindow.EDIT}
            <ColorPickerContainer
                bind:this={colorPickerContainer}
                {imageData}
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
        overflow-y: hidden;
        display: flex;
        flex-direction: column;
        height: 100dvh;
    }

    .main-content {
        overflow-y: scroll;
        flex-grow: 1;
    }
</style>
