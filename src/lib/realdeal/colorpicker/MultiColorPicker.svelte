<script lang="ts">
    import {
        contextUpdateBStore,
        contextUpdateGStore,
        contextUpdateRStore,
        contextCurrentLockedValueStore,
        contextInitialValueStore,
        getAsRGB,
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

    const changeR = (rOffset: number) => {
        if (rOffset === undefined) return;
        contextKeysMultiSelect.forEach((ck) => {
            let newValue: number = $contextCurrentLockedValueStore.get(ck).r + rOffset;
            $contextUpdateRStore.get(ck)(newValue);
        });
    };

    const changeG = (gOffset: number) => {
        if (gOffset === undefined) return;
        contextKeysMultiSelect.forEach((ck) => {
            let newValue: number = $contextCurrentLockedValueStore.get(ck).g + gOffset;
            $contextUpdateGStore.get(ck)(newValue);
        });
    };

    const changeB = (bOffset: number) => {
        if (bOffset === undefined) return;
        contextKeysMultiSelect.forEach((ck) => {
            let newValue: number = $contextCurrentLockedValueStore.get(ck).b + bOffset;
            $contextUpdateBStore.get(ck)(newValue);
        });
    };

    const resetFunctionR = () => {
        contextKeysMultiSelect.forEach((ck) => {
            let newValue: number = $contextInitialValueStore.get(ck).r
            $contextUpdateRStore.get(ck)(newValue);
        });
    }

    const resetFunctionG = () => {
        contextKeysMultiSelect.forEach((ck) => {
            let newValue: number = $contextInitialValueStore.get(ck).g
            $contextUpdateGStore.get(ck)(newValue);
        });
    }

    const resetFunctionB = () => {
        contextKeysMultiSelect.forEach((ck) => {
            let newValue: number = $contextInitialValueStore.get(ck).b
            $contextUpdateBStore.get(ck)(newValue);
        });
    }

    const close = () => {
        dispatch("close");
    }

    $: changeR(currentR);
    $: changeG(currentG);
    $: changeB(currentB);

    const createMultiColorPicker = (contextKeys: string[]) => {
        let rgbValues: RGB[] = contextKeys.map(ck => $contextCurrentLockedValueStore.get(ck))

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
        disabled={false}
        bind:currentValue={currentR}
        minValue={rMin}
        maxValue={rMax}
        resetFunction={resetFunctionR}
    />

    <Slider
        initialValue={0}
        disabled={false}
        bind:currentValue={currentG}
        minValue={gMin}
        maxValue={gMax}
        resetFunction={resetFunctionG}
    />

    <Slider
        initialValue={0}
        disabled={false}
        bind:currentValue={currentB}
        minValue={bMin}
        maxValue={bMax}
        resetFunction={resetFunctionB}
    />

    <button on:click={close}>Close</button>
</div>
