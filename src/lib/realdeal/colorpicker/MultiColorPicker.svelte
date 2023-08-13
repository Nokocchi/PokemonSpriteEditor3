<script lang="ts">
    import {
        contextUpdateBStore,
        contextUpdateGStore,
        contextUpdateRStore,
        contextCurrentLockedValueStore,
        contextInitialValueStore,
        type RGB,
    } from "./types";
    import Slider from "./Slider.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let contextKeysMultiSelect: string[];
    let rMin: number, rMax: number;
    let gMin: number, gMax: number;
    let bMin: number, bMax: number;
    let currentR: number, currentG: number, currentB: number;

    const change = (offset: number, rgbVal: string) => {
        if (offset === undefined) return;
        contextKeysMultiSelect.forEach((ck) => {
            let newValue: number =
                $contextCurrentLockedValueStore.get(ck)[rgbVal] + offset;
            getContextUpdateStore(rgbVal).get(ck)(newValue);
        });
    };

    const resetFunction = (rgbVal: string) => {
        contextKeysMultiSelect.forEach((ck) => {
            let initialValue: RGB = $contextInitialValueStore.get(ck);
            getContextUpdateStore(rgbVal).get(ck)(initialValue[rgbVal]);
            $contextCurrentLockedValueStore.set(ck, initialValue);
        });
    };

    const getContextUpdateStore = (rgbVal: string) => {
        if (rgbVal === RGBVal.r) return $contextUpdateRStore;
        if (rgbVal === RGBVal.g) return $contextUpdateGStore;
        if (rgbVal === RGBVal.b) return $contextUpdateBStore;
    };

    const RGBVal = Object.freeze({
        r: "r",
        g: "g",
        b: "b",
    });

    const close = () => {
        dispatch("close");
    };

    $: change(currentR, RGBVal.r);
    $: change(currentG, RGBVal.g);
    $: change(currentB, RGBVal.b);

    const createMultiColorPicker = (contextKeys: string[]) => {
        let rgbValues: RGB[] = contextKeys.map((ck) =>
            $contextCurrentLockedValueStore.get(ck)
        );

        let sortedByR = rgbValues.slice().sort((a, b) => {
            return a.r - b.r;
        });
        let sortedByG = rgbValues.slice().sort((a, b) => {
            return a.g - b.g;
        });
        let sortedByB = rgbValues.slice().sort((a, b) => {
            return a.b - b.b;
        });

        rMin = 0 - sortedByR[0].r;
        rMax = 255 - sortedByR[sortedByR.length - 1].r;

        gMin = 0 - sortedByG[0].g;
        gMax = 255 - sortedByG[sortedByG.length - 1].g;

        bMin = 0 - sortedByB[0].b;
        bMax = 255 - sortedByB[sortedByB.length - 1].b;
    };

    $: createMultiColorPicker(contextKeysMultiSelect);
</script>

<div class="multi-slider-container">
    <Slider
        initialValue={0}
        bind:currentValue={currentR}
        minValue={rMin}
        maxValue={rMax}
        resetFunction={() => resetFunction(RGBVal.r)}
    />

    <Slider
        initialValue={0}
        bind:currentValue={currentG}
        minValue={gMin}
        maxValue={gMax}
        resetFunction={() => resetFunction(RGBVal.g)}
    />

    <Slider
        initialValue={0}
        bind:currentValue={currentB}
        minValue={bMin}
        maxValue={bMax}
        resetFunction={() => resetFunction(RGBVal.b)}
    />

    <button on:click={close}>Close</button>
</div>
