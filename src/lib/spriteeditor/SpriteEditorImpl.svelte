<script lang="ts">
    import Palette from "./Palette.svelte";
    import MultiColorPicker from "./colorpicker/MultiColorPicker.svelte";
    import ColorPicker from "./colorpicker/ColorPicker.svelte";
    import { getAsRGB} from "./types";
    import { createEventDispatcher, onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import { downloadPokemonStore, paletteGridSizeStore } from "./store";

    export let originalColorPixelLocationsMap: Map<string, number[]>;
    export let invisible: boolean;

    originalColorPixelLocationsMap.forEach((val, key) =>
        setContext(key, { rgbStore: writable(getAsRGB(key)) })
    );
    const dispatch = createEventDispatcher();

    let multiColorModeStarted: boolean = false;
    let currentlySingleSelectedColor: string;
    let currentlyMultiSelectedColors: string[] = [];
    // We want a list of numbers from 1 to sqrt(n) + 1, where n is the amount of colors in the Pokemon
    let paletteGridSizes: number[] = [...Array(Math.ceil(Math.sqrt(originalColorPixelLocationsMap.size)) + 1).keys()].splice(1);
    let paletteGridSize: number = $paletteGridSizeStore;
    let clientHeight: number;
    let clientWidth: number;

    $: tryResetCurrentlySingleSelectedColor(currentlyMultiSelectedColors);
    $: $paletteGridSizeStore = paletteGridSize;

    const tryResetCurrentlySingleSelectedColor = (currentMultiSelected: string[]) => {
        if (currentMultiSelected.length && currentlySingleSelectedColor) {
            currentlySingleSelectedColor = undefined;
        }
    };

    const closeMultiColor = () => {
        multiColorModeStarted = false;
        currentlyMultiSelectedColors = [];
    };

    const resetPokemon = () => {
        dispatch("resetPokemon");
    }

    const downloadPokemon = () => {
        $downloadPokemonStore = !$downloadPokemonStore;
    }

</script>

<div class="container" class:invisible>
    <div class="palette-container" class:screen-wider-than-tall = {clientWidth/clientHeight > 1} class:blacked-out={multiColorModeStarted} bind:clientHeight bind:clientWidth>
        {#each [...originalColorPixelLocationsMap] as [initialColorKey, pixelLocations]}
            <Palette
                {initialColorKey}
                {pixelLocations}
                {multiColorModeStarted}
                {paletteGridSize}
                bind:currentlySingleSelectedColor
                bind:currentlyMultiSelectedColors
            />
        {/each}
    </div>
    <div class="actions">
        <button on:click={resetPokemon} class="reset">Reset Pokemon</button>
        <select bind:value={paletteGridSize} class="dropdown">
            {#each paletteGridSizes as gridSize}
                <option value={gridSize}>
                    {gridSize}
                </option>
            {/each}
        </select>
        <button on:click={downloadPokemon} class="save">Download</button>
    </div>
    <div class="divider"/>
    <div class="color-pickers-container">
        {#if currentlySingleSelectedColor}
            {#key { currentlySingleSelectedColor }}
                <ColorPicker
                    contextKey={currentlySingleSelectedColor}
                />
            {/key}
        {/if}
        {#if currentlyMultiSelectedColors.length > 1 && !multiColorModeStarted}
            <button
                on:click={() => {
                    multiColorModeStarted = true;
                }}>Start multicolor mode</button
            >
        {/if}
        {#if multiColorModeStarted}
            <MultiColorPicker {currentlyMultiSelectedColors} on:close={closeMultiColor} />
        {/if}
    </div>
</div>

<style>

    .container {
        display: flex;
        flex-direction: column;
        padding: 30px;
        row-gap: 20px;
        box-sizing: border-box;
        height: 100%;
    }

    .container.invisible {
        display: none;
    }

    .actions {
        display:flex;
        flex-direction: row;
        gap: 20px;
        justify-content: center;
    }

    .divider {
        width: 100%;
        border-bottom: 1px solid white;
    }

    .palette-container {
        flex-grow: 1;
        overflow-x: scroll;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 5px;
        justify-content: flex-end;
    }

    .blacked-out {
        opacity: 33%;
    }

    .color-pickers-container {
        height: 271px;
        flex-shrink: 0;
    }

    .reset {
        white-space: nowrap;
        background-color: maroon;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
