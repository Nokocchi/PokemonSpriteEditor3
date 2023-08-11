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

    onMount(() => {
        pokemonSelectOptions = data.map((entry) => {
            return { id: entry.id, name: entry.name.english };
        });
    });

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
