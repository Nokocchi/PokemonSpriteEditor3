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

    const RGBVal = Object.freeze({
        r: "r",
        g: "g",
        b: "b",
    });

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
    $: setMinMax(contextKeysMultiSelect);

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
