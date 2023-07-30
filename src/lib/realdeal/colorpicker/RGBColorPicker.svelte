<script context="module" lang="ts">

</script>

<script lang="ts">
    import Slider from "./Slider.svelte";
    import { createEventDispatcher } from "svelte";
    import { RgbColorPickerResult, type RGB } from "./types";
    const dispatch = createEventDispatcher();

    export let initialValue: RGB;
    let currentR: number, currentG: number, currentB: number;
    const minValue = 0;
    const maxValue = 255;

    $: {
        dispatch("change", new RgbColorPickerResult({r: currentR, g: currentG, b: currentB} as RGB));
    }


</script>

<div class="column">
    <Slider bind:currentValue={currentR} initialValue={initialValue.r} {minValue} {maxValue} />
    <Slider bind:currentValue={currentG} initialValue={initialValue.g} {minValue} {maxValue} />
    <Slider bind:currentValue={currentB} initialValue={initialValue.b} {minValue} {maxValue} />
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
    }
</style>
