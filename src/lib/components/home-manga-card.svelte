<script lang="ts">
	import { formatDistanceToNowStrict } from 'date-fns';
	import { Button } from '$lib//components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Clock3, Heart } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let manga: any;
	export let newChapters: any;
	export let haveReadHistory: any;
	export let isFavorite: any;

	let favMangaWorker: Worker;

	onMount(async () => {
		const FavMangaDBWorker = (await import('$lib/workers/favouriteManga?worker')).default;
		favMangaWorker = new FavMangaDBWorker();

		favMangaWorker.onmessage = (e: any) => {
			const { type, payload } = e.data;
			if (type === 'get') {
				isFavorite = payload.manga;
			}
		};
	});

	$: mainBorder = isFavorite ? 'border-rose-800' : haveReadHistory ? 'border-green-500' : '';

	const addToFavorites = async (e: any) => {
		e.preventDefault();
		if (isFavorite) {
			favMangaWorker.postMessage({
				type: 'delete',
				payload: {
					id: manga.id.toString()
				}
			});
		} else {
			favMangaWorker.postMessage({
				type: 'put',
				payload: {
					id: manga.id.toString(),
					image: manga.cover,
					name: manga.title,
					description: manga.description,
					slug: manga.slug,
					lastUpdated: new Date(manga['last_chapter_created_at'])
				}
			});
		}
		favMangaWorker.postMessage({
			type: 'get',
			payload: {
				id: manga.id.toString()
			}
		});
	};
</script>

{#if newChapters?.chapters}
	<div class="group" transition:slide={{ axis: 'y' }}>
	<Card.Root class="group-hover:scale-105 transition-all duration-300 {mainBorder}">
		<Card.Content class="py-3 px-2.5">
			<div class="grid grid-cols-3 gap-x-2">
				<div class="col-span-1 relative">
					{#if manga.is_new}
						<div class="absolute right-1">
							<Badge class="bg-green-700/80 text-foreground group-hover:bg-green-500">New</Badge>
						</div>
					{/if}
					<img
						loading="lazy"
						class="rounded-lg w-[122px] h-[173px]"
						src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.cover}"
						alt="Read {manga.title}"
					/>
				</div>
				<div class="col-span-2">
					<a href="/manga/{manga.id}/{manga.slug}">
						<div class="flex items-center gap-x-1 pb-1 border-b">
							<h3 class="text-lg font-semibold tracking-tight truncate">{manga.title}</h3>
						</div>
					</a>
					<div class="mt-2 space-y-2">
						<a
							href="/manga/{manga.id}/{manga.slug}/{newChapters.chapters[0].id}/chapter-{newChapters
								.chapters[0].slug}"
						>
							<Card.Root>
								<Card.Content class="px-2.5 py-1">
									<div class="flex items-center justify-between">
										<p>Chapter {newChapters.chapters[0].chapter_number}</p>
										<p>New</p>
									</div>
								</Card.Content>
							</Card.Root>
						</a>
						<Button
							variant="secondary"
							class="flex items-center gap-x-1 w-full {isFavorite
								? 'bg-rose-800 hover:bg-rose-200 hover:text-rose-800 ease-in-out'
								: ''}"
							on:click={(e) => {
								addToFavorites(e);
							}}
						>
							<Heart class="h-4" />
							{isFavorite ? 'Your' : 'Add to'} Favorites
						</Button>
						<Button
							variant="secondary"
							class="w-full"
							href={haveReadHistory
								? `/manga/${manga.id}/${manga.slug}/${haveReadHistory.chapterId}/${haveReadHistory.chapterSlug}`
								: `/manga/${manga.id}/${manga.slug}`}
						>
							{haveReadHistory ? 'Continue' : 'Start Reading'}
							{haveReadHistory ? `Chapter ${haveReadHistory.chapterNumber}` : ''}
						</Button>
					</div>
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="px-2.5 flex items-center justify-between border-t py-1.5">
			<p class="text-lg tracking-tight">Update</p>
			<div class="flex items-center gap-x-2">
				<Clock3 class="h-4 w-4" />
				<span class="capitalize"
					>{formatDistanceToNowStrict(new Date(manga['last_chapter_created_at']))}</span
				>
			</div>
			<div class="italic">
				{newChapters.count}
				{newChapters.count > 1 ? 'Chapters' : 'Chapter'}
			</div>
		</Card.Footer>
	</Card.Root>
</div>
{/if}