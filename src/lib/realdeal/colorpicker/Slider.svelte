<script lang="ts">
    export let currentValue: number;
    export let minValue: number;
    export let maxValue: number;
    export let initialValue: number;
    export let disabled: boolean;

    const setValue = (newValue: number) => {
        currentValue = newValue;
    };

    $: setValue(initialValue);
</script>

<div class="slider">
    <button on:click={() => setValue(initialValue)} {disabled}>Reset</button>
    <input
        bind:value={currentValue}
        type="range"
        min={minValue}
        max={maxValue}
        class="slider"
        id="myRange"
        {disabled}
    />
    <input
        bind:value={currentValue}
        type="text"
        id="value"
        name="value"
        class="slider-input"
        {disabled}
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
