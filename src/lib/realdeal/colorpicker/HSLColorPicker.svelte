<script context="module" lang="ts">

</script>

<script lang="ts">
    import Slider from "./Slider.svelte";
    import { createEventDispatcher } from "svelte";
    import { HslColorPickerResult, type HSL, type RGB, RGBToHSL } from "./types";

    const dispatch = createEventDispatcher();
    const minValue = 0;
    const hMaxValue = 359;
    const slMaxValue = 100;

    export let initialValue: RGB;
    let initialHSLValue: HSL = RGBToHSL(initialValue);

    let currentH: number, currentS: number, currentL: number;

    $: {
        dispatch(
            "change",
            new HslColorPickerResult({
                h: currentH,
                s: currentS,
                l: currentL,
            } as HSL)
        );
    }
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