<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { liveQuery } from 'dexie';
	import { db } from '$lib/db';
	import { onMount } from 'svelte';
	import favouriteUpdateCheckerWorker from '$lib/workers/favoriteUpdateChecker?worker';
	import { create, insertMultiple, search } from '@orama/orama';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { fade, fly } from 'svelte/transition';

	let favouriteMangaSearchDB: any = null;
	let favouriteUpdateChecker: Worker;

	let favouriteManga = liveQuery(async () => {
		return db.favouriteManga.orderBy('lastUpdated').reverse().toArray();
	});

	onMount(async () => {
		favouriteUpdateChecker = new favouriteUpdateCheckerWorker();
		favouriteUpdateChecker.postMessage({});
		favouriteMangaSearchDB = await create({
			schema: {
				name: 'string'
			},
			components: {}
		});
	});

	$: if (
		browser &&
		$favouriteManga &&
		$favouriteManga.length &&
		favouriteMangaSearchDB &&
		favouriteMangaSearchDB.data.docs.count === 0
	) {
		insertMultiple(favouriteMangaSearchDB, $favouriteManga, $favouriteManga.length).then();
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
		await db.favouriteManga.delete(id);
	}
</script>

<div id="favouriteMangaPage">
	<Input
		on:input={async (e) => {
			await searchFavManga(e?.target?.value);
		}}
		placeholder="Search from favorites.."
	/>
	<div class="grid md:grid-cols-2 mt-3 gap-4">
		{#if mangaInView && mangaInView.length}
			{#each mangaInView as manga}
				<div in:fly out:fade>
					<Card.Root>
						<div class="grid grid-cols-3 px-4 py-2 gap-x-2.5">
							<div class="col-span-1">
								<img
									class="rounded-lg"
									src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.image}"
									alt="Read {manga.name} on Manga Hour"
								/>
							</div>
							<div class="col-span-2">
								<Button
									variant="ghost"
									class="w-full text-center"
									href="/manga/{manga.id}/{manga.slug}"
									on:click={async () => {
										await goto(`/manga/${manga.id}/${manga.slug}`);
									}}
								>
									<h2 class="text-lg font-semibold tracking-tight">{manga.name}</h2>
								</Button>
								<div class="pt-4 space-y-2">
									<Button
										variant="outline"
										class="w-full flex space-x-2 items-center justify-between"
									>
										Last Updated <spane>{formatDistanceToNowStrict(manga.lastUpdated)}</spane>
									</Button>
									<Button
										variant="destructive"
										class="w-full"
										on:click={async () => {
											await removeFavorite(manga.id);
										}}
										>Remove from Favorites
									</Button>
								</div>
							</div>
						</div>
					</Card.Root>
				</div>
			{/each}
		{/if}
	</div>
</div>
