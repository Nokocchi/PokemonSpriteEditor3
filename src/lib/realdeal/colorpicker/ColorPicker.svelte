<script context="module" lang="ts">
</script>

<script lang="ts">
    import { writable } from "svelte/store";
    import HslColorPicker from "./HSLColorPicker.svelte";
    import RgbColorPicker from "./RGBColorPicker.svelte";
    import {
        type RGB,
    } from "./types";
    import {
        createEventDispatcher,
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

    export let contextKey: string;
    export let initialColor: RGB;

    const rgbStore = writable(initialColor);

    setContext(contextKey, {
        rgbStore: rgbStore
    });

    onMount(() => {
        // Once all the color pickers are ready, re-set the rgbstore to trigger drawing to the preview/palette
        $rgbStore = $rgbStore;
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
        $rgbStore = initialColor;
    };

    $: {
        dispatch("colorChange", $rgbStore);
        setPreviewColor($rgbStore);
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
                    {contextKey}
                    initialValue={initialColor}
                />
            {:else if colorPickerMode == ColorPickerMode.HSL}
                <HslColorPicker
                    {contextKey}
                    initialValue={initialColor}
                />
            {:else}
                <HslColorPicker
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
