<script lang="ts">
    import { onMount } from "svelte";
    import type { SpritePath } from "../colorpicker/types";
    import { formatHeaderText } from "./SpecificPokemonCatalog.svelte";

    export let allPathsForThisPokemon: SpritePath[];
    export let selectedPokemonImg: HTMLImageElement;

    let allPossibleFilters: Set<string> = new Set(allPathsForThisPokemon.map(path => path.other).flat(1).sort());
    let selectedFilters: string[] = [];
    let filteredPathsToShow: string[] = [];

    onMount(() => {
        showPokemonsObeyingFilter();
    });

    const selectPkmn = (clickEvent: MouseEvent) => {
        selectedPokemonImg = clickEvent.target as HTMLImageElement;
        allPathsForThisPokemon = allPathsForThisPokemon;
    };

    const showPokemonsObeyingFilter = () => {
        filteredPathsToShow = allPathsForThisPokemon
            .filter(
                (path) =>
                    // Base sprite is always included
                    path.other.length === 0 ||
                    // For other sprites, every single path variables must be selected in the filters
                    path.other.every((otherPathVar) =>
                        selectedFilters.includes(otherPathVar)
                    )
            )
            .map((path) => path.fullPath);
    };


    $: selectedFilters && showPokemonsObeyingFilter();
</script>

<div class="sprite-type-selector">
    <div class="filters">
        {#each allPossibleFilters as pathVar}
        <div class="sprite-type-checkbox">
            <input type="checkbox" bind:group={selectedFilters} value={pathVar} />
            {formatHeaderText(pathVar)}
        </div>
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
        padding: 20px;
    }

    .sprite-type-checkbox {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .filters {
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
        gap: 25px;
    }

    .filters input {
        height: 20px;
        width: 20px;
    }

    .sprites {
        display: flex;
        flex-direction: row;
        gap: 15px;
        overflow-x: scroll;
    }

    img {
        border: 2px solid transparent;
        align-self: flex-end;
    }

    img:hover {
        border: 2px solid yellow;
    }

    img.selected {
        border: 2px solid green;
    }

</style>
