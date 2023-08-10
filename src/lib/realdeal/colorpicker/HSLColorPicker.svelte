<script context="module" lang="ts">
</script>

<script lang="ts">
    import Slider from "./Slider.svelte";
    import { getContext, onMount } from "svelte";
    import { type HSL, type RGB, RGBToHSL, HSLToRGB } from "./types";

    export const reset = () => {
        setCurrentColor(initialValue);
    };

    export let initialValue: RGB;
    export let contextKey: string;

    const minValue = 0;
    const hMaxValue = 359;
    const slMaxValue = 100;
    const { rgbStore }: any = getContext(contextKey);

    let initialHSLValue: HSL;
    let currentH: number, currentS: number, currentL: number;
    let mounted: boolean = false;

    const setCurrentColor = (newColor: RGB) => {
        if(!mounted || newColor === undefined) return;
        ({h: currentH, s: currentS, l: currentL} = RGBToHSL(newColor))
    };

    const setRgbStoreFromSlider = (h: number, s: number, l: number) => {
        if (mounted) {
            $rgbStore = HSLToRGB({h, s, l});
        }
    }

    onMount(() => {
        mounted = true;
        setCurrentColor($rgbStore);
    });

    $: setCurrentColor($rgbStore);
    $: setRgbStoreFromSlider(currentH, currentS, currentL);
    $: initialHSLValue = RGBToHSL(initialValue);
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
