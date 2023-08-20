<script context="module" lang="ts">
</script>

<script lang="ts">
    import HslColorPicker from "./HSLColorPicker.svelte";
    import RgbColorPicker from "./RGBColorPicker.svelte";
    import { getAsRGB, isEquals, type RGB } from "./types";
    import { getContext } from "svelte";

    const ColorPickerMode = Object.freeze({
        RGB: "RGB",
        HSL: "HSL",
        HEX: "HEX",
    });

    export let contextKey: string;
    let initialColor: RGB = getAsRGB(contextKey);

    let colorPickerMode: string = ColorPickerMode.RGB;
    let { rgbStore }: any = getContext(contextKey);

    const reset = () => {
        $rgbStore = initialColor;
    };

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
        <div class="color-picker-slider-container">
            {#if colorPickerMode == ColorPickerMode.RGB}
                <RgbColorPicker {contextKey} initialValue={initialColor} />
            {:else if colorPickerMode == ColorPickerMode.HSL}
                <HslColorPicker {contextKey} initialValue={initialColor} />
            {:else}
                <HslColorPicker {contextKey} initialValue={initialColor} />
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

    button:disabled {
        pointer-events: none;
    }
</style>
