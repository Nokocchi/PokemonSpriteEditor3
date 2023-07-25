<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    export let selectedPokemonImg: HTMLImageElement;
    let canvas: HTMLCanvasElement;

    let getCanvasContext = () => {
        return canvas.getContext("2d");
    };

    let updateCanvasWithNewSelectedPokemon = (pkmnImage: HTMLImageElement) => {
        if (pkmnImage) {
            canvas.height = pkmnImage.height;
            canvas.width = pkmnImage.width;
            getCanvasContext().drawImage(selectedPokemonImg, 0, 0);
        }
    };

    $: updateCanvasWithNewSelectedPokemon(selectedPokemonImg);
</script>

<canvas bind:this={canvas} />

<style>
</style>
