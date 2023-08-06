<script lang="ts">
    export let selectedPokemonNr: number;
    export let pokemonSelectOptions = [];
</script>

<select placeholder="Select a Pokemon" bind:value={selectedPokemonNr}>
    {#each pokemonSelectOptions as pokemon}
        <option value={pokemon.id}>
            #{pokemon.id}
            {pokemon.name}
        </option>
    {/each}
</select>
