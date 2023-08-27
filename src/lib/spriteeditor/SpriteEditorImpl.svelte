<script lang="ts">
    import Palette from "./Palette.svelte";
    import MultiColorPicker from "./colorpicker/MultiColorPicker.svelte";
    import ColorPicker from "./colorpicker/ColorPicker.svelte";
    import { getAsRGB} from "./types";
    import { createEventDispatcher, onMount, setContext } from "svelte";
    import { writable } from "svelte/store";

    export let invisible: boolean;
    export let originalColorPixelLocationsMap: Map<string, number[]>;
    originalColorPixelLocationsMap.forEach((val, key) =>
        setContext(key, { rgbStore: writable(getAsRGB(key)) })
    );
    const dispatch = createEventDispatcher();

    let multiColorModeStarted: boolean = false;
    let currentlySingleSelectedColor: string;
    let currentlyMultiSelectedColors: string[] = [];
    let paletteGridSizes: number[] = [];
    let paletteGridSize: number = 2;
    let clientHeight: number;
    let clientWidth: number;

    onMount(() => {
        let square: number = Math.ceil(Math.sqrt(originalColorPixelLocationsMap.size)) + 1;
        paletteGridSizes = [...Array(square).keys()].splice(1);
    });

    $: tryResetCurrentlySingleSelectedColor(currentlyMultiSelectedColors);

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

</script>

<div class="container" class:invisible>
    <div class="palette-container" class:screen-wider-than-tall = {clientWidth/clientHeight > 1} bind:clientHeight bind:clientWidth>
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
    <div class=actions>
        <button on:click={resetPokemon} class="reset">Reset Pokemon</button>
        <select bind:value={paletteGridSize} class="dropdown">
            {#each paletteGridSizes as gridSize}
                <option value={gridSize}>
                    {gridSize}
                </option>
            {/each}
        </select>
    </div>
    <div class=divider/>
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
                }}>START MULTICOLORING</button
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

    .color-pickers-container {
        height: 240px;
        flex-shrink: 0;
    }

    .reset {
        background-color: maroon;
    }
</style>
