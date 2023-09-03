<script lang="ts">
    import {
        type RGB,
        RGBVal,
        ColorPickerMode,
        RGBToHSL,
        getAsRGB,
        type HSL,
        HSLToRGB,
        HSLVal,
        getSliderColor,
    } from "../types";
    import { createEventDispatcher, tick } from "svelte";
    import {
        contextColorUpdateStore,
        contextCurrentLockedValueStore,
    } from "../store";
    import RangeSlider from "./multislider/RangeSlider.svelte";
    import { colorPickerModeStore } from "../store";
    const dispatch = createEventDispatcher();

    export let currentlyMultiSelectedColors: string[];

    const getRGBValsFromColorKeys = (
        colors: Map<string, RGB>,
        rgbVal: string
    ): number[] => {
        return Array.from(colors.values()).map((rgb) => rgb[rgbVal]);
    };

    const getHSLValsFromColorKeys = (
        colors: Map<string, RGB>,
        hslVal: string
    ): number[] => {
        return Array.from(colors.values()).map((rgb) => RGBToHSL(rgb)[hslVal]);
    };

    let r: number[] = getRGBValsFromColorKeys(
        $contextCurrentLockedValueStore,
        RGBVal.r
    );
    let g: number[] = getRGBValsFromColorKeys(
        $contextCurrentLockedValueStore,
        RGBVal.g
    );
    let b: number[] = getRGBValsFromColorKeys(
        $contextCurrentLockedValueStore,
        RGBVal.b
    );
    let h: number[] = getHSLValsFromColorKeys(
        $contextCurrentLockedValueStore,
        HSLVal.h
    );
    let s: number[] = getHSLValsFromColorKeys(
        $contextCurrentLockedValueStore,
        HSLVal.s
    );
    let l: number[] = getHSLValsFromColorKeys(
        $contextCurrentLockedValueStore,
        HSLVal.l
    );

    const changeMode = (newMode: string) => {
        if (newMode === ColorPickerMode.RGB) {
            let rgbVals: RGB[] = [];
            for (let i = 0; i < currentlyMultiSelectedColors.length; i++) {
                rgbVals.push(HSLToRGB({ h: h[i], s: s[i], l: l[i] }));
            }
            r = rgbVals.map((rgb) => rgb.r);
            g = rgbVals.map((rgb) => rgb.g);
            b = rgbVals.map((rgb) => rgb.b);
        } else if (newMode === ColorPickerMode.HSL) {
            let hslVals: HSL[] = [];
            for (let i = 0; i < currentlyMultiSelectedColors.length; i++) {
                hslVals.push(RGBToHSL({ r: r[i], g: g[i], b: b[i] }));
            }
            h = hslVals.map((hsl) => hsl.h);
            s = hslVals.map((hsl) => hsl.s);
            l = hslVals.map((hsl) => hsl.l);
        }

        $colorPickerModeStore = newMode;
    };

    const changeHSL = (vals: number[], hslVal: string) => {
        let updateMap: Map<string, RGB> = new Map();

        // Not the best. We are assuming that the values bound to the RangeSlider are in the same order as the list we generate in getRGBValsFromColorKeys
        // It would be better if we could change the RangeSlider so the on:change event gives us all values in multicolormode, as well as their contextkey
        for (let i = 0; i < vals.length; i++) {
            let colorKey: string = currentlyMultiSelectedColors[i];
            let hsl: HSL = { h: h[i], s: s[i], l: l[i] };
            let newVal: number = vals[i];
            hsl[hslVal] = newVal;
            let rgb: RGB = HSLToRGB(hsl);

            updateMap.set(colorKey, rgb);
        }
        $contextColorUpdateStore = updateMap;
    };

    const change = (vals: number[], rgbVal: string) => {
        let updateMap: Map<string, RGB> = new Map();

        // Not the best. We are assuming that the values bound to the RangeSlider are in the same order as the list we generate in getRGBValsFromColorKeys
        // It would be better if we could change the RangeSlider so the on:change event gives us all values in multicolormode, as well as their contextkey
        for (let i = 0; i < vals.length; i++) {
            let colorKey: string = currentlyMultiSelectedColors[i];
            let newVal: number = vals[i];
            let rgb: RGB = { r: r[i], g: g[i], b: b[i] };
            rgb[rgbVal] = newVal;
            updateMap.set(colorKey, rgb);
        }

        $contextColorUpdateStore = updateMap;
    };

    const resetFunction = (rgbVal: string) => {
        let originalVals = currentlyMultiSelectedColors.map(
            (ck) => getAsRGB(ck)[rgbVal]
        );

        if (rgbVal === RGBVal.r) {
            r = originalVals;
        } else if (rgbVal === RGBVal.g) {
            g = originalVals;
        } else if (rgbVal === RGBVal.b) {
            b = originalVals;
        }
    };

    const resetFunctionHSL = (hslVal: string) => {
        let originalVals = currentlyMultiSelectedColors.map(
            (ck) => RGBToHSL(getAsRGB(ck))[hslVal]
        );

        if (hslVal === HSLVal.h) {
            h = originalVals;
        } else if (hslVal === HSLVal.s) {
            s = originalVals;
        } else if (hslVal === HSLVal.l) {
            l = originalVals;
        }
    };

    const resetAll = () => {
        if ($colorPickerModeStore === ColorPickerMode.RGB) {
            resetFunction(RGBVal.r);
            resetFunction(RGBVal.g);
            resetFunction(RGBVal.b);
        } else if ($colorPickerModeStore === ColorPickerMode.HSL) {
            resetFunctionHSL(HSLVal.h);
            resetFunctionHSL(HSLVal.s);
            resetFunctionHSL(HSLVal.l);
        }
    };

    const close = () => {
        dispatch("close");
    };

    $: hAvg = h.reduce((a, c) => a + c, 0) / h.length;
    $: changeHSL(h, HSLVal.h);
    $: changeHSL(s, HSLVal.s);
    $: changeHSL(l, HSLVal.l);
    $: change(r, RGBVal.r);
    $: change(g, RGBVal.g);
    $: change(b, RGBVal.b);
    $: sMin = getSliderColor(hAvg, HSLVal.s, 0);
    $: sMax = getSliderColor(hAvg, HSLVal.s, 100);
    $: lMin = getSliderColor(hAvg, HSLVal.l, 0);
    $: lMid = getSliderColor(hAvg, null, null);
    $: lMax = getSliderColor(hAvg, HSLVal.l, 100);
