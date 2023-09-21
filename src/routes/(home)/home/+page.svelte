<script lang="ts">
	import LastReadChapterDBWorker from '$lib/workers/lastReadMangaChapter?worker';
	import { ArrowDownToLine, Loader, ShieldCheck } from 'lucide-svelte';
	import FavMangaDBWorker from '$lib/workers/favouriteManga?worker';
	import { HomePageMangaViewCard } from '$lib/components';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { PageServerData } from './$types';
	import SvelteSeo from 'svelte-seo';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data: PageServerData;

	let favMangaWorker: Worker;
	let lastReadChapterWorker: Worker;
	let favMangas: Map<string, any>;
	let userReadHistory: Map<string, any>;

	let loadingMoreLatestManga = false;

	let currentMangaList = data.latest.slice(0, 30);
	let remainingMangaList = data.latest.slice(30);

	onMount(async () => {
		favMangaWorker = new FavMangaDBWorker();
		lastReadChapterWorker = new LastReadChapterDBWorker();

		favMangaWorker.postMessage({
			type: 'bulk',
			payload: {}
		});

		lastReadChapterWorker.postMessage({
			type: 'bulk',
			payload: {}
		});

		favMangaWorker.onmessage = (e: any) => {
			const { type, payload } = e.data;
			if (type === 'bulk') {
				favMangas = payload;
			}
		};

		lastReadChapterWorker.onmessage = (e: any) => {
			const { type, payload } = e.data;
			if (type === 'bulk') {
				userReadHistory = payload;
			}
		};
	});

	const loadMoreLatestManga = async () => {
		loadingMoreLatestManga = true;
		if (currentMangaList.length < 40) {
			const moreMangaResponse = await fetch('/show-more?page=2');
			if (moreMangaResponse.ok) {
				const moreMangaResponseJson = await moreMangaResponse.json();
				remainingMangaList = [...remainingMangaList, ...moreMangaResponseJson.data];
			}
		}
		if (remainingMangaList !== 0) {
			currentMangaList = [...currentMangaList, ...remainingMangaList.slice(0, 30)];
			remainingMangaList = remainingMangaList.slice(30);
		}
		loadingMoreLatestManga = false;
	};
</script>

<SvelteSeo
	title="Mangahour | Home"
	description="Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas."
	canonical={$page.url.href}
	keywords="Read Manga on Mangahour, mangahour home, mangahour latest mangas"
	applicationName="MangaHour"
	openGraph={{
		title: 'Mangahour | Home',
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
		title: 'Mangahour | Home',
		description:
			'Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas.',
		image: `${$page.url.origin}/og/home`
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Mangahour | Home',
		description:
			'Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas.',
		url: `${$page.url.href}`
	}}
/>

<Tabs.Content value="home" class="space-y-4">
	<section id="main">
		{#if currentMangaList}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
				{#each currentMangaList as manga}
					{@const newChapters = JSON.parse(manga['new_chapters'])}
					{@const isFavorite = favMangas ? favMangas.get(manga['id'].toString()) : false}
					{@const haveReadHistory = userReadHistory
						? userReadHistory.get(manga['id'].toString())
						: false}
					<HomePageMangaViewCard {haveReadHistory} {isFavorite} {manga} {newChapters} />
				{/each}
			</div>
		{/if}
		<Button
			class="w-full flex items-center space-x-2"
			disabled={remainingMangaList.length === 0}
			on:click={() => {
				loadMoreLatestManga();
			}}
		>
			{#if loadingMoreLatestManga}
				<Loader class="w-4 mr-2 animate-spin" />
			{:else if remainingMangaList.length === 0}
				<ShieldCheck class="w-4 mr-2 text-red-950" />
			{:else}
				<ArrowDownToLine class="w-4 mr-2" />
			{/if}
			{remainingMangaList.length === 0 ? 'The End' : 'Load More'}
		</Button>
	</section>
</Tabs.Content>
