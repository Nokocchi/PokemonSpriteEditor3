<script context="module" lang="ts">
</script>

<script lang="ts">
    import HslColorPicker from "./HSLColorPicker.svelte";
    import RgbColorPicker from "./RGBColorPicker.svelte";
    import { colorPickerModeStore } from "./store";
    import { ColorPickerMode, getAsRGB, type RGB } from "./types";
    import { getContext } from "svelte";

    export let contextKey: string;
    let initialColor: RGB = getAsRGB(contextKey);

    let { rgbStore }: any = getContext(contextKey);

    const reset = () => {
        $rgbStore = initialColor;
    };

    const changeMode = (mode: string) => {
        $colorPickerModeStore = mode;
    };
</script>

<div class="color-picker-container">
    <div class="color-picker-mode-btn-container">
        <button
            on:click={() => changeMode(ColorPickerMode.RGB)}
            disabled={$colorPickerModeStore == ColorPickerMode.RGB}
        >
            Switch to RGB
        </button>
        <button
            on:click={() => changeMode(ColorPickerMode.HSL)}
            disabled={$colorPickerModeStore == ColorPickerMode.HSL}
        >
            Switch to HSL
        </button>
        <button on:click={reset}> Reset </button>
    </div>
    <div class="color-picker-input-container">
        <div class="color-picker-slider-container">
            {#if $colorPickerModeStore == ColorPickerMode.RGB}
                <RgbColorPicker {contextKey} initialValue={initialColor} />
            {:else if $colorPickerModeStore == ColorPickerMode.HSL}
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
