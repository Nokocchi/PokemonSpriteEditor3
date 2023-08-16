<script context="module" lang="ts">
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import HslColorPicker from "./HSLColorPicker.svelte";
    import RgbColorPicker from "./RGBColorPicker.svelte";
    import {
        contextUpdateBStore,
        contextUpdateGStore,
        contextUpdateRStore,
        contextCurrentLockedValueStore,
        contextInitialValueStore,
        contextUpdateColorPickerStore,
        getAsRGB,
        isEquals,
        type RGB,
    } from "./types";
    import { createEventDispatcher, onMount, setContext } from "svelte";
    const dispatch = createEventDispatcher();

    const ColorPickerMode = Object.freeze({
        RGB: "RGB",
        HSL: "HSL",
        HEX: "HEX",
    });

    export let multiselectBegun: boolean;
    export let contextKeysMultiSelect: string[];
    export let contextKey: string;
    export let initialColor: RGB;

    let colorPreview: HTMLCanvasElement;
    let colorPickerMode: string = ColorPickerMode.RGB;
    let multiselected: boolean = false;
    const rgbStore: Writable<RGB> = writable();

    setContext(contextKey, {
        rgbStore: rgbStore,
    });

    $: disabled = multiselected || multiselectBegun;

    $: multiselected = contextKeysMultiSelect.filter((color) => color === contextKey).length > 0;

    onMount(() => {
        // Once all the color pickers are ready, re-set the rgbstore to trigger drawing to the preview/palette
        $rgbStore = $rgbStore;
    });

    const multiSelect = () => {
        if (multiselectBegun) return;

        if (multiselected) {
            contextKeysMultiSelect = contextKeysMultiSelect.filter(
                (selectedColor) => selectedColor !== contextKey
            );
            return;
        } else {
            contextKeysMultiSelect = [...contextKeysMultiSelect, contextKey];
        }

        // What is this magic? I cannot set currentValueLockedWhenMultiSelect = $rgbStore
        // Or even do = Object.create($rgbStore) or = Object.assign($rgbStore)
        // Because then the value of currentValueLockedWhenMultiSelect gets changed once more, somehow, without this method being run
        // Is it because these objects are being set by reference? Is the = $rgbStore being run asynchronously?

        let currentValueLockedWhenMultiSelect: RGB = {
            r: $rgbStore.r,
            g: $rgbStore.g,
            b: $rgbStore.b,
        };

        $contextUpdateRStore.set(contextKey, (newValue: number) => {
            $rgbStore.r = newValue;
            $rgbStore = $rgbStore;
        });

        $contextUpdateGStore.set(contextKey, (newValue: number) => {
            $rgbStore.g = newValue;
            $rgbStore = $rgbStore;
        });

        $contextUpdateBStore.set(contextKey, (newValue: number) => {
            $rgbStore.b = newValue;
            $rgbStore = $rgbStore;
        });

        $contextCurrentLockedValueStore.set(
            contextKey,
            currentValueLockedWhenMultiSelect
        );
        $contextInitialValueStore.set(contextKey, initialColor);
    };

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
        <button on:click={reset} {disabled}> Reset </button>
    </div>
    <div
        class="color-picker-input-container"
        class:changed={!isEquals($rgbStore, initialColor)}
    >
        <canvas
            bind:this={colorPreview}
            height="50"
            width="50"
            on:click={multiSelect}
            class:multiselected
            class:multiselectBegun
        />
        <div class="color-picker-slider-container">
            {#if colorPickerMode == ColorPickerMode.RGB}
                <RgbColorPicker
                    {contextKey}
                    initialValue={initialColor}
                    {disabled}
                />
            {:else if colorPickerMode == ColorPickerMode.HSL}
                <HslColorPicker
                    {contextKey}
                    initialValue={initialColor}
                    {disabled}
                />
            {:else}
                <HslColorPicker
                    {contextKey}
                    initialValue={initialColor}
                    {disabled}
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

    canvas.multiselected {
        border: 4px dotted white;
    }

    canvas:hover {
        outline: 2px solid yellow;
    }

    canvas.multiselectBegun:hover {
        outline: none;
    }

    .color-picker-input-container.changed {
        outline: solid 2px blue;
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
