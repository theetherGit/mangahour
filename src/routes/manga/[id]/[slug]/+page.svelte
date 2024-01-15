<script lang="ts">
	import { MangaChapterList } from '$lib/components';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { invalidateAll } from '$app/navigation';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';
	import SvelteSeo from 'svelte-seo';
	import { onMount } from 'svelte';
	import { db } from '$lib/db';
	import {
		PieChart,
		Book,
		Eye,
		Bookmark,
		Globe2,
		StepForward,
		BookOpen,
		Star,
		Heart
	} from 'lucide-svelte';

	export let data: PageServerData;

	const currentManga = data.manga.real;
	let readHistory: any = null;
	let isFavorite: any = null;

	onMount(async () => {
		readHistory = await db.lastReadMangaChapter.get(currentManga.id.toString());
		isFavorite = await db.favouriteManga.get(currentManga.id.toString());
	});

	const firstChapter = JSON.parse(currentManga.first_chapter);

	const addToFavorites = async (e: any) => {
		e.preventDefault();
		if (isFavorite) {
			await db.favouriteManga.delete(currentManga.id.toString());
		} else {
			await db.favouriteManga.put({
				id: currentManga.id.toString(),
				image: currentManga.cover,
				name: currentManga.title,
				description: currentManga.description,
				slug: currentManga.slug,
				lastUpdated: new Date(currentManga['last_chapter_created_at'])
			});
		}
		isFavorite = await db.favouriteManga.get(currentManga.id.toString());
		await invalidateAll();
	};
</script>

<SvelteSeo
	title="Mangahour | Read {currentManga.title}"
	description={currentManga.desc}
	canonical={$page.url.href}
	keywords="{currentManga.title}, {currentManga.alt_titles
		.map((manga) => {
			return `Read ${manga.name} on mangahour`;
		})
		.join(', ')}"
	applicationName="MangaHour"
	openGraph={{
		title: `Mangahour | Read ${currentManga.title}`,
		description: `${currentManga.desc}`,
		url: `${$page.url.href}`,
		type: 'website',
		images: [
			{
				url: `${$page.url.origin}/og/manga?id=${currentManga.id}&slug=${currentManga.slug}`,
				alt: `${currentManga.title}, ${currentManga.alt_titles
					.map((manga) => {
						return `Read ${manga.name} on mangahour`;
					})
					.join(', ')}`
			}
		],
		site_name: 'MangaHour'
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@mangahour',
		title: `Mangahour | Read ${currentManga.title}`,
		description: `${currentManga.desc}`,
		image: `${$page.url.origin}/og/manga?id=${currentManga.id}&slug=${currentManga.slug}`
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: `Mangahour | Read ${currentManga.title}`,
		description: `${currentManga.desc}`,
		url: `${$page.url.href}`
	}}
/>

<section id={currentManga.title} class="pb-5">
	<div class="grid grid-cols-1 lg:grid-cols-3 space-y-4 lg:space-y-0 lg:space-x-5">
		<div class="col-span-2">
			<Card.Root>
				<Card.Content class="p-2 lg:p-6 grid grid-cols-1 md:grid-cols-3 md:space-x-4">
					<div class="w-full">
						<img
							loading="lazy"
							class="bg-auto rounded-lg mx-auto"
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
				<span>{currentManga.lang_name}</span>
			</Button>
			<Button variant="secondary" class="w-full h-12 flex items-center justify-between">
				<span class="flex items-center text-lg">
					<PieChart class="w-5 mr-2" />
					Status
				</span>
				<span>{currentManga.pubstatus[0]?.name ?? ''}</span>
			</Button>
			<Button variant="secondary" class="w-full h-12 flex items-center justify-between">
				<span class="flex items-center text-lg">
					<Book class="w-5 mr-2" />
					Chapters
				</span>
				<span
					>{new Intl.NumberFormat('en', { notation: 'compact' }).format(
						currentManga.chapters_count ?? 0
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
			{:else if firstChapter}
				<Button
					href="/manga/{currentManga.id}/{currentManga.slug}/{firstChapter?.id}/chapter-{firstChapter?.slug}"
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
	{#if currentManga?.id && currentManga.slug}
		<div class="grid grid-cols-1 lg:grid-cols-3">
			<MangaChapterList id={currentManga.id} slug={currentManga.slug} />
		</div>
	{/if}
</section>
