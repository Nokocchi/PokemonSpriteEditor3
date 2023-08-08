<script lang="ts">
    import { onMount } from "svelte";
    import imgPathsByNr from "./util/pathByNr.json";
    import type { SpritePath } from "../colorpicker/types";
    import CollapsibleSection from "./CollapsibleSection.svelte";
    import SpriteTypeSelector from "./SpriteTypeSelector.svelte";
    export let selectedPokemonImg: HTMLImageElement;
    export let selectedPokemonNr: number;

    let genGamePathMap: Map<string, Map<string, SpritePath[]>> = new Map<
        string,
        Map<string, SpritePath[]>
    >();

    $: showCatalog(imgPathsByNr[selectedPokemonNr]);

    const showCatalog = (selectedImgPaths: string[]) => {
        genGamePathMap.clear();
        if (selectedImgPaths) {
            selectedImgPaths.forEach((path) => {
                let pathVariables: string[] = path.split("/");
                let generation = pathVariables[1];
                let game = pathVariables[2];
                let otherVariables: string[] = pathVariables.slice(3, pathVariables.length-1);

                if (!genGamePathMap.has(generation)) {
                    genGamePathMap.set(generation, new Map<string, SpritePath[]>());
                }
                if (!genGamePathMap.get(generation).has(game)) {
                    genGamePathMap.get(generation).set(game, []);
                }

                let spritePath: SpritePath = {
                    fullPath: path,
                    generation: generation,
                    game: game,
                    other: otherVariables
                }
                genGamePathMap.get(generation).get(game).push(spritePath);
            });
            genGamePathMap = genGamePathMap;
        }
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