</script>

<div class="multi-slider-container">
    <div class="color-picker-mode-btn-container">
        <button
            on:click={resetAll}
            class="reset"
            disabled={$contextColorUpdateStore.size === 0}>Reset Color</button
        >
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
        <div class="column">
            <div class="slider-component">
                <button on:click={() => resetFunction(RGBVal.r)}>Reset</button>
                <div class="slider-input-container">
                    <RangeSlider
                        id="r"
                        min={0}
                        max={255}
                        bind:values={r}
                        springValues={{ stiffness: 1, damping: 1 }}
                        float
                        multiMoveMode
                    />
                    <div class="label-container">
                        <p class="min">{0}</p>
                        <p class="max">{255}</p>
                    </div>
                </div>
            </div>
            <div class="slider-component">
                <button on:click={() => resetFunction(RGBVal.g)}>Reset</button>
                <div class="slider-input-container">
                    <RangeSlider
                        id="g"
                        min={0}
                        max={255}
                        bind:values={g}
                        springValues={{ stiffness: 1, damping: 1 }}
                        float
                        multiMoveMode
                    />
                    <div class="label-container">
                        <p class="min">{0}</p>
                        <p class="max">{255}</p>
                    </div>
                </div>
            </div>
            <div class="slider-component">
                <button on:click={() => resetFunction(RGBVal.b)}>Reset</button>
                <div class="slider-input-container">
                    <RangeSlider
                        id="b"
                        min={0}
                        max={255}
                        bind:values={b}
                        springValues={{ stiffness: 1, damping: 1 }}
                        float
                        multiMoveMode
                    />
                    <div class="label-container">
                        <p class="min">{0}</p>
                        <p class="max">{255}</p>
                    </div>
                </div>
            </div>
        </div>
    {:else if $colorPickerModeStore == ColorPickerMode.HSL}
        <div class="column">
            <div class="slider-component">
                <button on:click={() => resetFunctionHSL(HSLVal.h)}
                    >Reset</button
                >
                <div class="slider-input-container">
                    <RangeSlider
                        id="h"
                        min={0}
                        max={359}
                        bind:values={h}
                        springValues={{ stiffness: 1, damping: 1 }}
                        float
                        multiMoveMode
                    />
                    <div class="label-container">
                        <p class="min">{0}</p>
                        <p class="max">{359}</p>
                    </div>
                </div>
            </div>
            <div
                class="slider-component"
                style="--s-min: {sMin}; --s-max: {sMax};"
            >
                <button on:click={() => resetFunctionHSL(HSLVal.s)}
                    >Reset</button
                >
                <div class="slider-input-container">
                    <RangeSlider
                        id="s"
                        min={0}
                        max={100}
                        bind:values={s}
                        springValues={{ stiffness: 1, damping: 1 }}
                        float
                        multiMoveMode
                    />
                    <div class="label-container">
                        <p class="min">{0}</p>
                        <p class="max">{100}</p>
                    </div>
                </div>
            </div>
            <div
                class="slider-component"
                style="--l-min: {lMin}; --l-mid: {lMid}; --l-max: {lMax};"
            >
                <button on:click={() => resetFunctionHSL(HSLVal.l)}
                    >Reset</button
                >
                <div class="slider-input-container">
                    <RangeSlider
                        id="l"
                        min={0}
                        max={100}
                        bind:values={l}
                        springValues={{ stiffness: 1, damping: 1 }}
                        float
                        multiMoveMode
                    />
                    <div class="label-container">
                        <p class="min">{0}</p>
                        <p class="max">{100}</p>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <button on:click={close}>Close multicolor mode</button>
</div>

<style>
    :global(.rangeSlider) {
        flex-grow: 1;
        margin: 0;
    }

    :global(#r) {
        background-color: red;
    }

    :global(#g) {
        background-color: green;
    }

    :global(#b) {
        background-color: blue;
    }

    :global(#h) {
        background: linear-gradient(
            to right,
            rgb(255, 0, 0),
            rgb(255, 255, 0),
            rgb(0, 255, 0),
            rgb(0, 255, 255),
            rgb(0, 0, 255),
            rgb(255, 0, 255),
            rgb(255, 0, 0)
        );
    }

    :global(#s) {
        background: linear-gradient(to right, var(--s-min), var(--s-max));
    }

    :global(#l) {
        background: linear-gradient(
            to right,
            var(--l-min),
            var(--l-mid),
            var(--l-max)
        );
    }

    .reset {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .color-picker-mode-btn-container {
        display: flex;
        flex-direction: row;
        gap: 15px;
    }

    .multi-slider-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 15px;
    }

    .slider-component {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15px;
    }

    .slider-input-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .label-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .label-container p {
        margin: 0;
        align-items: end;
    }

    p {
        width: 50px;
    }

    .min {
        text-align: left;
    }

    .max {
        text-align: right;
    }

    .multi-slider-container {
        gap: 15px;
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>
