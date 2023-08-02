<script context="module" lang="ts">
</script>

<script lang="ts">
    import { derived, writable } from "svelte/store";
    import { contextKeyOriginalRGBMap } from "./store";

    import HslColorPicker from "./HSLColorPicker.svelte";
    import RgbColorPicker from "./RGBColorPicker.svelte";
    import {
        RGBToHSL,
        HSLToRGB,
        type ColorPickerResult_i,
        type RGB,
    } from "./types";
    import {
        createEventDispatcher,
        getContext,
        onMount,
        setContext,
    } from "svelte";
    const dispatch = createEventDispatcher();

    const ColorPickerMode = Object.freeze({
        RGB: "RGB",
        HSL: "HSL",
        HEX: "HEX",
    });

    let colorPreview: HTMLCanvasElement;
    let colorPickerMode: string = ColorPickerMode.RGB;
    let rgbColorPicker: RgbColorPicker;
    let hslColorPicker: HslColorPicker;

    export let contextKey: string;
    export let initialColor: RGB;

    const masterOutputRgbStore = writable(undefined);
    const rgbStore = writable(undefined);
    const resetStore = writable(undefined);
    const hslStore = writable(undefined);
    const hslFromRgb = derived(rgbStore, ($currentRGB) => {
        // Ugly hack, fix
        if (!$currentRGB) return;
        RGBToHSL($currentRGB);
    });
    const rgbFromHsl = derived(hslStore, ($currentHSL) => {
        // Ugly hack, fix
        if (!$currentHSL) return;
        HSLToRGB($currentHSL);
    });

    setContext(contextKey, {
        rgbStore: rgbStore,
        hslStore: hslStore,
        hslFromRgb: hslFromRgb,
        rgbFromHsl: rgbFromHsl,
        resetStore: resetStore,
        masterOutputRgbStore: masterOutputRgbStore,
    });

    const setPreviewColor = (newColor: RGB) => {
        if (!colorPreview) return;
        const ctx = colorPreview.getContext("2d");
        ctx.fillStyle =
            "rgba(" +
            newColor.r +
            "," +
            newColor.g +
            "," +
            newColor.b +
            "," +
            1 +
            ")";
        ctx.fillRect(0, 0, colorPreview.width, colorPreview.height);
    };

    const reset = () => {
        if (colorPickerMode === ColorPickerMode.RGB) {
            rgbColorPicker.reset();
        } else if (colorPickerMode === ColorPickerMode.HSL) {
            hslColorPicker.reset();
        } else {
            hslColorPicker.reset();
        }
    };

    $: {
        setPreviewColor($masterOutputRgbStore);
        dispatch("colorChange", $masterOutputRgbStore);
    }

    const changeMode = (mode: string) => {
        colorPickerMode = mode;
    };
</script>

<div class="color-picker-container">
    <div class="color-picker-mode-btn-container">
        <button
            on:click={() => changeMode(ColorPickerMode.RGB)}
            disabled={colorPickerMode == ColorPickerMode.RGB}
        >
            Switch to RGB
        </button>
        <button
            on:click={() => changeMode(ColorPickerMode.HSL)}
            disabled={colorPickerMode == ColorPickerMode.HSL}
        >
            Switch to HSL
        </button>
        <button on:click={reset}> Reset </button>
    </div>
    <div class="color-picker-input-container">
        <canvas bind:this={colorPreview} height="50" width="50" />
        <div class="color-picker-slider-container">
            {#if colorPickerMode == ColorPickerMode.RGB}
                <RgbColorPicker
                    bind:this={rgbColorPicker}
                    {contextKey}
                    initialValue={initialColor}
                />
            {:else if colorPickerMode == ColorPickerMode.HSL}
                <HslColorPicker
                    bind:this={hslColorPicker}
                    {contextKey}
                    initialValue={initialColor}
                />
            {:else}
                <HslColorPicker
                    bind:this={hslColorPicker}
                    {contextKey}
                    initialValue={initialColor}
                />
            {/if}
        </div>
    </div>
</div>

<style>
    .color-picker-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 25px;
    }

    .color-picker-mode-btn-container {
        display: flex;
        flex-direction: row;
    }

    .color-picker-input-container {
        display: flex;
        flex-direction: row;
    }

    .color-picker-slider-container {
        display: flex;
        flex-direction: column;
    }

    div {
        min-width: 50px;
        min-height: 50px;
        background-color: rgb(var(--r), var(--g), var(--b));
    }

    button:disabled {
        pointer-events: none;
    }
</style>
