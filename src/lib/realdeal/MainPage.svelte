<script lang="ts">
    import PokemonSelector from "./PokemonSelector.svelte";
    import Canvas from "./Canvas.svelte";
    import ColorPickerContainer from "./colorpicker/ColorPickerContainer.svelte";
    import type { NewColorResult } from "./colorpicker/types";

    let colorPickerContainer: ColorPickerContainer;
    let canvas: Canvas;

    const pokemonChangeHandler = (
        pkmnChangeEvent: CustomEvent<HTMLImageElement>
    ) => {
        let selectedPokemonImg: HTMLImageElement = pkmnChangeEvent.detail;
        canvas.setSelectedPokemon(selectedPokemonImg);
    };

    const setInitialColorPickerValues = () => {
        let imageData: ImageData = canvas.getOriginalPixelData();
        colorPickerContainer.setInitialValues(imageData);
    };

    const updateColorAtPixels = (newColorResult: NewColorResult): void => {
        canvas.updateColor(newColorResult);
    }

</script>

<div class="main-page">
    <Canvas bind:this={canvas} on:originalCanvasReady={setInitialColorPickerValues}/>
    <ColorPickerContainer bind:this={colorPickerContainer} on:newColor={(newColorResult) => updateColorAtPixels(newColorResult.detail)}/>
    <PokemonSelector on:pkmnChanged={pokemonChangeHandler} />
</div>

<style>
    .main-page {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
