<script context="module" lang="ts">
</script>

<script lang="ts">
    import Slider from "./Slider.svelte";
    import { createEventDispatcher, getContext, onMount } from "svelte";
    import {
        HslColorPickerResult,
        type HSL,
        type RGB,
        RGBToHSL,
        type HslColorPickerResult_i,
        HSLToRGB,
    } from "./types";

    const dispatch = createEventDispatcher();
    const minValue = 0;
    const hMaxValue = 359;
    const slMaxValue = 100;
    let currentHSL: HSL;

    export let initialValue: RGB;
    export let contextKey: string;
    let currentH: number, currentS: number, currentL: number;

    const { rgbStore, hslStore, hslFromRgb, rgbFromHsl, masterOutputRgbStore }: any =
        getContext(contextKey);

    $: currentHSL = {
        h: currentH,
        s: currentS,
        l: currentL,
    };

    $: initialHSLValue = RGBToHSL(initialValue);

    export const reset = () => {
        setCurrentColor(initialHSLValue);
    }

    const setCurrentColor = (colorFromOtherMode: HSL) => {
        if(!colorFromOtherMode) return;
        currentH = colorFromOtherMode.h;
        currentS = colorFromOtherMode.s;
        currentL = colorFromOtherMode.l;
    }

    $: $masterOutputRgbStore = HSLToRGB(currentHSL);

    $: setCurrentColor($hslFromRgb);

</script>

<div class="column">
    <Slider
        bind:currentValue={currentH}
        initialValue={initialHSLValue.h}
        {minValue}
        maxValue={hMaxValue}
    />
    <Slider
        bind:currentValue={currentS}
        initialValue={initialHSLValue.s}
        {minValue}
        maxValue={slMaxValue}
    />
    <Slider
        bind:currentValue={currentL}
        initialValue={initialHSLValue.l}
        {minValue}
        maxValue={slMaxValue}
    />
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
    }
</style>
