<script lang="ts">
    import {TopChaptersListViewCard, TopMangaListViewCard} from '$lib/components';
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Button } from '$lib/components/ui/button';
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Card from '$lib/components/ui/card';
    import * as Tabs from '$lib/components/ui/tabs';
    import {Input} from "$lib/components/ui/input";
    import {Filter, FilterX} from "lucide-svelte";
    import type {PageServerData} from "./$types";
    import SvelteSeo from "svelte-seo";
    import {page} from "$app/stores";
    import {onMount} from "svelte";

    export let data: PageServerData;

    $: mangasInView = data.result.data;
    let currentPage = data.result.currentPage;
    let lastPage = data.result.lastPage;

    let mangaListDiv: HTMLDivElement;

    let searchTerm: any = null;
    let loadingMoreData = false;

    $: searchBodyData = {
        includedGenres_all: [],
        includedLanguages: [],
        includedPubstatus: [],
        list_order: 'desc',
        list_type: 'added date',
        term: searchTerm
    };

    function clearFilter() {
        searchTerm = null;
        searchBodyData= {
            includedGenres_all: [],
            includedLanguages: [],
            includedPubstatus: [],
            list_order: 'desc',
            list_type: 'added date',
            term: searchTerm
        };
        mangasInView = data.result.data
    }

    function callback(entries: any, observer: any) {
        entries.forEach((entry: any) => {
            if(entry.isIntersecting) {
                loadNextPageManga(false)
            }
        });
    }
    function createObserver(target: HTMLElement, callback: any) {
        const options = {
            root: null,
            threshold: 0
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(target);
    }


    onMount(async () => {
        if (mangaListDiv) {
            createObserver(mangaListDiv, callback);
        }
    });

    async function loadNextPageManga(searchInitiated = false) {
        loadingMoreData = true;
        let nextPage = 1;
        if (!searchInitiated) {
            nextPage = currentPage + 1;
        }
        if (lastPage >= nextPage) {
            const response = await fetch(`/manga?page=${nextPage}`, {
                method: "POST",
                body: JSON.stringify(searchBodyData)
            });
            if (response.ok) {
                const jsonResponse = await response.json()
                if (jsonResponse.data) {
                    if (!searchInitiated) {
                        mangasInView = [...mangasInView, ...jsonResponse.data];
                    } else {
                        mangasInView = jsonResponse.data
                    }
                    currentPage = jsonResponse.currentPage;
                    lastPage = jsonResponse.lastPage
                }
            }
        }
        loadingMoreData = false;
    }
    $: if (searchTerm && searchTerm.length > 2) {
        loadNextPageManga(true)
    }

    function handleGenreFilter(state: boolean, genre: string) {
        if (state) {
            searchBodyData.includedGenres_all.push(genre)
        } else {
            if (searchBodyData.includedGenres_all.includes(genre)) {
                searchBodyData.includedGenres_all = searchBodyData.includedGenres_all.filter(gen => {
                    return gen !== genre
                })
            }
        }
        loadNextPageManga(true)
    }

    function handleLangFilter(state: boolean, lang: string) {
        if (state) {
            searchBodyData.includedLanguages.push(lang)
        } else {
            if (searchBodyData.includedLanguages.includes(lang)) {
                searchBodyData.includedLanguages = searchBodyData.includedLanguages.filter(lan => {
                    return lan !== lang
                })
            }
        }
        loadNextPageManga(true)
    }

    function handleStatusFilter(state: boolean, status: string) {
        if (state) {
            searchBodyData.includedPubstatus.push(status)
        } else {
            if (searchBodyData.includedPubstatus.includes(status)) {
                searchBodyData.includedPubstatus = searchBodyData.includedPubstatus.filter(stat => {
                    return stat !== status
                })
            }
        }
        loadNextPageManga(true)
    }
</script>

<SvelteSeo
        title="Mangahour | All Manga"
        description="Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas."
        canonical={$page.url.href}
        keywords="Read Manga on Mangahour, mangahour all mangas, mangahour manga list"
        applicationName="MangaHour"
        openGraph={{
		title: 'Mangahour | All Manga',
		description:
			'Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas.',
		url: `${$page.url.href}`,
		type: 'website',
		images: [
			{
				url: `${$page.url.origin}/og/home`,
				width: 800,
				height: 600,
				alt: 'Read manga, manwha and manhua on mangahour'
			}
		],
		site_name: 'MangaHour'
	}}
        twitter={{
		card: 'summary',
		site: '@mangahour',
		title: 'Mangahour | All Manga',
		description:
			'Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas.',
		image: `${$page.url.origin}/og/home`
	}}
        jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Mangahour | All Manga',
		description:
			'Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas.',
		url: `${$page.url.href}`
	}}
