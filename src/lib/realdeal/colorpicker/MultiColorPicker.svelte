<script lang="ts">
    import {
        contextUpdateBStore,
        contextUpdateGStore,
        contextUpdateRStore,
        type RGB,
    } from "./types";
    import Slider from "./Slider.svelte";

    export let colorsToChange: RGB[];
    let rMin: number, rMax: number;
    let gMin: number, gMax: number;
    let bMin: number, bMax: number;
    let currentR: number, currentG: number, currentB: number;

    const changeR = (rOffset: number) => {
        if (rOffset === undefined) return;
        colorsToChange.forEach((color) => {
            let method = $contextUpdateRStore.get(color);
            method(rOffset);
        });
    };

    const changeG = (gOffset: number) => {
        if (gOffset === undefined) return;
        colorsToChange.forEach((color) => {
            $contextUpdateGStore.get(color)(gOffset);
        });
    };

    const changeB = (bOffset: number) => {
        if (bOffset === undefined) return;
        colorsToChange.forEach((color) => {
            $contextUpdateBStore.get(color)(bOffset);
        });
    };

    $: changeR(currentR);
    $: changeG(currentG);
    $: changeB(currentB);

    const createMultiColorPicker = (colorsToChange: RGB[]) => {
        let sortedByR = colorsToChange.slice().sort((a, b) => {
            return a.r - b.r;
        });

        let sortedByG = colorsToChange.slice().sort((a, b) => {
            return a.g - b.g;
        });

        let sortedByB = colorsToChange.slice().sort((a, b) => {
            return a.b - b.b;
        });

        rMin = 0 - sortedByR[0].r;
        rMax = 255 - sortedByR[sortedByR.length - 1].r;

        gMin = 0 - sortedByG[0].g;
        gMax = 255 - sortedByG[sortedByG.length - 1].g;

        bMin = 0 - sortedByB[0].b;
        bMax = 255 - sortedByB[sortedByB.length - 1].b;
    };

    $: createMultiColorPicker(colorsToChange);
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
