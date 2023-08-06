<script lang="ts">
    import AutoComplete from "simple-svelte-autocomplete"; // https://github.com/pstanoev/simple-svelte-autocomplete
    import type { PokemonSelectOption } from "../colorpicker/types";

    export let selectedPokemonNr: number;
    export let pokemonSelectOptions: PokemonSelectOption[];
    let selectedPokemon;
    $: selectedPokemonNr = selectedPokemon && selectedPokemon.id;
    $: setSelected(selectedPokemonNr);

    const setSelected = (selectedPokemonNr: number) => {
        if (selectedPokemonNr && pokemonSelectOptions) {
            selectedPokemon = pokemonSelectOptions.find(
                (pkmn) => pkmn.id === selectedPokemonNr
            );
        }
    };
</script>

<AutoComplete
    items={pokemonSelectOptions}
    bind:selectedItem={selectedPokemon}
    labelFieldName="name"
    valueFieldName="id"
/>
