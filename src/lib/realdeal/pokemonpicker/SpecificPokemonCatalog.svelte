<script lang="ts">
    import { onMount } from "svelte";
    import imgPathsByNr from "./util/pathByNr.json";
    import type { SpritePath } from "../colorpicker/types";
    import CollapsibleSection from "./CollapsibleSection.svelte";
    import SpriteTypeSelector from "./SpriteTypeSelector.svelte";
    export let selectedPokemonImg: HTMLImageElement;
    export let selectedPokemonNr: number;
    let spritePaths: SpritePath[] = [];
    let genGamePathMap: Map<string, Map<string, string[]>> = new Map<
        string,
        Map<string, string[]>
    >();

    $: showCatalog(imgPathsByNr[selectedPokemonNr]);

    const showCatalog = (selectedImgPaths: string[]) => {
        genGamePathMap.clear();
        if (selectedImgPaths) {
            selectedImgPaths.forEach((path) => {
                let pathVariables: string[] = path.split("/");
                let generation = pathVariables[1];
                let game = pathVariables[2];

                if (!genGamePathMap.has(generation)) {
                    genGamePathMap.set(generation, new Map<string, string[]>());
                }
                if (!genGamePathMap.get(generation).has(game)) {
                    genGamePathMap.get(generation).set(game, []);
                }
                genGamePathMap.get(generation).get(game).push(path);
            });
        }
        genGamePathMap = genGamePathMap;
    };
</script>

{#each [...genGamePathMap] as [generation, games]}
    <CollapsibleSection headerText={generation} expanded={true}>
        {#each [...games] as [game, paths]}
            <CollapsibleSection headerText={game} expanded={true}>
                <SpriteTypeSelector {paths} bind:selectedPokemonImg />
            </CollapsibleSection>
        {/each}
    </CollapsibleSection>
{/each}


