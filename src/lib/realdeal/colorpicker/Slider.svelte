<script lang="ts">
    	import { onMount } from 'svelte';

    export let currentValue: number;
    export let minValue: number;
    export let maxValue: number;
    export let initialValue: number;
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    const setValue = (newValue: number) => {
        currentValue = newValue;
    }

    $: setValue(initialValue);

</script>

<div class="slider">
    <button on:click={() => setValue(initialValue)}>Reset</button>
    <input
        bind:value={currentValue}
        type="range"
        min={minValue}
        max={maxValue}
        class="slider"
        id="myRange"
    />
    <input
        bind:value={currentValue}
        type="text"
        id="value"
        name="value"
        class="slider-input"
    />
</div>

<style>
    .slider {
        display: flex;
        flex-direction: row;
    }

    .slider-input {
        width: 25px;
    }
</style>
