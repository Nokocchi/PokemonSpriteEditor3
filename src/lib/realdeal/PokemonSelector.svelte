<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let pkmnNum: number = 1;

    const dispatch = createEventDispatcher();
    let selectedPokemonImg: HTMLImageElement;
    let selectImgDisabled: boolean = true;

    let increment = () => {
        if (pkmnNum < 250) {
            pkmnNum++;
        } else {
            pkmnNum = 1;
        }
    };

    function decrement() {
        if (pkmnNum > 1) {
            pkmnNum--;
        } else {
            pkmnNum = 251;
        }
    }

    let selected = () => {
        if (!selectedPokemonImg) return;
        dispatch("pkmnChanged", selectedPokemonImg);
    };
</script>

<img
    bind:this={selectedPokemonImg}
    src="crystal/{pkmnNum}.png"
    alt="img"
    on:load={() => (selectImgDisabled = false)}
/>
<button on:click={decrement}>
    Click here to cycle backwards through pokemons!</button
>
<button on:click={increment}>
    Click here to cycle forwards through pokemons!
</button>
<button disabled={selectImgDisabled} on:click={selected}>Select</button>
