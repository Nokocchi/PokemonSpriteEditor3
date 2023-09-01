<script lang="ts">
    import {
        type RGB,
        RGBVal,
        type multiSelectUpdate,
    } from "../types";
    import { createEventDispatcher } from "svelte";
    import {
        contextColorUpdateStore,
        contextCurrentLockedValueStore,
    } from "../store";
    import RangeSlider from "./multislider/RangeSlider.svelte";
    const dispatch = createEventDispatcher();

    export let currentlyMultiSelectedColors: string[];

    const getRGBValsFromColorKeys = (
        colors: Map<string, RGB>,
        rgbVal: string
    ): number[] => {
        return Array.from(colors.values()).map((rgb) => rgb[rgbVal]);
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

    const change = (vals: number[], rgbVal: string) => {
        let updateMap: Map<string, multiSelectUpdate> = new Map();

        // Not the best. We are assuming that the values bound to the RangeSlider are in the same order as the list we generate in getRGBValsFromColorKeys
        // It would be better if we could change the RangeSlider so the on:change event gives us all values in multicolormode, as well as their contextkey
        for (let i = 0; i < vals.length; i++) {
            let colorKey: string = currentlyMultiSelectedColors[i];
            let newVal: number = vals[i];
            updateMap.set(colorKey, createMultiSelectUpdateObj(rgbVal, newVal));
        }

        $contextColorUpdateStore = updateMap;
    };

    // Not pretty. This component needs to be updated anyway
    const resetFunction = (rgbVal: string) => {
        if (rgbVal === "r") {
            r = currentlyMultiSelectedColors.map((ck) =>
                parseInt(ck.split(":")[0])
            );
        } else if (rgbVal === "g") {
            g = currentlyMultiSelectedColors.map((ck) =>
                parseInt(ck.split(":")[1])
            );
        } else if (rgbVal === "b") {
            b = currentlyMultiSelectedColors.map((ck) =>
                parseInt(ck.split(":")[2])
            );
        }
    };

    const createMultiSelectUpdateObj = (rgbVal: string, newValue: number) => {
        return { rgbVal, newValue };
    };

    const close = () => {
        dispatch("close");
    };

    $: change(r, RGBVal.r);
    $: change(g, RGBVal.g);
    $: change(b, RGBVal.b);
</script>

<div class="multi-slider-container">
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

</style>
