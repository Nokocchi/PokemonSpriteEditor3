<script context="module" lang="ts">
</script>

<script lang="ts">
    import { colorPickerModeStore } from "../store";
    import { ColorPickerMode, getAsRGB, isEquals, type RGB } from "../types";

    import HslColorPicker from "./HSLColorPicker.svelte";
    import RgbColorPicker from "./RGBColorPicker.svelte";
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
        <button on:click={reset} class="reset" disabled={isEquals(initialColor, $rgbStore)}>Reset Color</button>
        <button
            on:click={() => changeMode(ColorPickerMode.RGB)}
            disabled={$colorPickerModeStore == ColorPickerMode.RGB}
        >
            RGB
        </button>
        <button
            on:click={() => changeMode(ColorPickerMode.HSL)}
            disabled={$colorPickerModeStore == ColorPickerMode.HSL}
        >
            HSL
        </button>
    </div>
    {#if $colorPickerModeStore == ColorPickerMode.RGB}
        <RgbColorPicker {contextKey} initialValue={initialColor} />
    {:else if $colorPickerModeStore == ColorPickerMode.HSL}
        <HslColorPicker {contextKey} initialValue={initialColor} />
    {:else}
        <HslColorPicker {contextKey} initialValue={initialColor} />
    {/if}
</div>

<style>
    .color-picker-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 15px;
    }

    .color-picker-mode-btn-container {
        display: flex;
        flex-direction: row;
        gap: 15px;
    }

    button:disabled {
        pointer-events: none;
    }

    .reset:enabled {
        background-color: maroon;
    }
</style>
