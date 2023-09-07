<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from "$lib/components/ui/alert";
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import {
		PieChart,
		Book,
		Eye,
		Bookmark,
		Globe2,
		StepForward,
		BookOpen,
		Star,
		Heart, Terminal
	} from 'lucide-svelte';
	import type { PageServerData } from './$types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { db } from '$lib/db';
	import { invalidateAll } from '$app/navigation';

	export let data: PageServerData;
	const currentManga = data.manga.real;
	let readHistory: any = null;
	let isFavorite: any = null;
	let alreadyReadChapters: any = null;
	onMount(async () => {
		readHistory = await db.lastReadMangaChapter.get(currentManga.id.toString());
		isFavorite = await db.favouriteManga.get(currentManga.id.toString());
		alreadyReadChapters = await db.mangaChapterReadHistory.get(currentManga.id.toString())
	});

	const firstChapter = JSON.parse(currentManga.first_chapter);

	const addToFavorites = async (e) => {
		e.preventDefault();
		if (isFavorite) {
			await db.favouriteManga.delete(currentManga.id.toString());
		} else {
			await db.favouriteManga.put({
				id: currentManga.id.toString(),
				image: currentManga.cover,
				name: currentManga.title,
				description: currentManga.description,
				slug: currentManga.slug
			});
		}
		isFavorite = await db.favouriteManga.get(currentManga.id.toString());
		await invalidateAll();
	};
</script>

