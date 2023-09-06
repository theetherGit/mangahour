<script lang="ts">
	import { Squirrel, ArrowDownToLine, Loader, ShieldCheck } from 'lucide-svelte';
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import {
		HomePageMangaViewCard,
		TopChaptersListViewCard,
		TopMangaListViewCard
	} from '$lib/components';

	export let data: PageServerData;
	let loadingMoreLatestManga = false;

	let latestMangaList = data.home.latest;
	let currentMangaList = latestMangaList.slice(0, 30);
	let remainingMangaList = latestMangaList.slice(30);

	const loadMoreLatestManga = async () => {
		loadingMoreLatestManga = true;
		if (latestMangaList.length < 150) {
			const moreMangaResponse = await fetch('/show-more?page=2');
			if (moreMangaResponse.ok) {
				const moreMangaResponseJson = await moreMangaResponse.json();
				latestMangaList = [...latestMangaList, ...moreMangaResponseJson.data];
			}
		}
		if (remainingMangaList !== 0) {
			currentMangaList = [
				...currentMangaList,
				...latestMangaList.slice(currentMangaList.length, currentMangaList.length + 30)
			];
			remainingMangaList = latestMangaList.slice(currentMangaList.length);
		}
		loadingMoreLatestManga = false;
	};
</script>

<section id="main">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 relative">
		<div class="col-span-3 md:col-span-2 space-y-4 pb-4">
			<Input type="search" placeholder="Search Manga..." />
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="flex items-center justify-between border-b pb-2">
							<div class="flex items-center gap-2 text-primary">
								<Squirrel class="text-primary" />
								<h2>Latest Updates</h2>
							</div>
							<div>
								<Button
									size="sm"
									class="h-min px-2 py-1 text-foreground bg-primary hover:bg-accent hover:text-foreground transition-all duration-500 ease-in-out"
								>
									View All
								</Button>
							</div>
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					{#if currentMangaList}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
							{#each currentMangaList as manga}
								{@const newChapters = JSON.parse(manga['new_chapters'])}
								<HomePageMangaViewCard {manga} {newChapters} />
							{/each}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
			<Button
				class="w-full flex items-center space-x-2"
				disabled={currentMangaList.length === latestMangaList.length}
				on:click={() => {
					loadMoreLatestManga();
				}}
			>
				{#if loadingMoreLatestManga}
					<Loader class="w-4 mr-2 animate-spin" />
				{:else if currentMangaList.length === latestMangaList.length}
					<ShieldCheck class="w-4 mr-2 text-red-950" />
				{:else}
					<ArrowDownToLine class="w-4 mr-2" />
				{/if}
				{currentMangaList.length === latestMangaList.length ? 'The End' : 'Load More'}
			</Button>
		</div>
		<div class="pb-2 space-y-4">
			<Card.Root>
				<Card.Header class="text-center font-bold pt-3">Popular Manga Chapters</Card.Header>
				<Card.Content>
					<Tabs.Root value="today">
						<Tabs.List class="grid w-full grid-cols-3">
							<Tabs.Trigger value="halfDay">6 Hours</Tabs.Trigger>
							<Tabs.Trigger value="today">Today</Tabs.Trigger>
							<Tabs.Trigger value="week">This week</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="today">
							<TopChaptersListViewCard mangaList={data.home.topChaptersToday} />
						</Tabs.Content>
						<Tabs.Content value="halfDay">
							<TopChaptersListViewCard mangaList={data.home.topChaptersLastSixHours} />
						</Tabs.Content>
						<Tabs.Content value="week">
							<TopChaptersListViewCard mangaList={data.home.topChaptersWeekly} />
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="text-center font-bold pt-3">Popular Manga</Card.Header>
				<Card.Content>
					<Tabs.Root value="readCount">
						<Tabs.List class="grid w-full grid-cols-2">
							<Tabs.Trigger value="readCount">By Reads</Tabs.Trigger>
							<Tabs.Trigger value="bookmarks">By Bookmarks</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="readCount">
							<TopMangaListViewCard mangaList={data.home.topMangaByViews} />
						</Tabs.Content>
						<Tabs.Content value="bookmarks">
							<TopMangaListViewCard
								typeOfView="bookmarks"
								mangaList={data.home.topMangaByBookmarks}
							/>
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</section>
