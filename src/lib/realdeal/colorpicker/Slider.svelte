<script lang="ts">
    export let currentValue: number;
    export let minValue: number;
    export let maxValue: number;
    export let initialValue: number;

    $: currentValue = initialValue;

</script>

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
/>
