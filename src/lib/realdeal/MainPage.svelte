<script lang="ts">
    import PokemonSelector from "./pokemonpicker/PokemonSelector.svelte";
    import Canvas from "./Canvas.svelte";
    import ColorPickerContainer from "./colorpicker/ColorPickerContainer.svelte";
    import { CurrentWindow, type NewColorResult } from "./colorpicker/types";
    import Menu from "./Menu.svelte";

    let colorPickerContainer: ColorPickerContainer;
    let canvas: Canvas;
    let currentWindow: string = CurrentWindow.SELECT;
    let selectedPokemonImg: HTMLImageElement;
    let imageData: ImageData
    let selectedPokemonNr: number;

    const setInitialColorPickerValues = () => {
        imageData = canvas.getOriginalPixelData();
    };

    const updateColorAtPixels = (newColorResult: NewColorResult): void => {
        canvas.updateColor(newColorResult);
    };

    const showPage = (page: string) => {
        currentWindow = page;
    };
</script>

<div class="main-page">
    <Canvas
        bind:this={canvas}
        selectedPokemonImg={selectedPokemonImg}
        on:originalCanvasReady={setInitialColorPickerValues}
    />
    {#if currentWindow == CurrentWindow.SELECT}
        <PokemonSelector bind:selectedPokemonNr bind:selectedPokemonImg />
    {:else if currentWindow == CurrentWindow.EDIT}
        <ColorPickerContainer
            bind:this={colorPickerContainer}
            imageData = {imageData}
            on:newColor={(newColorResult) =>
                updateColorAtPixels(newColorResult.detail)}
        />
    {:else}
        <p>not implemented</p>
    {/if}
    <Menu
        bind:currentWindow
        on:selectPokemon={() => showPage(CurrentWindow.SELECT)}
        on:editSprite={() => showPage(CurrentWindow.EDIT)}
        on:palettes={() => showPage(CurrentWindow.PALETTES)}
        selectedPokemonImg = {selectedPokemonImg}
    />
</div>

<style>
    .main-page {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
