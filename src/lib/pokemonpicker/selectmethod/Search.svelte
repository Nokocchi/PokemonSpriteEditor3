<script lang="ts">
    import AutoComplete from "simple-svelte-autocomplete"; // https://github.com/pstanoev/simple-svelte-autocomplete
    import type { PokemonSelectOption } from "../../spriteeditor/types";

    export let selectedPokemonNr: number;
    export let pokemonSelectOptions: PokemonSelectOption[];
    let sortedPokemonSelectOptions: PokemonSelectOption[];

    let selectedPokemon;
    $: selectedPokemonNr = selectedPokemon && selectedPokemon.id;
    $: setSelected(selectedPokemonNr);
    $: pokemonSelectOptions && setSortedOptions(pokemonSelectOptions);

    const setSortedOptions = (options: PokemonSelectOption[]) => {
        sortedPokemonSelectOptions = [...options].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    };

    // Currently trying to clear input on file upload..
    const setSelected = (selectedPokemonNr: number) => {
        if (pokemonSelectOptions) {
            selectedPokemon = pokemonSelectOptions.find(
                (pkmn) => pkmn.id === selectedPokemonNr
            );
        }
    };
</script>

<AutoComplete
    items={sortedPokemonSelectOptions}
    bind:selectedItem={selectedPokemon}
    labelFieldName="name"
    valueFieldName="id"
    placeholder="Search (Alphabetical)"
/>

<style>
    /* Global needed as Svelte doesn't know we gave the AutoComplete a className**/
    :global(.autocomplete) {
        width: 100%;
        height: 45px;
    }

    :global(.autocomplete-list) {
        background-color: #000000 !important;
    }

    :global(.autocomplete-list.hidden) {
        display: none;
    }
</style>
