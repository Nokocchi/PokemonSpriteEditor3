<script lang="ts">
    export let selectedPokemonNr: number;
    export let selectedPokemonImg: HTMLImageElement;
    let files: FileList;
    let fileInput: HTMLInputElement;

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

<input bind:this={fileInput} bind:files type="file" accept="image/*" />
<button
    on:click={() => {
        fileInput.click();
    }}>Upload your own image</button
>

<style>
    button {
        width: 100%;
        height: 45px;
    }

    input {
        display: none;
    }
</style>