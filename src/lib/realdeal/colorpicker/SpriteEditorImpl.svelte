<script lang="ts">
    import Palette from "./Palette.svelte";
    import MultiColorPicker from "./MultiColorPicker.svelte";
    import ColorPicker from "./ColorPicker.svelte";
    import { getAsRGB, type NewColorResult, type RGB } from "./types";
    import { createEventDispatcher, onMount, setContext } from "svelte";
    import { writable } from "svelte/store";

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

    const changeColor = (originalColorKey: string, newColor: RGB): void => {
        const pixelsToChange: number[] =
            originalColorPixelLocationsMap.get(originalColorKey);
        const newColorResult = {
            pixelsToChange: pixelsToChange,
            newColor: newColor,
        } as NewColorResult;
        dispatch("newColor", newColorResult);
    };

    const closeMultiColor = () => {
        multiColorModeStarted = false;
        currentlyMultiSelectedColors = [];
    };

    const resetPokemon = () => {
        dispatch("resetPokemon");
    }

</script>

<div class="container">
    <div class="palette-container" class:wide = {clientWidth/clientHeight > 1} bind:clientHeight bind:clientWidth>
        {#each originalColorPixelLocationsMap.keys() as initialColorKey}
            <Palette
                {initialColorKey}
                bind:currentlySingleSelectedColor
                bind:currentlyMultiSelectedColors
                {multiColorModeStarted}
                {paletteGridSize}
                on:colorChange={(newColor) =>
                    changeColor(initialColorKey, newColor.detail)}
            />
        {/each}
    </div>
    <div class=actions>
        <button on:click={resetPokemon}>reset</button>
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
        height: 190px;
        flex-shrink: 0;
    }
</style>
