<script lang="ts">
    import type { SpritePath } from "../colorpicker/types";

    export let paths: SpritePath[];
    let possiblePathVars: Set<string> = new Set();

    export let selectedPokemonImg: HTMLImageElement;
    let filters: string[] = [];
    let filteredPathsToShow: string[] = [];

    const selectPkmn = (clickEvent: MouseEvent) => {
        selectedPokemonImg = clickEvent.target as HTMLImageElement;
        paths = paths;
    };

    const applyFilters = () => {
        filteredPathsToShow = paths
            .filter(
                (path) =>
                    // Base sprite is always included
                    path.other.length === 0 ||
                    // For other sprites, every single path variables must be selected in the filters
                    path.other.every((otherPathVar) =>
                        filters.includes(otherPathVar)
                    )
            )
            .map((path) => path.fullPath);
    };

    const setup = (paths: SpritePath[]) => {
        possiblePathVars.clear();
        paths.forEach((path) =>
            path.other.forEach((otherPathVar) =>
                possiblePathVars.add(otherPathVar)
            )
        );
        possiblePathVars = possiblePathVars;
        applyFilters();
    };

    $: setup(paths);
    $: filters && applyFilters();
</script>

<div class="sprite-type-selector">
    <div class="filters">
        {#each possiblePathVars as pathVar}
            <input type="checkbox" bind:group={filters} value={pathVar} />
            {pathVar}
        {/each}
    </div>

    <div class="sprites">
        {#each filteredPathsToShow as path}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <img
                src={path}
                alt="img"
                class:selected={selectedPokemonImg && selectedPokemonImg.src.includes(path)}
                on:click={selectPkmn}
            />
        {/each}
    </div>
</div>

<style>
    .sprite-type-selector {
        display: flex;
        flex-direction: column;
    }

    .filters,
    .sprites {
        display: flex;
        flex-direction: row;
    }

    img:hover {
        outline: 2px solid yellow;
    }

    img.selected {
        outline: 2px solid green;
    }
</style>
