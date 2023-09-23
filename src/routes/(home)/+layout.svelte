<script lang="ts">
	import { MangaSearch, TopChaptersListViewCard, TopMangaListViewCard } from '$lib/components';
	import LastReadChapterDBWorker from '$lib/workers/lastReadMangaChapter?worker';
	import FavMangaDBWorker from '$lib/workers/favouriteManga?worker';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import type { LayoutServerData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { AlertTriangle } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import SvelteSeo from 'svelte-seo';
	import { onMount } from 'svelte';

	export let data: LayoutServerData;

	let favMangaWorker: Worker;
	let lastReadChapterWorker: Worker;

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
	});

	let path: string;

	$: path = $page.url.pathname.split('/').pop() as string;
	const tabList = [
		{ name: 'home', value: `Latest Updated` },
		{ name: 'favourite', value: `Favourites` }
	];
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

<section id="main">
	<Alert.Root class="mb-5 text-amber-600 border-amber-500">
		<AlertTriangle class="h-4 w-4" color="rgb(217 119 6)" />
		<Alert.Title>Work in Progress</Alert.Title>
		<Alert.Description>
			MangaHour currently work in progress, if you find any issues please let use know by mail <a
				href="mailto:contact@mangahour.com"
				class="italic">contact@mangahour.com</a
			>
		</Alert.Description>
	</Alert.Root>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 relative">
		<div class="col-span-3 md:col-span-2 space-y-4 pb-4">
			<MangaSearch />
			<Card.Root>
				<Tabs.Root value={path} class="space-y-4">
					<Card.Header>
						<Card.Title>
							<Tabs.List class="grid grid-cols-2 gap-4 p-0">
								{#each tabList as tab}
									<Tabs.Trigger value={tab.name} asChild>
										<Button
											class=" {tab.name === 'favourite' ? 'text-rose-500' : ''} {path === tab.name
												? tab.name === 'favourite'
													? 'bg-rose-500 text-rose-100 hover:bg-rose-500 hover:text-rose-100 border-rose-500'
													: ''
												: ''}"
											variant={path === tab.name ? 'default' : 'ghost'}
											href="/{tab.name}"
										>
											{tab.value}
										</Button>
									</Tabs.Trigger>
								{/each}
							</Tabs.List>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						{#key path}
							<div in:fade={{ delay: 400 }} out:fly={{ duration: 300 }}>
								<slot />
							</div>
						{/key}
					</Card.Content>
				</Tabs.Root>
			</Card.Root>
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
							<TopChaptersListViewCard mangaList={data.topChaptersToday} />
						</Tabs.Content>
						<Tabs.Content value="halfDay">
							<TopChaptersListViewCard mangaList={data.topChaptersLastSixHours} />
						</Tabs.Content>
						<Tabs.Content value="week">
							<TopChaptersListViewCard mangaList={data.topChaptersWeekly} />
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
							<TopMangaListViewCard mangaList={data.topMangaByViews} />
						</Tabs.Content>
						<Tabs.Content value="bookmarks">
							<TopMangaListViewCard typeOfView="bookmarks" mangaList={data.topMangaByBookmarks} />
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</section>
