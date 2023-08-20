<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import Pencil from "~icons/mdi/pencil";
    import MultiSelectIcon from "~icons/mdi/checkbox-blank-circle-outline";
    import SelectedMultiSelectIcon from "~icons/mdi/check-circle-outline";
    import {
        contextCurrentLockedValueStore,
        contextInitialValueStore,
        contextUpdateBStore,
        contextUpdateGStore,
        contextUpdateRStore,
        getAsRGB,
        isEquals,
        type RGB,
    } from "./types";
    import {
        createEventDispatcher,
        getContext,
        onMount,
        setContext,
    } from "svelte";

    export let initialColorKey: string;
    export let currentlySingleSelectedColor: string;
    export let currentlyMultiSelectedColors: string[];
    export let multiColorModeStarted: boolean;
    const dispatch = createEventDispatcher();
    const { rgbStore }: any = getContext(initialColorKey);
    let initialColorRGB: RGB = getAsRGB(initialColorKey);

    $: multiSelected =
        currentlyMultiSelectedColors.filter(
            (other) => other === initialColorKey
        ).length > 0;
    $: multiSelectStarted = currentlyMultiSelectedColors.length > 0;
    $: selected = currentlySingleSelectedColor === initialColorKey;
    $: {
        dispatch("colorChange", $rgbStore);
    }

    onMount(() => {
        // Once all the color pickers are ready, re-set the rgbstore to trigger drawing to the preview/palette
        //$rgbStore = $rgbStore;
    });

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
            return;
        } else {
            currentlyMultiSelectedColors = [
                ...currentlyMultiSelectedColors,
                initialColorKey,
            ];
        }

        // What is this magic? I cannot set currentValueLockedWhenMultiSelect = $rgbStore
        // Or even do = Object.create($rgbStore) or = Object.assign($rgbStore)
        // Because then the value of currentValueLockedWhenMultiSelect gets changed once more, somehow, without this method being run
        // Is it because these objects are being set by reference? Is the = $rgbStore being run asynchronously?

        let currentValueLockedWhenMultiSelect: RGB = {
            r: $rgbStore.r,
            g: $rgbStore.g,
            b: $rgbStore.b,
        };

        $contextUpdateRStore.set(initialColorKey, (newValue: number) => {
            console.log("IN METHOD, update r to new value", newValue);
            $rgbStore.r = newValue;
            $rgbStore = $rgbStore;
        });

        $contextUpdateGStore.set(initialColorKey, (newValue: number) => {
            $rgbStore.g = newValue;
            $rgbStore = $rgbStore;
        });

        $contextUpdateBStore.set(initialColorKey, (newValue: number) => {
            $rgbStore.b = newValue;
            $rgbStore = $rgbStore;
        });

        $contextCurrentLockedValueStore.set(
            initialColorKey,
            currentValueLockedWhenMultiSelect
        );
        $contextInitialValueStore.set(initialColorKey, initialColorRGB);
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    style="--r: {$rgbStore.r}; --g: {$rgbStore.g}; --b: {$rgbStore.b}; "
    class="palette"
    on:click={click}
    on:contextmenu|preventDefault|stopPropagation={multiSelect}
    class:multiSelected
    class:multiSelectStarted
    class:multiColorModeStarted
    class:selected
    class:changed={!isEquals($rgbStore, initialColorRGB)}
>
    <MultiSelectIcon class="palette-icon multi-select-icon"/>
    <SelectedMultiSelectIcon class="palette-icon selected-multi-select-icon"/>
    <Pencil
        class="palette-icon changed-icon"
    />
</div>

<style>
    .palette {
        position: relative;
        height: 100px;
        width: 100px;
        background-color: rgb(var(--r), var(--g), var(--b));
        box-sizing: border-box;
    }

    :global(.palette-icon){
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
