<script context="module" lang="ts">
</script>

<script lang="ts">
    import Slider from "./Slider.svelte";
    import { createEventDispatcher, getContext } from "svelte";
    import {
        RgbColorPickerResult,
        type RGB,
        type RgbColorPickerResult_i,
    } from "./types";
    const dispatch = createEventDispatcher();

    export let initialValue: RGB;
    export let contextKey: string;
    let currentR: number, currentG: number, currentB: number;
    let currentRGB: RGB;
    const minValue = 0;
    const maxValue = 255;

    const { rgbStore, hslStore, hslFromRgb, rgbFromHsl, resetStore, masterOutputRgbStore }: any =
        getContext(contextKey);

    export const reset = () => {
        setCurrentColor(initialValue);
    }

    const setCurrentColor = (colorFromOtherMode: RGB) => {
        if(!colorFromOtherMode) return;
        currentR = colorFromOtherMode.r;
        currentG = colorFromOtherMode.g;
        currentB = colorFromOtherMode.b;
    }

    $: $rgbStore = currentRGB;
    $: $masterOutputRgbStore = $rgbStore;

    $: setCurrentColor($rgbFromHsl);

    $: currentRGB = {
        r: currentR,
        g: currentG,
        b: currentB,
    };

</script>

<div class="column">
    <Slider
        bind:currentValue={currentR}
        initialValue={initialValue.r}
        {minValue}
        {maxValue}
    />
    <Slider
        bind:currentValue={currentG}
        initialValue={initialValue.g}
        {minValue}
        {maxValue}
    />
    <Slider
        bind:currentValue={currentB}
        initialValue={initialValue.b}
        {minValue}
        {maxValue}
    />
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
    }
</style>
