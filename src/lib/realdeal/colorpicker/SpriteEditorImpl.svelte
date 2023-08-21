<script lang="ts">
    import Palette from "./Palette.svelte";
    import MultiColorPicker from "./MultiColorPicker.svelte";
    import ColorPicker from "./ColorPicker.svelte";
    import { getAsRGB, type NewColorResult, type RGB } from "./types";
    import { createEventDispatcher, setContext } from "svelte";
    import { writable } from "svelte/store";

    export let originalColorPixelLocationsMap: Map<string, number[]>;
    originalColorPixelLocationsMap.forEach((val, key) =>
        setContext(key, { rgbStore: writable(getAsRGB(key)) })
    );
    const dispatch = createEventDispatcher();

    let multiColorModeStarted: boolean = false;
    let currentlySingleSelectedColor: string;
    let currentlyMultiSelectedColors: string[] = [];

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
</script>

<div class="container">
    <div class="palette-container">
        {#each originalColorPixelLocationsMap.keys() as initialColorKey}
            <Palette
                {initialColorKey}
                bind:currentlySingleSelectedColor
                bind:currentlyMultiSelectedColors
                {multiColorModeStarted}
                on:colorChange={(newColor) =>
                    changeColor(initialColorKey, newColor.detail)}
            />
        {/each}
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
