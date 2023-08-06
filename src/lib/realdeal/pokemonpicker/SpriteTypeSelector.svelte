<script lang="ts">
    export let paths: string[];
    export let selectedPokemonImg: HTMLImageElement;
    let pathVars: Set<string> = new Set();
    let filters: string[] = [];
    let filteredPathsToShow: string[] = [];

    const selectPkmn = (clickEvent: MouseEvent) => {
        selectedPokemonImg = clickEvent.target as HTMLImageElement;
    };

    const setPathVars = (paths: string[]) => {
        pathVars.clear();
        paths.forEach((path) => {
            let possiblePathVars: string[] = path.split("/");
            let adjusted: string[] = possiblePathVars.slice(
                3,
                possiblePathVars.length - 1
            );
            adjusted.forEach((pathVariable) => pathVars.add(pathVariable));
        });
    };

    const applyFilters = (filters: string[]) => {
        filteredPathsToShow = paths.filter((path) =>
        // FIX: 
        // 1) Make it so that the string has to match all filters
        // 2) Find a way to elegantly include "standard" sprites - maybe use SpritePath type or similar
            filters.some((substring) => path.includes(substring)) || path.split("/").length === 4
        );
    };

    $: setPathVars(paths);
    $: applyFilters(filters);
</script>

{#each pathVars as pathVar}
    <input type="checkbox" bind:group={filters} value={pathVar} />
    {pathVar}
{/each}

{#each filteredPathsToShow as path}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <img src={path} alt="img" on:click={selectPkmn} />
{/each}

<style>
    img:hover {
        outline: 2px solid yellow;
    }
</style>