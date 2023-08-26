<script lang="ts">
    import { CurrentWindow } from "../spriteeditor/types";



    export let currentWindow: string;
    export let noPokemonSelected: boolean;
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
        disabled={noPokemonSelected || currentWindow === CurrentWindow.EDIT}>Edit sprite</button
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
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        flex-shrink: 0;
    }

    button {
        border-radius: 0%;
        width: calc(100dvw/3);
    }

    button.selected {
        border: 1px solid green;
    }
</style>
