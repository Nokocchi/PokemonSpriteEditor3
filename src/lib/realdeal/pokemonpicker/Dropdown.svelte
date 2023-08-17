<script lang="ts">
    export let selectedPokemonNr: number;
    export let pokemonSelectOptions = [];
</script>

<select placeholder="Select a Pokemon" bind:value={selectedPokemonNr} class="dropdown">
    <option value="placeholder" disabled selected hidden>Pokedex number..</option>
    {#each pokemonSelectOptions as pokemon}
        <option value={pokemon.id}>
            #{pokemon.id}
            {pokemon.name}
        </option>
    {/each}
</select>

<style>
    .dropdown {
        width: 100%;
        height: 45px;
    }
</style>
