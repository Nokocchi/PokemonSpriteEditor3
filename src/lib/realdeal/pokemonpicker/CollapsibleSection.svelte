<script>
    import { slide } from "svelte/transition";
    export let headerText;

    export let expanded = false;
</script>

<div class="collapsible">
    <h3>
        <button aria-expanded={expanded} on:click={() => (expanded = !expanded)}
            >{headerText}
            <svg viewBox="0 0 20 20" fill="none">
                <path
                    class="vert"
                    d="M10 1V19"
                    stroke="white"
                    stroke-width="2"
                />
                <path d="M1 10L19 10" stroke="white" stroke-width="2" />
            </svg>
        </button>
    </h3>

    {#if expanded}
        <div class="contents" transition:slide>
            <slot />
        </div>
    {/if}
</div>

<style>
    .collapsible {
        width: 100%;
    }

    .collapsible .collapsible button {
        background-color: var(--background, #141414);
        color: var(--gray-darkest, #888888);
    }

    h3 {
        margin: 0;
    }

    button {
        background-color: var(--background, #080808);
        color: var(--gray-darkest, #b8b8b8);
        display: flex;
        justify-content: space-between;
        width: 100%;
        border: none;
        margin: 0;
        padding: 1em 0.5em;
        border-radius: 0%;
        outline: 1px solid black;
    }

    button[aria-expanded="true"] {
    }

    button[aria-expanded="true"] .vert {
        display: none;
    }

    button [aria-expanded="true"] rect {
        fill: currentColor;
    }

    svg {
        height: 0.7em;
        width: 0.7em;
    }
</style>
