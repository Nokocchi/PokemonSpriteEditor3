<script context="module" lang="ts">
    // Super ugly, but I want to avoid doing another 10.000 file commit by changing the directory name
       export const formatHeaderText = (headerText: string): string => {
        return headerText
        .replace("-", " / ")
        .replace("1", " 1")
        .replace("2", " 2")
        .replace("3", " 3")
        .replace("4", " 4")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
</script>

<script lang="ts">
    import imgPathsByNr from "./util/pathByNr.json";
    import CollapsibleSection from "./CollapsibleSection.svelte";
    import SpecificPokemonSpriteTypeSelector from "./SpecificPokemonSpriteTypeSelector.svelte";
    import type { SpritePath } from "../../spriteeditor/types";
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
                let otherVariables: string[] = pathVariables.slice(
                    3,
                    pathVariables.length - 1
                );

                if (!genGamePathMap.has(generation)) {
                    genGamePathMap.set(
                        generation,
                        new Map<string, SpritePath[]>()
                    );
                }
                if (!genGamePathMap.get(generation).has(game)) {
                    genGamePathMap.get(generation).set(game, []);
                }

                let spritePath: SpritePath = {
                    fullPath: path,
                    generation: generation,
                    game: game,
                    other: otherVariables,
                };
                genGamePathMap.get(generation).get(game).push(spritePath);
            });
            genGamePathMap = genGamePathMap;
        }
    };

</script>

<div class="specific-pokemon-catalog">
    {#each [...genGamePathMap] as [generation, games]}
        <CollapsibleSection headerText={formatHeaderText(generation)} expanded={true}>
            {#each [...games] as [game, paths]}
                <CollapsibleSection headerText={formatHeaderText(game)} expanded={true}>
                    <SpecificPokemonSpriteTypeSelector allPathsForThisPokemon={paths} bind:selectedPokemonImg />
                </CollapsibleSection>
            {/each}
        </CollapsibleSection>
    {/each}
</div>

<style>
    .specific-pokemon-catalog {
        margin-top: 25px;
    }
</style>
