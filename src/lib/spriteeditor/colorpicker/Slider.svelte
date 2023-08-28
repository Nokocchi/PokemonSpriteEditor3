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
    export let currentValue: number;
    export let minValue: number;
    export let maxValue: number;
    export let initialValue: number;
    export let sliderType: string;
    export let resetButtondisabled: boolean;
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
    <button on:click={reset} class="reset" disabled={resetButtondisabled}>Reset</button>
    <div class="slider-input-container">
        <input
            bind:value={currentValue}
            type="range"
            min={minValue}
            max={maxValue}
            class="slider {sliderType}"
            id="myRange"
        />
        <div class="label-container">
            <p class="min">{minValue}</p>
            <input
                bind:value={currentValue}
                type="text"
                id="value"
                name="value"
                class="textbox"
            />
            <p class="max">{maxValue}</p>
        </div>
    </div>
</div>

<style>
    p {
        width: 50px;
    }

    .min {
        text-align: left;
    }

    .max {
        text-align: right;
    }

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

    .label-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .label-container p {
        margin: 0;
        align-items: end;
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
        width: 30px;
        text-align: center;
    }

    .reset:enabled {
        background-color: maroon;
    }

    .reset:disabled {
        pointer-events: none;
    }
</style>
