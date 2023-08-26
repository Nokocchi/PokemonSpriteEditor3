<script lang="ts">
    import data from "./util/pokedex.json";
    import Search from "./Search.svelte";
    import Dropdown from "./Dropdown.svelte";
    import { extractPixelData, type PokemonSelectOption } from "../colorpicker/types";
    import SpecificPokemonCatalog from "./SpecificPokemonCatalog.svelte";
    import { createEventDispatcher } from "svelte";
    import { dirtyImageDataStore } from "../colorpicker/store";
    const dispatch = createEventDispatcher();

    export let selectedPokemonNr: number;
    export let invisible: boolean;

    let selectedPokemonImg: HTMLImageElement;
    let files: FileList;
    let fileInput: HTMLInputElement;

    let pokemonSelectOptions: PokemonSelectOption[] = data.map((entry) => {
        return { id: entry.id, name: entry.name.english };
    });

    $: handlePokemonSelected(selectedPokemonImg);
    
    const handlePokemonSelected = (image: HTMLImageElement) => {
        if(!image) return;
        let imageData: ImageData = extractPixelData(image);
        $dirtyImageDataStore = new Uint8ClampedArray(imageData.data)
        dispatch("imageSelected", imageData);
    }

    const setUploadedImage = (fileList: FileList) => {
        if (!files) return;

        let file: File = fileList.item(0);

        let image: HTMLImageElement = new Image();
        var reader = new FileReader();
        image.title = file.name;

        reader.onload = () => {
            image.src = reader.result as string;
        };

        image.onload = () => {
            selectedPokemonNr = undefined;
            selectedPokemonImg = image;
        };

        reader.readAsDataURL(file);
    };

    $: setUploadedImage(files);
</script>

<div class="pokemon-selector" class:invisible>
    <div class="selector-inputs">
        <input bind:this={fileInput} bind:files type="file" accept="image/*"/>
        <Dropdown bind:selectedPokemonNr {pokemonSelectOptions} />
        <p>or</p>
        <Search bind:selectedPokemonNr {pokemonSelectOptions} />
        <p>or</p>
        <button on:click={() => {fileInput.click()}}>Upload your own image</button>
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

    .selector-inputs button {
        width: 100%;
        height: 45px;
    }

    input {
        display: none;
    }
</style>
