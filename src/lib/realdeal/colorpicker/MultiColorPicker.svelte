<script lang="ts">
    import {
        getAsRGB,
        contextUpdateBStore,
        contextUpdateGStore,
        contextUpdateRStore,
        type RGB,
    } from "./types";
    import Slider from "./Slider.svelte";

    export let multiSelectContextKeys: string[];
    let rMin: number, rMax: number;
    let gMin: number, gMax: number;
    let bMin: number, bMax: number;
    let currentR: number, currentG: number, currentB: number;

    const changeR = (rOffset: number) => {
        if (rOffset === undefined) return;
        multiSelectContextKeys.forEach((contextKey) => {
            let method = $contextUpdateRStore.get(contextKey);
            method(rOffset);
        });
    };

    const changeG = (gOffset: number) => {
        if (gOffset === undefined) return;
        multiSelectContextKeys.forEach((contextKey) => {
            $contextUpdateGStore.get(contextKey)(gOffset);
        });
    };

    const changeB = (bOffset: number) => {
        if (bOffset === undefined) return;
        multiSelectContextKeys.forEach((contextKey) => {
            $contextUpdateBStore.get(contextKey)(bOffset);
        });
    };

    $: changeR(currentR);
    $: changeG(currentG);
    $: changeB(currentB);

    const createMultiColorPicker = (multiSelectContextKeys: string[]) => {
        let rgbValues: RGB[] = multiSelectContextKeys
            .slice()
            .map((ck) => getAsRGB(ck));

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

    $: createMultiColorPicker(multiSelectContextKeys);
</script>

<div class="multi-slider-container">
    <Slider
        initialValue={0}
        disabled={false}
        bind:currentValue={currentR}
        minValue={rMin}
        maxValue={rMax}
    />

    <Slider
        initialValue={0}
        disabled={false}
        bind:currentValue={currentG}
        minValue={gMin}
        maxValue={gMax}
    />

    <Slider
        initialValue={0}
        disabled={false}
        bind:currentValue={currentB}
        minValue={bMin}
        maxValue={bMax}
    />
</div>
