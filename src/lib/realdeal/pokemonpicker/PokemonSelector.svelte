<script lang="ts">
    import { onMount } from "svelte";
    import data from "./util/pokedex.json";
    import Search from "./Search.svelte";
    import Dropdown from "./Dropdown.svelte";
    import type { PokemonSelectOption } from "../colorpicker/types";
    import SpecificPokemonCatalog from "./SpecificPokemonCatalog.svelte";
    import Canvas from "../Canvas.svelte";

    export let selectedPokemonNr: number;
    export let imageData: ImageData;
    let selectedPokemonImg: HTMLImageElement;

    let files: FileList;

    let pokemonSelectOptions: PokemonSelectOption[] = data.map((entry) => {
        return { id: entry.id, name: entry.name.english };
    });

    $: selectedPokemonImg && extractPixelData(selectedPokemonImg);

    const extractPixelData = (pkmnImage: HTMLImageElement) => {
        let tempCanvas: OffscreenCanvas = new OffscreenCanvas(pkmnImage.width, pkmnImage.height)
        tempCanvas.getContext("2d").drawImage(pkmnImage, 0, 0);
        imageData = tempCanvas.getContext("2d").getImageData(0, 0, pkmnImage.width, pkmnImage.height);
    }

    const setUploadedImage = (fileList: FileList) => {
        if(!files) return;

        let file: File = fileList.item(0);

        let image: HTMLImageElement = new Image();
        var reader = new FileReader();
        image.title = file.name;

        reader.onload = () => {
            image.src = reader.result as string;
        };

        image.onload = () => {
            selectedPokemonImg = image;
        };

        reader.readAsDataURL(file);
    };

    $: setUploadedImage(files);
</script>

<input bind:files type="file" accept="image/*" />
<Dropdown bind:selectedPokemonNr {pokemonSelectOptions} />
<Search bind:selectedPokemonNr {pokemonSelectOptions} />
<SpecificPokemonCatalog bind:selectedPokemonImg {selectedPokemonNr} />
