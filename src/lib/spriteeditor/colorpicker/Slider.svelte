<script context="module" lang="ts">
    export const SliderType = Object.freeze({
        H: "HUE",
        S: "SATURATION",
        L: "LUMINOSITY",
        R: "RED",
        G: "GREEN",
        B: "BLUE",
    });
</script>

<script lang="ts">
    import type { RGB } from "../types";

    export let currentValue: number;
    export let minValue: number;
    export let maxValue: number;
    export let initialValue: number;
    export let sliderType: string;
    export let resetCallback: () => void = () => {};

    const reset = () => {
        setValue(initialValue);
        resetCallback();
    };

    const setValue = (newValue: number) => {
        currentValue = newValue;
    };

    $: setValue(initialValue);
</script>

<div class="slider-component">
    <button on:click={reset} class="reset">Reset</button>
    <div class="slider-input-container">
        <input
            bind:value={currentValue}
            type="range"
            min={minValue}
            max={maxValue}
            class="slider {sliderType}"
            id="myRange"
        />
        <div class="min-max-container">
            <p>{minValue}</p>
            <p>{maxValue}</p>
        </div>
    </div>
    <input
        bind:value={currentValue}
        type="text"
        id="value"
        name="value"
        class="textbox"
    />
</div>

<style>
    .slider-component {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15px;
    }

    .slider-input-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .min-max-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .slider {
        appearance: none;
        border-radius: 10px;
    }

    .slider.HUE {
        background: linear-gradient(
            to right,
            rgb(255, 0, 0),
            rgb(255, 255, 0),
            rgb(0, 255, 0),
            rgb(0, 255, 255),
            rgb(0, 0, 255),
            rgb(255, 0, 255),
            rgb(255, 0, 0)
        );
    }

    .slider.SATURATION {
        background: linear-gradient(
            to right,
            var(--color-min),
            var(--color-max)
        );
    }

    .slider.LUMINOSITY {
        background: linear-gradient(
            to right,
            var(--color-min),
            var(--color-mid),
            var(--color-max)
        );
    }

    .slider.RED {
        background-color: red;
    }

    .slider.GREEN {
        background-color: green;
    }

    .slider.BLUE {
        background-color: blue;
    }

    .textbox {
        width: 25px;
    }

    .reset {
        background-color: maroon;
    }
</style>
