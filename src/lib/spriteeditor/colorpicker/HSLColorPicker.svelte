<script context="module" lang="ts">
</script>

<script lang="ts">
    import Slider, { SliderType } from "./Slider.svelte";
    import { getContext, onMount } from "svelte";
    import { type HSL, type RGB, RGBToHSL, HSLToRGB, getSliderColor } from "../types";
    import { contextColorUpdateStore } from "../store";

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
            let update: Map<string, RGB> = new Map<string, RGB>();
            update.set(contextKey, HSLToRGB({h, s, l}));
            $contextColorUpdateStore = update;
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
        sliderType={SliderType.H}
        resetButtondisabled={initialHSLValue.h === currentH}
    />
    <Slider
        bind:currentValue={currentS}
        initialValue={initialHSLValue.s}
        {minValue}
        maxValue={slMaxValue}
        sliderType={SliderType.S}
        --color-min={getSliderColor(currentH, "s", 0)}
        --color-max={getSliderColor(currentH, "s", 100)}
        resetButtondisabled={initialHSLValue.s === currentS}
    />
    <Slider
        bind:currentValue={currentL}
        initialValue={initialHSLValue.l}
        {minValue}
        maxValue={slMaxValue}
        sliderType={SliderType.L}
        --color-min={getSliderColor(currentH, "l", 0)}
        --color-mid={getSliderColor(currentH, null, null)}
        --color-max={getSliderColor(currentH, "l", 100)}
        resetButtondisabled={initialHSLValue.l === currentL}
    />
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>