/>

<div class="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 relative">
    <div class="col-span-3 md:col-span-2 space-y-4 pb-4">
        <div class="flex items-center gap-x-2">
            <Input class="" type="search" placeholder="Search manga..." bind:value={searchTerm} />
            <Sheet.Root>
                <Sheet.Trigger asChild let:builder={sheetBuilder}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
                            <Button builders={[tooltipBuilder, sheetBuilder]} size="icon" variant="outline" class="p-2"><Filter /></Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <p>Advanced Search Filter</p>
                        </Tooltip.Content>
                    </Tooltip.Root>
                </Sheet.Trigger>
                <Sheet.Content side="right">
                    <Sheet.Header>
                        <Sheet.Title>Advanced Search Filters</Sheet.Title>
                        <Sheet.Description>
                            Make search on the basis of different available filters.
                        </Sheet.Description>
                    </Sheet.Header>
                    <div class="grid gap-4 py-4">
                        <Input class="" type="search" placeholder="Search manga..." bind:value={searchTerm} />
                        <Accordion.Root class="w-full" value="genre">
                            <Accordion.Item value="genre">
                                <Accordion.Trigger class="hover:no-underline">Genre</Accordion.Trigger>
                                <Accordion.Content>
                                    <div class="grid grid-cols-2 gap-y-2">
                                        {#each data.filters.genres as genre}
                                            <div class="flex items-center space-x-2">
                                                <Checkbox checked={searchBodyData.includedGenres_all.includes(genre.slug)} id={genre.slug} onCheckedChange={(state) => handleGenreFilter(state, genre.slug)}/>
                                                <Label
                                                        for={genre.slug}
                                                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {genre.name}
                                                </Label>
                                            </div>
                                        {/each}
                                    </div>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="themes">
                                <Accordion.Trigger class="hover:no-underline">Themes</Accordion.Trigger>
                                <Accordion.Content>
                                    <div class="grid grid-cols-2 gap-y-2">
                                        {#each data.filters.themes as theme}
                                            <div class="flex items-center space-x-2">
                                                <Checkbox checked={searchBodyData.includedGenres_all.includes(theme.slug)} id={theme.slug} onCheckedChange={(state) => handleGenreFilter(state, theme.slug)}/>
                                                <Label
                                                        for={theme.slug}
                                                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {theme.name}
                                                </Label>
                                            </div>
                                        {/each}
                                    </div>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="origins">
                                <Accordion.Trigger class="hover:no-underline">Origins</Accordion.Trigger>
                                <Accordion.Content>
                                    <div class="grid grid-cols-2 gap-y-2">
                                        {#each data.filters.languages as lang}
                                            <div class="flex items-center space-x-2">
                                                <Checkbox checked={searchBodyData.includedLanguages.includes(lang.name)} id={lang.name} onCheckedChange={(state) => handleLangFilter(state, lang.name)}/>
                                                <Label
                                                        for={lang.name}
                                                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {lang.name}
                                                </Label>
                                            </div>
                                        {/each}
                                    </div>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="status">
                                <Accordion.Trigger class="hover:no-underline">Status</Accordion.Trigger>
                                <Accordion.Content>
                                    <div class="grid grid-cols-2 gap-y-2">
                                        {#each data.filters.pubstatus as status}
                                            <div class="flex items-center space-x-2">
                                                <Checkbox checked={searchBodyData.includedLanguages.includes(status.name)} id={status.name} onCheckedChange={(state) => handleStatusFilter(state, status.name)}/>
                                                <Label
                                                        for={status.name}
                                                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {status.name}
                                                </Label>
                                            </div>
                                        {/each}
                                    </div>
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion.Root>
                    </div>
                </Sheet.Content>
            </Sheet.Root>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder>
                    <Button on:click={() => clearFilter()} builders={[builder]} size="icon" variant="outline" class="p-2"><FilterX /></Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>Clear Filter</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {#if mangasInView.length}
                {#each mangasInView as manga}
                    <a href="/manga/{manga.id}/{manga.slug}">
                        <Card.Root class="hover:scale-105 transition-all duration-500">
                            <div class="px-2 py-2">
                                <img
                                        loading="lazy"
                                        class="rounded-lg w-full md:w-fit object-cover h-48 mx-auto"
                                        src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.cover}"
                                        alt="Read {manga.title}"
                                />
                                <div class="text-center mt-2">
                                    <h3 class="text-md font-semibold tracking-tight truncate">{manga.title}</h3>
                                   <p class="leading-7">Chapters: {manga['chapters_count']}</p>
                                </div>
                            </div>
                        </Card.Root>
                    </a>
                {/each}
                {#if loadingMoreData}
                    <Card.Root class="hover:scale-105 transition-all duration-500">
                        <div class="px-2 py-2">
                            <Skeleton class="rounded-lg w-full object-cover h-48 mx-auto" />
                            <div class="text-center mt-2 space-y-2">
                                <Skeleton class="text-md w-full h-4 font-semibold tracking-tight truncate" />
                                <Skeleton class="leading-7 w-full h-4" />
                            </div>
                        </div>
                    </Card.Root>
                {/if}
                <div bind:this={mangaListDiv}></div>
            {/if}
        </div>
    </div>
    <div class="pb-2 space-y-4">
        <Card.Root>
            <Card.Header class="text-center font-bold pt-3">Trending Chapters</Card.Header>
            <Card.Content>
                <Tabs.Root value="today">
                    <Tabs.List class="grid w-full grid-cols-3">
                        <Tabs.Trigger value="halfDay">6 Hours</Tabs.Trigger>
                        <Tabs.Trigger value="today">Today</Tabs.Trigger>
                        <Tabs.Trigger value="week">This week</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="today">
                        <TopChaptersListViewCard mangaList={data.trending.topChaptersToday} />
                    </Tabs.Content>
                    <Tabs.Content value="halfDay">
                        <TopChaptersListViewCard mangaList={data.trending.topChaptersLastSixHours} />
                    </Tabs.Content>
                    <Tabs.Content value="week">
                        <TopChaptersListViewCard mangaList={data.trending.topChaptersWeekly} />
                    </Tabs.Content>
                </Tabs.Root>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header class="text-center font-bold pt-3">Trending Manga</Card.Header>
            <Card.Content>
                <Tabs.Root value="readCount">
                    <Tabs.List class="grid w-full grid-cols-2">
                        <Tabs.Trigger value="readCount">By Reads</Tabs.Trigger>
                        <Tabs.Trigger value="bookmarks">By Bookmarks</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="readCount">
                        <TopMangaListViewCard mangaList={data.trending.topMangaByViews} />
                    </Tabs.Content>
                    <Tabs.Content value="bookmarks">
                        <TopMangaListViewCard typeOfView="bookmarks" mangaList={data.trending.topMangaByBookmarks} />
                    </Tabs.Content>
                </Tabs.Root>
            </Card.Content>
        </Card.Root>
    </div>
</div>

