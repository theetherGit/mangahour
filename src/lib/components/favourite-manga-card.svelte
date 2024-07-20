<script lang="ts">
	import { create, insertMultiple, search } from '@orama/orama';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { fade, fly, slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Heart, Loader } from 'lucide-svelte';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';
	import { db } from '$lib/db';
	import { isFavouriteMangaUpdateCheckInProgress } from '$lib/utils';

	let favouriteMangaSearchDB: any = null;
	let favouriteUpdateChecker: Worker;

	let favouriteManga = liveQuery(async () => {
		return db.favouriteManga.orderBy('lastUpdated').reverse().toArray();
	});

	onMount(async () => {
		const lastFavCheckTimeStamp = localStorage.getItem('last_fav_check_timestamp')
		if (lastFavCheckTimeStamp === null || (parseInt(lastFavCheckTimeStamp as string) + 180000) < Date.now()) {
			const favouriteUpdateCheckerWorker = (await import('$lib/workers/favoriteUpdateChecker?worker'))
				.default;

			favouriteUpdateChecker = new favouriteUpdateCheckerWorker();
			favouriteUpdateChecker.postMessage({});
			favouriteUpdateChecker.onmessage = (e: any) => {
				const { type, payload } = e.data;
				switch (type) {
					case 'status':
						isFavouriteMangaUpdateCheckInProgress.set(payload);
						break;
					case 'last_fav_check_timestamp':
						localStorage.setItem('last_fav_check_timestamp', Date.now().toString())
						break;
				}
			};
		}

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

<div id="favouriteMangaPage" class="space-y-4">
	{#if $isFavouriteMangaUpdateCheckInProgress}
		<div transition:slide >
			<Alert.Root class="text-rose-50 border-rose-400">
				<Loader class="h-4 w-4 animate-spin" color="rgb(255 241 242 / var(--tw-text-opacity))"/>
				<Alert.Title>Heads up!</Alert.Title>
				<Alert.Description>We are updating recently updated mangas.</Alert.Description>
			</Alert.Root>
		</div>
	{/if}
	<Input
		on:input={async (e) => {
			await searchFavManga(e?.target?.value);
		}}
		placeholder="Search from favorites.."
	/>
	{#if mangaInView && mangaInView.length}
		<div class="grid lg:grid-cols-2 2xl:grid-cols-4 mt-3 gap-4">
			{#each mangaInView as manga}
				<div in:fly out:fade>
					<Card.Root class="h-full">
						<div class="grid grid-cols-10 px-4 py-2 gap-x-2.5">
							<div class="col-span-4 md:col-span-2 lg:col-span-4 m-auto">
								<img
									class="rounded-lg w-32 h-44 md:h-36"
									src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.image}"
									alt="Read {manga.name} on Mangahour"
								/>
							</div>
							<div class="col-span-6 md:col-span-8 lg:col-span-6">
								<Button
									variant="ghost"
									class="w-full h-auto text-left"
									href="/manga/{manga.id}/{manga.slug}"
									on:click={async () => {
										await goto(`/manga/${manga.id}/${manga.slug}`);
									}}
								>
									<h2 class="text-lg font-semibold text-left tracking-tight line-clamp-2">{manga.name}</h2>
								</Button>
								<div class="pt-4 space-y-2">
									<Button
										variant="outline"
										class="w-full flex space-x-2 items-center justify-between"
									>
										Updated <spane>{formatDistanceToNowStrict(manga.lastUpdated)}</spane>
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
		</div>
	{:else}
		<Alert.Root class="mt-5 text-rose-500 border-rose-500">
			<Heart class="h-4 w-4" color="rgb(244 63 94)" />
			<Alert.Title>No Favourite Manga</Alert.Title>
			<Alert.Description>Read some & add some in favourites on mangahour.</Alert.Description>
		</Alert.Root>
	{/if}
</div>
