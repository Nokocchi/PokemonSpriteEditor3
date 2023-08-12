<script context="module" lang="ts">
</script>

<script lang="ts">
    import Slider from "./Slider.svelte";
    import { getContext, onMount } from "svelte";
    import { type RGB } from "./types";

    export const reset = () => {
        setCurrentColor(initialValue);
    };

    export let initialValue: RGB;
    export let contextKey: string;
    export let disabled: boolean;

    const minValue = 0;
    const maxValue = 255;
    const { rgbStore }: any = getContext(contextKey);

    let age2 = "27";
    let age: string = "27";
    let currentR: number, currentG: number, currentB: number;
    let mounted: boolean = false;

    const setCurrentColor = (newColor: RGB) => {
        // Only set current color if this component is mounted and the color has a value
        if (!mounted || newColor === undefined) return;
        ({ r: currentR, g: currentG, b: currentB } = newColor);
    };

    const setRgbStoreFromSlider = (r: number, g: number, b: number) => {
        // We are not interested in updating the output color store (rgbstore) if this component isn't mounted.
        // sliders will have undefined values before this component is mounted
        if (mounted) {
            $rgbStore = { r, g, b };
        }
    };

    onMount(() => {
        mounted = true;
        // When switching color mode, the new color picker will get mounted with the initial colors. In this case, set sliders to the current rgbstore value
        // Special case: At first "page load", the rgbstore is initialised with undefined value
        // This means that when the Pokemon is loaded and color pickers initialised, we want to set the rgbstore value from the sliders, not the other way around
        // Luckily, setCurrentColor doesn't allow setting the sliders to undefined, so we don't have to worry
        setCurrentColor($rgbStore);
    });

    $: setCurrentColor($rgbStore);
    $: setRgbStoreFromSlider(currentR, currentG, currentB);
</script>

<div class="column">
    <Slider
        bind:currentValue={currentR}
        initialValue={initialValue.r}
        {minValue}
        {maxValue}
        {disabled}
    />
    <Slider
        bind:currentValue={currentG}
        initialValue={initialValue.g}
        {minValue}
        {maxValue}
        {disabled}
    />
    <Slider
        bind:currentValue={currentB}
        initialValue={initialValue.b}
        {minValue}
        {maxValue}
        {disabled}
    />
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
    }
</style>
