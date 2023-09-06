<script lang="ts">
    import Pencil from "~icons/mdi/pencil";
    import MultiSelectIcon from "~icons/mdi/checkbox-blank-circle-outline";
    import SelectedMultiSelectIcon from "~icons/mdi/check-circle-outline";
    import {
        dirtyImageDataStore,
        contextColorUpdateStore,
        contextCurrentLockedValueStore,
    } from "./store";
    import { getAsRGB, isEquals, type RGB } from "./types";

    export let initialColorKey: string;
    export let currentlySingleSelectedColor: string;
    export let currentlyMultiSelectedColors: string[];
    export let multiColorModeStarted: boolean;
    export let paletteGridSize: number;
    export let pixelLocations: number[];
    let initialColorRGB: RGB = getAsRGB(initialColorKey);
    let currentColor: RGB = initialColorRGB;

    $: multiSelected =
        currentlyMultiSelectedColors.filter(
            (other) => other === initialColorKey
        ).length > 0;
    $: multiSelectStarted = currentlyMultiSelectedColors.length > 0;
    $: selected = currentlySingleSelectedColor === initialColorKey;
    $: updateColorFromMultiselect($contextColorUpdateStore);

    const click = () => {
        if (multiColorModeStarted) return;

        if (currentlyMultiSelectedColors.length) {
            multiSelect();
        } else {
            $contextCurrentLockedValueStore.clear();
            $contextCurrentLockedValueStore.set(initialColorKey, currentColor);
            currentlySingleSelectedColor =
                currentlySingleSelectedColor === initialColorKey
                    ? undefined
                    : initialColorKey;
        }
    };

    const multiSelect = () => {
        if (multiColorModeStarted) return;

        if (!multiSelectStarted) $contextCurrentLockedValueStore.clear();

        if (multiSelected) {
            currentlyMultiSelectedColors = currentlyMultiSelectedColors.filter(
                (selectedColor) => selectedColor !== initialColorKey
            );
        } else {
            currentlyMultiSelectedColors = [
                ...currentlyMultiSelectedColors,
                initialColorKey,
            ];
        }

        $contextCurrentLockedValueStore.set(initialColorKey, {
            ...currentColor,
        });
    };

    const updateColorFromMultiselect = (updateMap: Map<string, RGB>) => {
        let update: RGB = updateMap.get(initialColorKey);
        if (update) {
            for (let i = 0; i < pixelLocations.length; i++) {
                const pixelToUpdate: number = pixelLocations[i];
                $dirtyImageDataStore[pixelToUpdate] = update.r;
                $dirtyImageDataStore[pixelToUpdate + 1] = update.g;
                $dirtyImageDataStore[pixelToUpdate + 2] = update.b;
            }
            $dirtyImageDataStore = $dirtyImageDataStore;
            currentColor = update;
        }
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    style="--r: {currentColor.r}; --g: {currentColor.g}; --b: {currentColor.b}; --palette-grid-size: {paletteGridSize}"
    class="palette"
    on:click={click}
    on:contextmenu|preventDefault|stopPropagation={multiSelect}
    class:multiSelected
    class:multiSelectStarted
    class:multiColorModeStarted
    class:selected
    class:changed={!isEquals(currentColor, initialColorRGB)}
>
    <MultiSelectIcon class="palette-icon multi-select-icon" />
    <SelectedMultiSelectIcon class="palette-icon selected-multi-select-icon" />
    <Pencil class="palette-icon changed-icon" />
</div>

<style>
    :root {
        --grid-gap: 5px;
    }

    .palette {
        position: relative;
        background-color: rgb(var(--r), var(--g), var(--b));
        box-sizing: border-box;
        aspect-ratio: 1 / 1;
        /* The height of an element should be 100% divided by how many elements we want in the height. Minus the gap between each element.
        There's a gap between each element, so if the grid has n elements in a column, there will be n-1 grid gaps*/
        width: calc(
            calc(100% / var(--palette-grid-size)) -
                calc(var(--grid-gap) * calc(var(--palette-grid-size) - 1))
        );
        height: auto;
    }

    :global(.screen-wider-than-tall .palette) {
        height: calc(
            calc(100% / var(--palette-grid-size)) -
                calc(var(--grid-gap) * calc(var(--palette-grid-size) - 1))
        );
        width: auto;
    }

    :global(.palette-icon) {
        font-size: 1em;
        position: absolute;
        top: 5px;
        display: none;
        color: black;
        background-color: white;
    }

    :global(.multi-select-icon) {
        right: 5px;
    }

    :global(.selected-multi-select-icon) {
        right: 5px;
    }

    :global(.changed-icon) {
        left: 5px;
    }

    :global(.multiSelectStarted .multi-select-icon) {
        display: block;
    }

    :global(.multiSelectStarted.multiSelected .multi-select-icon) {
        display: none;
    }

    :global(.multiSelectStarted.multiSelected .selected-multi-select-icon) {
        color: blue;
        display: block;
    }

    :global(.multiColorModeStarted .multi-select-icon) {
        display: none;
    }

    :global(.changed .changed-icon) {
        display: block;
    }

    div.selected {
        border: 4px dotted black;
    }

    div:hover {
        border: 2px solid yellow;
    }

    div.multiSelected:hover {
        border: none;
    }

    div.multiColorModeStarted:hover {
        border: none;
    }
</style>
