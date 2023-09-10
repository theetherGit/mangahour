<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { formatDistanceToNowStrict } from 'date-fns';
    import {fade, fly} from "svelte/transition";
    import {Heart} from "lucide-svelte";
    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    import {db} from "$lib/db";
    import {liveQuery} from "dexie";
    import {create, insertMultiple, search} from "@orama/orama";
    import favouriteUpdateCheckerWorker from "$lib/workers/favoriteUpdateChecker?worker";

    let favouriteManga = liveQuery( async () => {
        return db.favouriteManga.orderBy('lastUpdated').reverse().toArray();
    });

    let favouriteUpdateChecker: any;

    let favouriteMangaSearchDB: any = null;

    onMount(async () => {
        favouriteUpdateChecker = new favouriteUpdateCheckerWorker();
        favouriteUpdateChecker.postMessage({});
        favouriteMangaSearchDB = await create( {
            schema: {
                name: 'string'
            },
            components: {}
        } );
    });

    $: if (browser && $favouriteManga && $favouriteManga.length && favouriteMangaSearchDB && favouriteMangaSearchDB.data.docs.count === 0) {
        insertMultiple( favouriteMangaSearchDB, $favouriteManga, $favouriteManga.length ).then()
    }

    $: mangaInView = $favouriteManga;

    const searchFavManga = async (value: string) => {
        if (value && favouriteMangaSearchDB) {
            console.log(favouriteMangaSearchDB, value);
            const results = await search(favouriteMangaSearchDB, {
                term: value,
                properties: '*',
                limit: 20
            });
            const searchResultChapters = results.hits.map((data) => {
                return data.document;
            });
            mangaInView = searchResultChapters;
        } else {
            mangaInView = $favouriteManga;
        }
    };

    async function removeFavorite(id: string) {
        await db.favouriteManga.delete(id)
    }

</script>

<Sheet.Root>
    <Sheet.Trigger asChild let:builder>
        <Button builders={[builder]} variant="outline" class="flex items-center gap-x-2 text-rose-500 border-rose-500 hover:bg-rose-500 transition-colors duration-500 text-xl md:text-sm">
            <Heart class="h-6 w-6 md:h-4 md:w-4"/> Favourites
        </Button>
    </Sheet.Trigger>
    <Sheet.Content side="right" class="overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary scrollbar-thumb-rounded min-w-full md:min-w-[33%]">
        <Sheet.Header>
            <Sheet.Title class="text-left">Your Favourites</Sheet.Title>
            <Sheet.Description class="text-left">
                Here is your favourite manga list. Manga's are ordered in updated latest to last so first manga is recently updated.
            </Sheet.Description>
        </Sheet.Header>
        <div class="grid mt-5">
            <Input on:input={async (e) => {await searchFavManga(e?.target?.value)}} placeholder="Search from favorites.."/>
            <div class="grid mt-5 gap-y-4">
                {#if mangaInView.length}
                    {#each mangaInView as manga}
                        <div in:fly out:fade>
                            <Card.Root>
                                <div class="grid grid-cols-3 px-4 py-2 gap-x-2.5">
                                    <div class="col-span-1">
                                        <img class="rounded-lg" src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.image}" alt="Read {manga.name} on Manga Hour">
                                    </div>
                                    <div class="col-span-2">
                                        <a href="/manga/{manga.id}/{manga.slug}">
                                            <h2 class="text-lg font-semibold tracking-tight">{manga.name}</h2>
                                        </a>
                                        <div class="pt-4 space-y-2">
                                            <Button variant="outline" class="w-full flex space-x-2 items-center justify-between">
                                                Last Updated <spane>{formatDistanceToNowStrict(manga.lastUpdated)}</spane>
                                            </Button>
                                            <Button variant="destructive" class="w-full" on:click={async () => {
                                                await removeFavorite(manga.id);
                                            }}>Remove from Favorites</Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Root>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
        <Sheet.Footer>
<!--            <Sheet.Close asChild let:builder>-->
<!--                <Button builders={[builder]} type="submit">Save changes</Button>-->
<!--            </Sheet.Close>-->
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
