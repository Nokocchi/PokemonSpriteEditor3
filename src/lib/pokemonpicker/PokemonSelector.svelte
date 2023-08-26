<script lang="ts">
    import Search from "./selectmethod/Search.svelte";
    import Dropdown from "./selectmethod/Dropdown.svelte";
    import FileUpload from "./selectmethod/FileUpload.svelte";
    import SpecificPokemonCatalog from "./spritecatalog/SpecificPokemonCatalog.svelte";
    import { createEventDispatcher } from "svelte";
    import { extractPixelData, type PokemonSelectOption } from "../spriteeditor/types";
    import { contextColorUpdateStore, contextCurrentLockedValueStore, dirtyImageDataStore } from "../spriteeditor/store";
    import data from "./spritecatalog/util/pokedex.json";
    const dispatch = createEventDispatcher();

    export let selectedPokemonNr: number;
    export let invisible: boolean;

    let selectedPokemonImg: HTMLImageElement;

    let pokemonSelectOptions: PokemonSelectOption[] = data.map((entry) => {
        return { id: entry.id, name: entry.name.english };
    });

    $: handlePokemonSelected(selectedPokemonImg);

    const handlePokemonSelected = (image: HTMLImageElement) => {
        if (!image) return;
        let imageData: ImageData = extractPixelData(image);
        $contextCurrentLockedValueStore.clear();
        $contextColorUpdateStore.clear();
        $dirtyImageDataStore = new Uint8ClampedArray(imageData.data);
        dispatch("imageSelected", imageData);
    };
</script>

<div class="pokemon-selector" class:invisible>
    <div class="selector-inputs">
        <Dropdown bind:selectedPokemonNr {pokemonSelectOptions} />
        <p>or</p>
        <Search bind:selectedPokemonNr {pokemonSelectOptions} />
        <p>or</p>
        <FileUpload bind:selectedPokemonNr bind:selectedPokemonImg />
    </div>
    {#key selectedPokemonNr}
        <SpecificPokemonCatalog bind:selectedPokemonImg {selectedPokemonNr} />
    {/key}
</div>

<style>
    .pokemon-selector {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        height: 100%; /* To enable scrolling */
    }

    .pokemon-selector.invisible {
        display: none;
    }

    .selector-inputs {
        padding: 50px;
    }
</style>
