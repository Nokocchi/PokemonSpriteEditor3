<script lang="ts">
    import PokemonSelector from "./PokemonSelector.svelte";
    import Canvas from "./Canvas.svelte";

    let selectedPokemonImg: HTMLImageElement;
    let pokemonChangeHandler = (
        pkmnChangeEvent: CustomEvent<HTMLImageElement>
    ) => {
        selectedPokemonImg = pkmnChangeEvent.detail;
    };
</script>

<div class="main-page">
    <Canvas {selectedPokemonImg} />
    <PokemonSelector on:pkmnChanged={pokemonChangeHandler} />
</div>

<style>
    .main-page {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
