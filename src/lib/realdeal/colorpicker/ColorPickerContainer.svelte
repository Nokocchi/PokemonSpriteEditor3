<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { contextKeyOriginalRGBMap } from "./store";
    import ColorPicker from "./ColorPicker.svelte";
    import { RGBToHSL, type NewColorResult, type RGB, getAsRGB } from "./types";
    import { createEventDispatcher } from "svelte";
    import MultiColorPicker from "./MultiColorPicker.svelte";
    const dispatch = createEventDispatcher();
    export let imageData: ImageData;
    let multiSelectContextKeys: string[] = [];

    let originalColorPixelLocationsMap: Map<string, number[]> = new Map<
        string,
        number[]
    >();

    $: imageData && setInitialValues(imageData);

    const setInitialValues = (imageData: ImageData): void => {
        originalColorPixelLocationsMap.clear();
        $contextKeyOriginalRGBMap.clear();
        const imageHeight = imageData.height;
        const imageWidth = imageData.width;
        const imageRGBData = imageData.data;
        //4 indexes for each pixel
        for (let i = 0; i < imageHeight * imageWidth * 4; i += 4) {
            //If fourth index for a pixel (the alpha value) is not 255, then it must be transparent and thus background
            if (imageRGBData[i + 3] == 255) {
                let r: number = imageRGBData[i];
                let g: number = imageRGBData[i + 1];
                let b: number = imageRGBData[i + 2];
                const colorKey: string = r + ":" + g + ":" + b;
                if (!originalColorPixelLocationsMap.has(colorKey)) {
                    originalColorPixelLocationsMap.set(colorKey, []);
                    $contextKeyOriginalRGBMap.set(colorKey, getAsRGB(colorKey));
                }
                originalColorPixelLocationsMap.get(colorKey).push(i);
            }
        }
        let sortedByHue = new Map(
            [...originalColorPixelLocationsMap].sort((entry1, entry2) => {
                let hsl1 = RGBToHSL(getAsRGB(entry1[0]));
                let hsl2 = RGBToHSL(getAsRGB(entry2[0]));
                return Math.abs(360 - hsl1.h) - Math.abs(360 - hsl2.h);
            })
        );
        originalColorPixelLocationsMap = sortedByHue;
    };

    const changeColor = (originalColorKey: string, newColor: RGB): void => {
        const pixelsToChange: number[] =
            originalColorPixelLocationsMap.get(originalColorKey);
        const newColorResult = {
            pixelsToChange: pixelsToChange,
            newColor: newColor,
        } as NewColorResult;
        dispatch("newColor", newColorResult);
    };

    const updateR = (offset: number) => {};

    const updateG = (offset: number) => {};

    const updateB = (offset: number) => {};
</script>

<div class="colorPickerContainer">
    {#each originalColorPixelLocationsMap.keys() as color}
        <ColorPicker
            initialColor={getAsRGB(color)}
            contextKey={color}
            on:colorChange={(newColor) => changeColor(color, newColor.detail)}
            bind:multiSelectContextKeys
        />
    {/each}
    {#key multiSelectContextKeys}
        {#if multiSelectContextKeys.length}
            <MultiColorPicker
                {multiSelectContextKeys}
                on:updateR={updateR}
                on:updateG={updateG}
                on:updateB={updateB}
            />
        {/if}
    {/key}
</div>

<style>
    .colorPickerContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
