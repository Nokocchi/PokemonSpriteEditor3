<script lang="ts">
    import Pencil from "~icons/mdi/pencil";
    import MultiSelectIcon from "~icons/mdi/checkbox-blank-circle-outline";
    import SelectedMultiSelectIcon from "~icons/mdi/check-circle-outline";
    import {
        contextColorUpdateStore,
        contextCurrentLockedValueStore,
    } from "./store";
    import {
        getAsRGB,
        isEquals,
        type multiSelectUpdate,
        type RGB,
    } from "./types";
    import { createEventDispatcher, getContext } from "svelte";

    export let initialColorKey: string;
    export let currentlySingleSelectedColor: string;
    export let currentlyMultiSelectedColors: string[];
    export let multiColorModeStarted: boolean;
    export let paletteGridSize: number;
    const dispatch = createEventDispatcher();
    const { rgbStore }: any = getContext(initialColorKey);
    let initialColorRGB: RGB = getAsRGB(initialColorKey);

    $: multiSelected =
        currentlyMultiSelectedColors.filter(
            (other) => other === initialColorKey
        ).length > 0;
    $: multiSelectStarted = currentlyMultiSelectedColors.length > 0;
    $: selected = currentlySingleSelectedColor === initialColorKey;
    $: updateColorFromMultiselect($contextColorUpdateStore);
    $: {
        dispatch("colorChange", $rgbStore);
    }

    const click = () => {
        if (multiColorModeStarted) return;

        if (currentlyMultiSelectedColors.length) {
            multiSelect();
        } else {
            currentlySingleSelectedColor =
                currentlySingleSelectedColor === initialColorKey
                    ? undefined
                    : initialColorKey;
        }
    };

    const multiSelect = () => {
        if (multiColorModeStarted) return;

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

        $contextCurrentLockedValueStore.set(initialColorKey, { ...$rgbStore });
    };

    const updateColorFromMultiselect = (
        updateMap: Map<string, multiSelectUpdate>
    ) => {
        let update: multiSelectUpdate = updateMap.get(initialColorKey);
        if (update) {
            $rgbStore[update.rgbVal] = update.newValue;
            $rgbStore = $rgbStore;
        }
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    style="--r: {$rgbStore.r}; --g: {$rgbStore.g}; --b: {$rgbStore.b}; --palette-grid-size: {paletteGridSize}"
    class="palette"
    on:click={click}
    on:contextmenu|preventDefault|stopPropagation={multiSelect}
    class:multiSelected
    class:multiSelectStarted
    class:multiColorModeStarted
    class:selected
    class:changed={!isEquals($rgbStore, initialColorRGB)}
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
        /* The hight of an element should be 100% divided by how many elements we want in the height. Minus the gap between each element.
        There's a gap between each element, so if the grid has n elements in a column, there will be n-1 grid gaps*/
        width: calc(
            calc(100% / var(--palette-grid-size)) -
                calc(var(--grid-gap) * calc(var(--palette-grid-size) - 1))
        );
        height: auto;
    }

    :global(.wide .palette) {
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