<section id={currentManga.title} class="pb-5">
	<div class="grid grid-cols-1 md:grid-cols-3 space-y-4 md:space-y-0 md:space-x-5">
		<div class="col-span-2">
			<Card.Root>
				<Card.Content class="p-2 md:p-6 grid grid-cols-1 md:grid-cols-3 md:space-x-4">
					<div class="w-full">
						<img
							class="bg-auto rounded-lg"
							src="/images?type=covers&id=manga_{currentManga.id}&slug={currentManga.cover}"
							alt="Read {currentManga.title}"
						/>
					</div>
					<div class="col-span-2 px-2">
						<div class="w-full">
							<h2
								class="text-2xl xl:text-3xl capitalize font-semibold tracking-tight transition-colors mt-5 text-center border-b pb-1"
							>
								{currentManga.title}
							</h2>
							<p class="leading-7 [&:not(:first-child)]:mt-4 text-justify line-clamp-5">
								{@html currentManga.desc}
							</p>
							<div class="space-y-4">
								{#if currentManga.authors.length}
									<div class="space-y-2">
										<h2
											class="text-xl capitalize font-semibold tracking-tight transition-colors mt-5"
										>
											{currentManga.authors.length > 1 ? 'Authors' : 'Author'}
										</h2>
										{#each currentManga.authors as author}
											<Badge variant="secondary" class="mr-2 py-1.5">{author}</Badge>
										{/each}
									</div>
								{/if}
								{#if currentManga.artists.length}
									<div class="space-y-2">
										<h2
											class="text-xl capitalize font-semibold tracking-tight transition-colors mt-5"
										>
											{currentManga.artists.length > 1 ? 'Artists' : 'Artist'}
										</h2>
										{#each currentManga.artists as artist}
											<Badge variant="secondary" class="mr-2 py-1.5">{artist}</Badge>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</div>
				</Card.Content>
				<div class="grid md:grid-cols-2 p-2 px-6 md:p-6">
					<div class="space-y-2">
						<h2 class="text-xl capitalize font-semibold tracking-tight transition-colors mt-5">
							All Names
						</h2>
						{#each currentManga.alt_titles as title}
							<Badge variant="secondary" class="mr-2 py-1.5 capitalize">{title.name}</Badge>
						{/each}
					</div>
					{#if currentManga.all_genres.length}
						<div class="space-y-2">
							<h2 class="text-xl capitalize font-semibold tracking-tight transition-colors mt-5">
								All genres
							</h2>
							{#each currentManga.all_genres as genre}
								<Badge variant="secondary" class="mr-2 py-1.5">{genre.name}</Badge>
							{/each}
						</div>
					{/if}
				</div>
			</Card.Root>
		</div>
		<div class="col-span-1 space-y-4">
			<Button variant="secondary" class="w-full h-12 flex items-center justify-between">
				<span class="flex items-center text-lg">
					<Globe2 class="w-5 mr-2 " />
					Origin
				</span>
				<span>{currentManga.language.name}</span>
			</Button>
			<Button variant="secondary" class="w-full h-12 flex items-center justify-between">
				<span class="flex items-center text-lg">
					<PieChart class="w-5 mr-2" />
					Status
				</span>
				<span>{currentManga.pubstatus[0].name}</span>
			</Button>
			<Button variant="secondary" class="w-full h-12 flex items-center justify-between">
				<span class="flex items-center text-lg">
					<Book class="w-5 mr-2" />
					Chapters
				</span>
				<span
					>{new Intl.NumberFormat('en', { notation: 'compact' }).format(
						currentManga.chapters_count
					)}</span
				>
			</Button>
			<Button variant="secondary" class="w-full h-12 flex items-center justify-between">
				<span class="flex items-center text-lg">
					<Eye class="w-5 mr-2" />
					Views
				</span>
				<span
					>{new Intl.NumberFormat('en', { notation: 'compact' }).format(
						currentManga.views_count
					)}</span
				>
			</Button>
			<Button variant="secondary" class="w-full h-12 flex items-center justify-between">
				<span class="flex items-center text-lg">
					<Bookmark class="w-5 mr-2" />
					Bookmarks
				</span>
				<span
					>{new Intl.NumberFormat('en', { notation: 'compact' }).format(
						currentManga.bookmarks_count
					)}</span
				>
			</Button>
			<Button variant="secondary" class="w-full h-12 flex items-center justify-between">
				<span class="flex items-center text-lg">
					<Star class="w-5 mr-2" />
					Ratings
				</span>
				<span>{currentManga.rating}</span>
			</Button>
			<Button
				variant="secondary"
				class="flex items-center w-full h-12 {isFavorite
					? 'bg-rose-800 hover:bg-rose-200 hover:text-rose-800 ease-in-out'
					: ''}"
				on:click={(e) => {
					addToFavorites(e);
				}}
			>
				<span class="flex items-center text-lg">
					<Heart class="w-5 mr-2" />
					{isFavorite ? 'Remove' : 'Mark as'} Favorites
				</span>
			</Button>
			{#if readHistory}
				<Button
					href="/manga/{readHistory.id}/{readHistory.mangaSlug}/{readHistory.chapterId}/chapter-{readHistory.chapterSlug}"
					variant="secondary"
					class="w-full h-12 flex items-center"
				>
					<span class="flex items-center text-lg">
						<StepForward class="w-5 mr-2" /> Continue Reading
					</span>
				</Button>
			{:else}
				<Button
					href="/manga/{currentManga.id}/{currentManga.slug}/{firstChapter.id}/chapter-{firstChapter.slug}"
					variant="secondary"
					class="w-full h-12 flex items-center"
				>
					<span class="flex items-center text-lg">
						<BookOpen class="w-5 mr-2" />
						Start Reading
					</span>
				</Button>
			{/if}
		</div>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-3">
		<Card.Root class="mt-5 col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title class="text-center">
					Chapter List
				</Card.Title>
			</Card.Header>
			<Card.Content>
					{#await data.streamed.chapters}
						<p class="text-center font-bold">
							Loading....
						</p>
					{:then chapters}
						<Input type="text" placeholder="Search chapter..." class="mb-2"/>
						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-96 gap-4
							overflow-y-scroll px-2 py-4 scrollbar-thin scrollbar-thumb-primary
							scrollbar-track-accent
							">
							{#each chapters as chapter}
								{@const alreadyRead = alreadyReadChapters?.chapters.includes(chapter.id.toString())}
								<Button href="/manga/{currentManga.id}/{currentManga.slug}/{chapter.id}/chapter-{chapter.slug}" variant="{alreadyRead ? 'secondary' : 'default'}">Chapter {chapter.chapter_number}</Button>
							{/each}
						</div>
					{:catch error}
						<Alert.Root>
							<Terminal class="h-4 w-4" />
							<Alert.Title>Unable to load chapters.</Alert.Title>
							<Alert.Description>
								We are unable to fulfill your request for chapters. Please refresh right now.
							</Alert.Description>
						</Alert.Root>
						Copy

					{/await}
			</Card.Content>
		</Card.Root>
	</div>

<!--	<div>-->
<!--		{#await data.streamed.chapters}-->
<!--			loading-->
<!--		{:then value}-->
<!--			{#each value as chap}-->
<!--				{chap.slug}<br />-->
<!--			{/each}-->
<!--		{:catch error}-->
<!--			{error.message}-->
<!--		{/await}-->
<!--	</div>-->
</section>

<style>

</style>
