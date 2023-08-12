<script lang="ts">
    import { onMount } from "svelte";
    import data from "./util/pokedex.json";
    import Search from "./Search.svelte";
    import Dropdown from "./Dropdown.svelte";
    import type { PokemonSelectOption } from "../colorpicker/types";
    import SpecificPokemonCatalog from "./SpecificPokemonCatalog.svelte";

    export let selectedPokemonNr: number;
    export let selectedPokemonImg: HTMLImageElement;
    
    let pokemonSelectOptions: PokemonSelectOption[] = data.map((entry) => {
        return { id: entry.id, name: entry.name.english };
    });
</script>

<Dropdown bind:selectedPokemonNr {pokemonSelectOptions} />
<Search bind:selectedPokemonNr {pokemonSelectOptions} />
<SpecificPokemonCatalog bind:selectedPokemonImg {selectedPokemonNr} />
