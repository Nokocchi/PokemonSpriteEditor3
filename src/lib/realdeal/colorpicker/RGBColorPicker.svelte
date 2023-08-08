<script context="module" lang="ts">
</script>

<script lang="ts">
    import Slider from "./Slider.svelte";
    import { getContext, onMount } from "svelte";
    import {
        type RGB,
    } from "./types";

    export const reset = () => {
        setCurrentColor(initialValue);
    };

    export let initialValue: RGB;
    export let contextKey: string;

    const minValue = 0;
    const maxValue = 255;
    const { rgbStore }: any = getContext(contextKey);

    let currentR: number, currentG: number, currentB: number;

    $: setCurrentColor($rgbStore);

    $: $rgbStore = {
        r: currentR,
        g: currentG,
        b: currentB,
    };

    const setCurrentColor = (newColor: RGB) => {
        currentR = newColor.r;
        currentG = newColor.g;
        currentB = newColor.b;
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
