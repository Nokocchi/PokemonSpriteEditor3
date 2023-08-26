<script lang="ts">
    // This file is just a stupid adapter for the SpriteEditorImpl, so that one can be initialized with the original color keys
    // So that SpriteEditorImpl can make stores and contexts at component initialization
    // Could I clean this up by just calling setInitialValues during component initialization intead of reactively? Or would that be more messy?

    import SpriteEditorImpl from "./SpriteEditorImpl.svelte";

    import { RGBToHSL, getAsRGB } from "./types";

    export let invisible: boolean;
    export let originalImageData: ImageData;

    $: setInitialValues(originalImageData);

    let originalColorPixelLocationsMap: Map<string, number[]> = new Map<
        string,
        number[]
    >();

    const setInitialValues = (imageData: ImageData): void => {
        if (!imageData) return;
        originalColorPixelLocationsMap.clear();
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
</script>

<SpriteEditorImpl {originalColorPixelLocationsMap} {invisible} on:resetPokemon />


