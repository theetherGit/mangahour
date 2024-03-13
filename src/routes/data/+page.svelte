<script lang="ts">
	import LastReadChapterDBWorker from '$lib/workers/lastReadMangaChapter?worker';
	import * as Alert from '$lib/components/ui/alert';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { fade, fly } from 'svelte/transition';
	import { BookPlus, Heart } from 'lucide-svelte';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';
	import { db } from '$lib/db';
	import { goto } from '$app/navigation';

	let lastReadChapterWorker: Worker;
	let userReadHistory: Map<string, any>;

	onMount(async () => {
		lastReadChapterWorker = new LastReadChapterDBWorker();

		lastReadChapterWorker.postMessage({
			type: 'bulk',
			payload: {}
		});

		lastReadChapterWorker.onmessage = (e: any) => {
			const { type, payload } = e.data;
			if (type === 'bulk') {
				userReadHistory = payload;
			}
		};
	});

	const favouriteMangas = liveQuery(async () => {
		return db.favouriteManga.orderBy('lastUpdated').reverse().toArray();
	});

	const mangaReadHistory = liveQuery(async () => {
		return db.mangaChapterReadHistory.toArray();
	});

	function slugToTitle(slug: string) {
		return slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	async function deleteAllReadHistory() {
		if ($mangaReadHistory && $mangaReadHistory.length) {
			for (const manga of $mangaReadHistory) {
				deleteReadHistorySingle(manga.id);
			}
		}
	}

	async function deleteReadHistorySingle(id: any) {
		await db.lastReadMangaChapter.delete(id);
		await db.mangaChapterReadHistory.delete(id);
	}

	async function deleteAllFavourites() {
		if ($favouriteMangas && $favouriteMangas.length) {
			for (const manga of $favouriteMangas) {
				removeFavorite(manga.id);
			}
		}
	}

	async function removeFavorite(id: any) {
		await db.favouriteManga.delete(id);
	}
</script>

<section class="mb-5">
	<div class="grid md:grid-cols-3 gap-5">
		<div class="md:col-span-2">
			<div class="flex items-center justify-between">
				<h2 class="text-xl md:text-3xl font-semibold tracking-tight transition-colors">
					Manga Read History
				</h2>
				<Button
					on:click={() => {
						deleteAllReadHistory();
					}}
					variant="destructive"
					size="sm">Delete All</Button
				>
			</div>
			{#if $mangaReadHistory && $mangaReadHistory.length && userReadHistory}
				<div class="grid gap-5 mt-5">
					{#each $mangaReadHistory as manga}
						{@const lastReadChapter = userReadHistory.get(manga.id.toString())}
						<Card.Root class="p-4">
							<div class="flex items-center justify-between">
								<h3 class="md:text-xl font-semibold tracking-tight">
									{slugToTitle(lastReadChapter?.mangaSlug)}
								</h3>
								<Button
									on:click={() => {
										deleteReadHistorySingle(manga.id);
									}}
									variant="destructive"
									size="sm">Delete History</Button
								>
							</div>
							<Card.Root class="mt-2 p-2 border-none">
								<h3 class="md:text-xl font-semibold tracking-tight flex justify-between">
									Last Read Chapter <span>{lastReadChapter.chapterNumber}</span>
								</h3>
							</Card.Root>
							<Card.Root class="mt-2 p-2 border-none">
								<h3 class="md:text-xl font-semibold tracking-tight flex justify-between">
									Total Read Chapters <span>{manga.chapters.length}</span>
								</h3>
							</Card.Root>
						</Card.Root>
					{/each}
				</div>
			{:else}
				<Alert.Root class="mt-5">
					<BookPlus class="h-4 w-4" />
					<Alert.Title>No Read History</Alert.Title>
					<Alert.Description>Read some manga on mangahour and check back.</Alert.Description>
				</Alert.Root>
			{/if}
		</div>
		<Card.Root class="p-4">
			<div class="grid gap-y-4">
				<div class="flex items-center justify-between">
					<h2 class="text-xl md:text-3xl font-semibold tracking-tight transition-colors">
						Favourite Manga
					</h2>
					<Button
						on:click={() => {
							deleteAllFavourites();
						}}
						variant="destructive"
						size="sm">Remove All</Button
					>
				</div>
				{#if $favouriteMangas && $favouriteMangas.length}
					{#each $favouriteMangas as manga}
						<div in:fly out:fade>
							<Card.Root class="p-1">
								<div class="grid grid-cols-4 gap-x-2">
									<div class="col-span-1">
										<img
											class="rounded-lg"
											src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.image}"
											alt="Read {manga.name} on Manga Hour"
										/>
									</div>
									<div class="col-span-3">
										<Button
											class="w-full"
											variant="ghost"
											href="/manga/{manga.id}/{manga.slug}"
											on:click={async () => {
												await goto(`/manga/${manga.id}/${manga.slug}`);
											}}
										>
											<h2 class="text-lg font-semibold tracking-tight truncate">{manga.name}</h2>
										</Button>
										<div class="pt-4 space-y-2">
											<!--                                        <Button-->
											<!--                                                variant="outline"-->
											<!--                                                class="w-full flex space-x-2 items-center justify-between"-->
											<!--                                        >-->
											<!--                                            Last Updated <spane>{formatDistanceToNowStrict(manga.lastUpdated)}</spane>-->
											<!--                                        </Button>-->
											<Button
												variant="destructive"
												class="w-full"
												on:click={async () => {
													await removeFavorite(manga.id);
												}}>Remove from Favorites</Button
											>
										</div>
									</div>
								</div>
							</Card.Root>
						</div>
					{/each}
				{:else}
					<Alert.Root class="mt-5 text-rose-500 border-rose-500">
						<Heart class="h-4 w-4" color="rgb(244 63 94)" />
						<Alert.Title>No Favourite Manga</Alert.Title>
						<Alert.Description>Read some & add some in favourites on mangahour.</Alert.Description>
					</Alert.Root>
				{/if}
			</div>
		</Card.Root>
	</div>
</section>
