<script lang="ts">
    import { CurrentWindow } from "./colorpicker/types";

    export let currentWindow: string;
    export let selectedPokemonImg: HTMLImageElement;
    let selectPokemonBtn: HTMLButtonElement;
    let editSpriteBtn: HTMLButtonElement;
    let palettesBtn: HTMLButtonElement;
</script>

<div class="menu">
    <button
        bind:this={selectPokemonBtn}
        on:click={() => (currentWindow = CurrentWindow.SELECT)}
        class:selected={currentWindow === CurrentWindow.SELECT}
        disabled={currentWindow === CurrentWindow.SELECT}>Select Pokemon</button
    >
    <button
        bind:this={editSpriteBtn}
        on:click={() => (currentWindow = CurrentWindow.EDIT)}
        class:selected={currentWindow === CurrentWindow.EDIT}
        disabled={selectedPokemonImg === undefined || currentWindow === CurrentWindow.EDIT}>Edit sprite</button
    >
    <button
        bind:this={palettesBtn}
        on:click={() => (currentWindow = CurrentWindow.PALETTES)}
        class:selected={currentWindow === CurrentWindow.PALETTES}
        disabled={currentWindow === CurrentWindow.PALETTES}>Palettes</button
    >
</div>

<style>
    .menu {
        position: absolute;
        top: 0px;
        width: 100%;
    }

    button.selected {
        border: 1px solid green;
    }
</style>
