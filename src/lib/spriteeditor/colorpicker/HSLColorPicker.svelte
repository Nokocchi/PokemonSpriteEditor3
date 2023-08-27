<script context="module" lang="ts">
</script>

<script lang="ts">
    import Slider, { SliderType } from "./Slider.svelte";
    import { getContext, onMount } from "svelte";
    import { type HSL, type RGB, RGBToHSL, HSLToRGB } from "../types";

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
    let minLRGB: RGB;
    let maxLRGB: RGB;
    let minSRGB: RGB;
    let maxSRGB: RGB;
    let currentRGB: RGB;

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

    const minL = (h: number) => {
        let hsl: HSL = {h: h, s: 100, l: 50};
        hsl.l = 0;
        return HSLToRGB(hsl);
    }

    const maxL = (h: number) => {
        let hsl: HSL = {h: h, s: 100, l: 50};
        hsl.l = 100;
        return HSLToRGB(hsl);
    }

    const minS = (h: number) => {
        let hsl: HSL = {h: h, s: 100, l: 50};
        hsl.s = 0;
        return HSLToRGB(hsl);
    }

    const maxS = (h: number) => {
        let hsl: HSL = {h: h, s: 100, l: 50};
        hsl.s = 100;
        return HSLToRGB(hsl);
    }

    const getCurrentRGB = (h: number) => {
        let hsl: HSL = {h: h, s: 100, l: 50};
        return HSLToRGB(hsl);
    }

    $: setCurrentColor($rgbStore);
    $: setRgbStoreFromSlider(currentH, currentS, currentL);
    $: initialHSLValue = RGBToHSL(initialValue);
    $: minLRGB = minL(currentH)
    $: maxLRGB = maxL(currentH)
    $: minSRGB = minS(currentH)
    $: maxSRGB = maxS(currentH)
    $: currentRGB = getCurrentRGB(currentH);
</script>

<div class="column">
    <Slider
        bind:currentValue={currentH}
        initialValue={initialHSLValue.h}
        {minValue}
        maxValue={hMaxValue}
        sliderType={SliderType.H}
    />
    <Slider
        bind:currentValue={currentS}
        initialValue={initialHSLValue.s}
        {minValue}
        maxValue={slMaxValue}
        sliderType={SliderType.S}
        --color-min={"rgb(" + minSRGB.r + ", " + minSRGB.g + ", " + minSRGB.b + ")"}
        --color-max={"rgb(" + maxSRGB.r + ", " + maxSRGB.g + ", " + maxSRGB.b + ")"}
    />
    <Slider
        bind:currentValue={currentL}
        initialValue={initialHSLValue.l}
        {minValue}
        maxValue={slMaxValue}
        sliderType={SliderType.L}
        --color-min={"rgb(" + minLRGB.r + ", " + minLRGB.g + ", " + minLRGB.b + ")"}
        --color-mid={"rgb(" + currentRGB.r + ", " + currentRGB.g + ", " + currentRGB.b + ")"}
        --color-max={"rgb(" + maxLRGB.r + ", " + maxLRGB.g + ", " + maxLRGB.b + ")"}
    />
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
    }
</style>
