<script lang="ts">
    import {onMount} from "svelte";
    import {slide} from "svelte/transition";
    import * as Card from "$lib/components/ui/card";
    import {Clock3, Heart} from "lucide-svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { formatDistanceToNowStrict } from "date-fns";
    import {Button} from "$lib//components/ui/button";
    import {invalidateAll} from "$app/navigation";

    export let manga;
    export let newChapters;
    let db;
    let haveReadHistory;
    let isFavorite: any = false;

    onMount(async () => {
        db = import('$lib/db');

        haveReadHistory = await db.lastReadMangaChapter.get( manga.id.toString());
        isFavorite = await db.favouriteManga.get(manga.id.toString())
    });

    $: chapterNumbers = newChapters.chapters.map(chapter => parseInt(chapter.chapter_number));
    $: mainBorder = isFavorite ? 'border-rose-800' : haveReadHistory ? 'border-green-500' : '';

    const addToFavorites = async (e) => {
        e.preventDefault();
        if (isFavorite) {
            await db.favouriteManga.delete(manga.id.toString());
        } else {
            await db.favouriteManga.put( {
                id: manga.id.toString(),
                image: manga.cover,
                name: manga.title,
                description: manga.description,
                slug: manga.slug
            } );
        }
        isFavorite = await db.favouriteManga.get(manga.id.toString());
        await invalidateAll()
    }

</script>

<div class="group" transition:slide={{axis: 'y'}}>
    <Card.Root class="group-hover:scale-105 transition-all duration-300 {mainBorder}">
        <Card.Content class="pt-3 px-2.5">
            <div class="grid grid-cols-3 gap-x-2">
                <div class="col-span-1 relative">
                    {#if manga.is_new}
                        <div class="absolute right-1">
                            <Badge class="bg-green-700/80 text-foreground group-hover:bg-green-500">New</Badge>
                        </div>
                    {/if}
                    <img loading="lazy" class="rounded-lg w-[122px] h-[173px]" src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.cover}" alt="Read {manga.title}"/>
                </div>
                <div class="col-span-2">
                    <a href="/manga/{manga.id}/{manga.slug}">
                        <div class="flex items-center gap-x-1 pb-1 border-b">
                            <h3 class="text-lg font-semibold tracking-tight truncate">{manga.title}</h3>
                        </div>
                    </a>
                    <div class="mt-2 space-y-2">
                        <a href="/manga/{manga.id}/{manga.slug}/{newChapters.chapters[0].id}/chapter-{newChapters.chapters[0].slug}">
                            <Card.Root>
                                <Card.Content class="px-2.5 py-1">
                                    <div class="flex items-center justify-between">
                                        <p>Chapter {newChapters.chapters[0].chapter_number}</p>
                                        <p>New</p>
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        </a>
                        <Button variant="secondary" class="flex items-center gap-x-1 w-full {isFavorite ? 'bg-rose-800 hover:bg-rose-200 hover:text-rose-800 ease-in-out': ''}" on:click={(e) => {
							addToFavorites(e)
						}}>
                            <Heart class="h-4" />
                            {isFavorite ? 'Your' : 'Add to'} Favorites
                        </Button>
                        <Button variant="secondary" class="w-full" href="{haveReadHistory ? `/manga/${manga.id}/${manga.slug}/${haveReadHistory.chapterId}/${haveReadHistory.chapterSlug}` : `/manga/${manga.id}/${manga.slug}`}">
                            {haveReadHistory ? 'Continue' : 'Start'} Reading {haveReadHistory ? `Chapter ${haveReadHistory.chapterNumber}` : ''}
                        </Button>
                    </div>
                </div>

            </div>
        </Card.Content>
        <Card.Footer class="pb-3 px-2.5 flex items-center justify-between">
            <p class="text-lg tracking-tight">Last Updated</p>
            <div class="flex items-center gap-x-2">
                <Clock3 class="h-4 w-4"/>
                <span class="capitalize">{formatDistanceToNowStrict(new Date(manga['last_chapter_created_at']))}</span>
            </div>
        <div class="italic">
            {newChapters.count} {newChapters.count > 1 ? 'Chapters' : 'Chapter'}
        </div>
    </Card.Footer>
    </Card.Root>
</div>
