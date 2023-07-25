<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    const minVal = 1;
    const maxVal = 1000;
    let currentVal = 50;

    $: if (currentVal == maxVal) {
            dispatch("maxVal");
        }
    
</script>

<div class="slidecontainer">
    {currentVal}
    <input
        bind:value={currentVal}
        type="range"
        min={minVal}
        max={maxVal}
        class="slider"
        id="myRange"
    />
</div>
