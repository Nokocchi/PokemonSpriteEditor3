<script lang="ts">
    import { onMount } from "svelte";
    import data from "./util/pokedex.json";
    import { createEventDispatcher } from "svelte";
    import Search from "./Search.svelte";
    import Dropdown from "./Dropdown.svelte";
    import type { PokemonSelectOption } from "../colorpicker/types";
    import SpecificPokemonCatalog from "./SpecificPokemonCatalog.svelte";

    const dispatch = createEventDispatcher();
    let selectedPokemonNr: number;
    let pokemonSelectOptions: PokemonSelectOption[];
    let selectedPokemonImg: HTMLImageElement;
    let selectImgDisabled: boolean = true;

    onMount(() => {
        pokemonSelectOptions = data.map((entry) => {
            return { id: entry.id, name: entry.name.english };
        });
    });



    let increment = () => {
        if (selectedPokemonNr < 250) {
            selectedPokemonNr++;
        } else {
            selectedPokemonNr = 1;
        }
    };

    function decrement() {
        if (selectedPokemonNr > 1) {
            selectedPokemonNr--;
        } else {
            selectedPokemonNr = 251;
        }
    }

    $: {
        if (!selectedPokemonImg) break $;
        dispatch("pkmnChanged", selectedPokemonImg);
    }
</script>

<Dropdown bind:selectedPokemonNr {pokemonSelectOptions} />
<Search bind:selectedPokemonNr {pokemonSelectOptions} />
<SpecificPokemonCatalog
    bind:selectedPokemonImg = {selectedPokemonImg}
    selectedPokemonNr = {selectedPokemonNr}
/>
<button on:click={decrement}>
    Click here to cycle backwards through pokemons!</button
>
<button on:click={increment}>
    Click here to cycle forwards through pokemons!
</button>
