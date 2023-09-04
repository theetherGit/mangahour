<script lang="ts">
    import { Squirrel, Eye } from "lucide-svelte";
    import {browser} from "$app/environment";
    import type {PageServerData} from "./$types";
    import * as Card from "$lib/components/ui/card";
    import * as Tabs from "$lib/components/ui/tabs";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import {HomePageMangaViewCard, TopChaptersListViewCard, TopMangaListViewCard} from "$lib/components";


    export let data: PageServerData;

    $: newMangaList = data.home.latest;
    if (browser) console.log(data.home)
</script>

<section id="main">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4">
        <div class="col-span-3 md:col-span-2 space-y-4">
            <Input
                    type="search"
                    placeholder="Search Manga..."
            />
            <Card.Root>
                <Card.Header>
                    <Card.Title>
                        <div class="flex items-center justify-between border-b pb-2">
                            <div class="flex items-center gap-2 text-primary">
                                <Squirrel class="text-primary"/>
                                <h2> Latest Updates </h2>
                            </div>
                            <div>
                                <Button size="sm" class="h-min px-2 py-1 text-foreground bg-primary hover:bg-accent hover:text-foreground transition-all duration-500 ease-in-out"> View All </Button>
                            </div>
                        </div>
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    {#if data.home.latest}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {#each data.home.latest as manga}
                                {@const newChapters = JSON.parse(manga['new_chapters'])}
                                <HomePageMangaViewCard {manga} {newChapters}/>
                            {/each}
                        </div>
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>
        <div class="pb-2 space-y-4">

            <Card.Root>
                <Card.Header class="text-center font-bold pt-3">
                    Top Chapters
                </Card.Header>
                <Card.Content>
                    <Tabs.Root value="today">
                        <Tabs.List class="grid w-full grid-cols-3">
                            <Tabs.Trigger value="halfDay">6 Hours</Tabs.Trigger>
                            <Tabs.Trigger value="today">Today</Tabs.Trigger>
                            <Tabs.Trigger value="week">This week</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="today">
                            <TopChaptersListViewCard mangaList={data.home.topChaptersToday}/>
                        </Tabs.Content>
                        <Tabs.Content value="halfDay">
                            <TopChaptersListViewCard mangaList={data.home.topChaptersLastSixHours}/>
                        </Tabs.Content>
                        <Tabs.Content value="week">
                            <TopChaptersListViewCard mangaList={data.home.topChaptersWeekly}/>
                        </Tabs.Content>
                    </Tabs.Root>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header class="text-center font-bold pt-3">
                    Top Manga
                </Card.Header>
                <Card.Content>
                    <Tabs.Root value="readCount">
                        <Tabs.List class="grid w-full grid-cols-2">
                            <Tabs.Trigger value="readCount">By Reads</Tabs.Trigger>
                            <Tabs.Trigger value="bookmarks">By Bookmarks</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="readCount">
                            <TopMangaListViewCard mangaList={data.home.topMangaByViews}/>
                        </Tabs.Content>
                        <Tabs.Content value="bookmarks">
                            <TopMangaListViewCard typeOfView="bookmarks" mangaList={data.home.topMangaByBookmarks}/>
                        </Tabs.Content>
                    </Tabs.Root>
                </Card.Content>
            </Card.Root>
        </div>
    </div>

</section>
