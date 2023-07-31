<script lang="ts">
    import ColorPicker from "./ColorPicker.svelte";
    import type { NewColorResult, RGB } from "./types";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let originalColorPixelLocationsMap: Map<string, number[]> = new Map<
        string,
        number[]
    >();

    export const setInitialValues = (imageData: ImageData): void => {
        originalColorPixelLocationsMap.clear();
        const imageHeight = imageData.height;
        const imageWidth = imageData.width;
        const imageRGBData = imageData.data;
        console.log("imageWidth", imageWidth);
        console.log("imageHeight", imageHeight);
        console.log("imageRGBData", imageRGBData);
        //4 indexes for each pixel
        for (let i = 0; i < imageHeight * imageWidth * 4; i++) {
            //If fourth index for a pixel (the alpha value) is not 255, then it must be transparent and thus background
            if (imageRGBData[i + 3] == 255) {
                let r: number = imageRGBData[i];
                let g: number = imageRGBData[i + 1];
                let b: number = imageRGBData[i + 2];
                const colorKey: string = r + ":" + g + ":" + b;
                if (originalColorPixelLocationsMap.has(colorKey)) {
                    originalColorPixelLocationsMap.get(colorKey).push(i);
                } else {
                    originalColorPixelLocationsMap.set(colorKey, [i]);
                }
            }
            // We already increment i once in the for loop
            i += 3;
            originalColorPixelLocationsMap = originalColorPixelLocationsMap;
        }
        console.log("original colors map", originalColorPixelLocationsMap);
    };

    let getAsRGB = (colorKey: string): RGB => {
        const chars: string[] = colorKey.split(":");
        return {
            r: Number(chars[0]),
            g: Number(chars[1]),
            b: Number(chars[2]),
        };
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
</script>

<div class="colorPickerContainer">
    {#each [...originalColorPixelLocationsMap.keys()] as color}
        <ColorPicker
            initialColor={getAsRGB(color)}
            on:colorChange={(newColor) => changeColor(color, newColor.detail)}
        />
    {/each}
</div>

<style>
    .colorPickerContainer {
        display: flex;
        flex-direction: column;
    }
</style>
