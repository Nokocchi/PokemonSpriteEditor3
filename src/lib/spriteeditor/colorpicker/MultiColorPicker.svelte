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

    const changeMode = (mode: string) => {
        $colorPickerModeStore = mode;
    };

    const changeHSL = (vals: number[], hslVal: string) => {
        let updateMap: Map<string, RGB> = new Map();

        // Not the best. We are assuming that the values bound to the RangeSlider are in the same order as the list we generate in getRGBValsFromColorKeys
        // It would be better if we could change the RangeSlider so the on:change event gives us all values in multicolormode, as well as their contextkey
        for (let i = 0; i < vals.length; i++) {
            let colorKey: string = currentlyMultiSelectedColors[i];
            let hsl: HSL = {h: h[i], s: s[i], l: l[i]};
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
            let rgb: RGB = {r: r[i], g: g[i], b: b[i]};
            rgb[rgbVal] = newVal;
            updateMap.set(colorKey, rgb);
        }

        $contextColorUpdateStore = updateMap;
    };

    // Not pretty. This component needs to be updated anyway
    const resetFunction = (rgbVal: string) => {
        let originalVals = currentlyMultiSelectedColors.map((ck) =>
                getAsRGB(ck)[rgbVal]);

        if (rgbVal === RGBVal.r) {
            r = originalVals;
        } else if (rgbVal === RGBVal.g) {
            g = originalVals;
        } else if (rgbVal === RGBVal.b) {
            b = originalVals;
        }
    }

    const resetFunctionHSL = (hslVal: string) => {
        let originalVals = currentlyMultiSelectedColors.map((ck) =>
                RGBToHSL(getAsRGB(ck))[hslVal]);

        if (hslVal === HSLVal.h) {
            h = originalVals;
        } else if (hslVal === HSLVal.s) {
            s = originalVals;
        } else if (hslVal === HSLVal.l) {
            l = originalVals;
        }
    }

    const resetAll = () => {
        if($colorPickerModeStore === ColorPickerMode.RGB){
            resetFunction(RGBVal.r);
            resetFunction(RGBVal.g);
            resetFunction(RGBVal.b);
        } else if ($colorPickerModeStore === ColorPickerMode.HSL){
            resetFunctionHSL(HSLVal.h);
            resetFunctionHSL(HSLVal.s);
            resetFunctionHSL(HSLVal.l);
        }
    }

    const close = () => {
        dispatch("close");
    };

    $: hAvg = h.reduce((a,c) => a + c, 0) / h.length;
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
        <button on:click={resetAll} class="reset" disabled={$contextColorUpdateStore.size === 0}>Reset Color</button>
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
    <div class="slider-container">
        <button on:click={() => resetFunction(RGBVal.r)}>Reset</button>
        <RangeSlider
            id="r"
            min={0}
            max={255}
            bind:values={r}
            springValues={{ stiffness: 1, damping: 1 }}
            float
            multiMoveMode
        />
    </div>
    <div class="slider-container">
        <button on:click={() => resetFunction(RGBVal.g)}>Reset</button>
        <RangeSlider
            id="g"
            min={0}
            max={255}
            bind:values={g}
            springValues={{ stiffness: 1, damping: 1 }}
            float
            multiMoveMode
        />
    </div>
    <div class="slider-container">
        <button on:click={() => resetFunction(RGBVal.b)}>Reset</button>
        <RangeSlider
            id="b"
            min={0}
            max={255}
            bind:values={b}
            springValues={{ stiffness: 1, damping: 1 }}
            float
            multiMoveMode
        />
    </div>
    {:else if $colorPickerModeStore == ColorPickerMode.HSL}
    <div class="slider-container">
        <button on:click={() => resetFunctionHSL(HSLVal.h)}>Reset</button>
        <RangeSlider
            id="h"
            min={0}
            max={359}
            bind:values={h}
            springValues={{ stiffness: 1, damping: 1 }}
            float
            multiMoveMode
        />
    </div>
    <div class="slider-container" style="--s-min: {sMin}; --s-max: {sMax};">
        <button on:click={() => resetFunctionHSL(HSLVal.s)}>Reset</button>
        <RangeSlider
            id="s"
            min={0}
            max={100}
            bind:values={s}
            springValues={{ stiffness: 1, damping: 1 }}
            float
            multiMoveMode
        />
    </div>
    <div class="slider-container" style="--l-min: {lMin}; --l-mid: {lMid}; --l-max: {lMax};">
        <button on:click={() => resetFunctionHSL(HSLVal.l)}>Reset</button>
        <RangeSlider
            id="l"
            min={0}
            max={100}
            bind:values={l}
            springValues={{ stiffness: 1, damping: 1 }}
            float
            multiMoveMode
        />
    </div>
    {/if}

    <button on:click={close}>Close</button>
</div>

<style>
    .slider-container {
        display: flex;
        flex-direction: row;
    }

    :global(.rangeSlider){
        flex-grow: 1;
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

    :global(#h){
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

    :global(#s){
        background: linear-gradient(
            to right,
            var(--s-min),
            var(--s-max)
        );
    }

    :global(#l){
        background: linear-gradient(
            to right,
            var(--l-min),
            var(--l-mid),
            var(--l-max)
        );
    }

</style>
