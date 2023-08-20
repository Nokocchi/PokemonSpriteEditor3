<script lang="ts">
    import {
        contextUpdateStore,
        contextCurrentLockedValueStore,
        type RGB,
        getAsRGB,
        RGBVal,
    } from "./types";
    import Slider from "./Slider.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let currentlyMultiSelectedColors: string[];

    let rMin: number, rMax: number;
    let gMin: number, gMax: number;
    let bMin: number, bMax: number;
    let currentR: number, currentG: number, currentB: number;



    const change = (offset: number, rgbVal: string) => {
        if (!offset) return;
        currentlyMultiSelectedColors.forEach((ck) => {
            let newValue: number =
                $contextCurrentLockedValueStore.get(ck)[rgbVal] + offset;
                $contextUpdateStore.get(ck)(rgbVal, newValue);
        });
    };

    const resetFunction = (rgbVal: string) => {
        currentlyMultiSelectedColors.forEach((ck) => {
            let initialValue: RGB = getAsRGB(ck);
            $contextUpdateStore.get(ck)(rgbVal, initialValue[rgbVal]);
            $contextCurrentLockedValueStore.set(ck, initialValue);
        });
    };


    const close = () => {
        dispatch("close");
    };

    const setMinMax = (contextKeys: string[]) => {

        let rgbValues: RGB[] = contextKeys.map((ck) =>
            $contextCurrentLockedValueStore.get(ck)
        );

        ({ min: rMin, max: rMax } = getMinMax(rgbValues, RGBVal.r));
        ({ min: gMin, max: gMax } = getMinMax(rgbValues, RGBVal.g));
        ({ min: bMin, max: bMax } = getMinMax(rgbValues, RGBVal.b));
    };

    const getMinMax = (rgbValues: RGB[], rgbVal: string) => {
        let sortedByRGBVal = rgbValues.slice().sort((a, b) => {
            return a[rgbVal] - b[rgbVal];
        });

        return {
            min: 0 - sortedByRGBVal[0][rgbVal],
            max: 255 - sortedByRGBVal[sortedByRGBVal.length - 1][rgbVal],
        };
    };

    $: change(currentR, RGBVal.r);
    $: change(currentG, RGBVal.g);
    $: change(currentB, RGBVal.b);
    $: setMinMax(currentlyMultiSelectedColors);
</script>

<div class="multi-slider-container">
    <Slider
        initialValue={0}
        bind:currentValue={currentR}
        minValue={rMin}
        maxValue={rMax}
        resetCallback={() => resetFunction(RGBVal.r)}
    />

    <Slider
        initialValue={0}
        bind:currentValue={currentG}
        minValue={gMin}
        maxValue={gMax}
        resetCallback={() => resetFunction(RGBVal.g)}
    />

    <Slider
        initialValue={0}
        bind:currentValue={currentB}
        minValue={bMin}
        maxValue={bMax}
        resetCallback={() => resetFunction(RGBVal.b)}
    />

    <button on:click={close}>Close</button>
</div>
