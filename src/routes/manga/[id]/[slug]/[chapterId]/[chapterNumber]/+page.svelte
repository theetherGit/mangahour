<script lang="ts">
	import { ArrowLeft, ArrowRight, Heart } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChapterDropDown } from '$lib/components';
	import * as Card from '$lib/components/ui/card';
	import { invalidateAll } from '$app/navigation';
	import type { PageServerData } from './$types';
	import { slide, fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import SvelteSeo from 'svelte-seo';
	import { onMount } from 'svelte';
	import { db } from '$lib/db';

	export let data: PageServerData;
	$: chapter = data.chapter;
	let chapters: Array<Record<string, any>> = [];
	let isFavorite: any = null;

	onMount(async () => {
		chapters = await data.streamed.chapters
		isFavorite = await db.favouriteManga.get(data.params.id.toString());

		const chapterReadHistory = await db.mangaChapterReadHistory.get(data.params.id.toString());

		if (chapterReadHistory && !chapterReadHistory.chapters.includes(chapter.id.toString())) {
			db.mangaChapterReadHistory.put({
				id: data.params.id.toString(),
				chapters: [...chapterReadHistory.chapters, data.params.chapterId.toString()]
			});
		} else {
			db.mangaChapterReadHistory.put({
				id: data.params.id.toString(),
				chapters: [data.params.chapterId.toString()]
			});
		}

		db.lastReadMangaChapter.put({
			id: data.params.id,
			mangaSlug: data.params.slug,
			chapterId: data.params.chapterId,
			chapterSlug: data.params.chapterNumber,
			chapterNumber: data.chapter.chapter_number.toString()
		});
	});

	const addToFavorites = async (e: any) => {
		e.preventDefault();
		if (isFavorite) {
			await db.favouriteManga.delete(data.params.id.toString());
		} else {
			await db.favouriteManga.put({
				id: data.params.id.toString(),
				image: chapter.manga_cover,
				name: chapter.manga_title,
				description: '',
				slug: chapter.manga_slug,
				lastUpdated: new Date()
			});
		}
		isFavorite = await db.favouriteManga.get(data.params.id.toString());
		await invalidateAll();
	};
</script>

<SvelteSeo
	title="Mangahour | {chapter.manga_title} | Chapter {chapter.chapter_number}"
	description="Reading {chapter.manga_title} - Chapter {chapter.chapter_number}"
	canonical={$page.url.href}
	keywords="Read {chapter.manga_title} - {chapter.chapter_number}, Reading {chapter.manga_title} - {chapter.chapter_number}"
	applicationName="MangaHour"
	openGraph={{
		title: `Mangahour | Reading ${chapter.manga_title} | Chapter ${chapter.chapter_number}`,
		description: `Reding ${chapter.manga_title} - ${chapter.chapter_number}`,
		url: `${$page.url.href}`,
		type: 'website',
		images: [
			{
				url: `${$page.url.origin}/og/chapter?mangaId=${data.params.id}&mangaSlug=${data.params.slug}&id=${data.params.chapterId}&slug=${data.params.chapterNumber}`,
				alt: `Reding ${chapter.manga_title} - ${chapter.chapter_number}`
			}
		],
		site_name: 'MangaHour'
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@mangahour',
		title: `Mangahour | Reading ${chapter.manga_title}'s chapter ${chapter.chapter_number}`,
		description: `Reding ${chapter.manga_title} - ${chapter.chapter_number}`,
		image: `${$page.url.origin}/og/chapter?mangaId=${data.params.id}&mangaSlug=${data.params.slug}&id=${data.params.chapterId}&slug=${data.params.chapterNumber}`
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: `Mangahour | Reading ${chapter.manga_title}'s chapter ${chapter.chapter_number}`,
		description: `Reding ${chapter.manga_title} - ${chapter.chapter_number}`,
		url: `${$page.url.href}`
	}}
/>

{#if chapter}
	<div class="grid lg:grid-cols-4 py-4 justify-items-center">
		<div class="lg:col-span-3">
			<div class="mb-5">
				{#if chapters.length}
					<div class="pb-4 md:pb-0" transition:slide={{ axis: 'y', duration: 500 }}>
						<Card.Root class="lg:hidden">
							<Card.Header class="py-2.5 px-2.5">
								<div class="grid grid-cols-4">
									<div class="col-span-1 md:w-1/3 lg:w-1/2">
										<img
											class="rounded-lg"
											loading="lazy"
											src="/images?type=covers_optimized_home_main&id=manga_{chapter.manga_id}&slug={chapter.manga_cover}"
											alt="Read {chapter.manga_title}"
										/>
									</div>
									<div class="col-span-3 px-2.5 space-y-2">
										<a href="/manga/{data.params.id}/{data.params.slug}">
											<h2
												class="text-center text-primary pb-2 truncate text-xl lg:text-3xl font-semibold tracking-tight transition-colors"
											>
												{chapter.manga_title}
											</h2>
										</a>
										{#if chapters.length}
											<Button variant="outline" class="w-full flex items-center justify-between">
												Total Chapters
												<span>{chapters.length}</span>
											</Button>
										{/if}
										<Button
											variant="outline"
											class="flex items-center w-full {isFavorite
												? 'border-rose-500 hover:bg-rose-100 hover:text-rose-500 ease-in-out'
												: ''}"
											on:click={(e) => {
												addToFavorites(e);
											}}
										>
											<span class="flex items-center {isFavorite ? 'text-rose-500' : ''}">
												<Heart class="w-5 mr-2" />
												{isFavorite ? 'Remove' : 'Mark as'} Favorites
											</span>
										</Button>
									</div>
								</div>
							</Card.Header>
						</Card.Root>
					</div>
				{/if}

				<div class="flex items-center justify-between mx-2 gap-x-3 min-w-full">
					{#if data.prevChapter !== null}
						<Button
							href="/manga/{data.params?.id}/{data.params?.slug}/{data.prevChapter?.id}/chapter-{data.prevChapter?.slug}"
							variant="secondary"><ArrowLeft class="w-4 mr-2" /> Previous</Button
						>
					{:else}
						<Button disabled={data.prevChapter === null} variant="outline"
							><ArrowLeft class="w-4 mr-2" /> Previous</Button
						>
					{/if}
					<ChapterDropDown
						{chapters}
						id={data.params.id}
						slug={data.params?.slug}
						currentChapter={chapter.chapter_number}
					/>
					{#if data.nextChapter !== null}
						<Button
							href="/manga/{data.params?.id}/{data.params?.slug}/{data.nextChapter?.id}/chapter-{data.nextChapter?.slug}"
							variant="secondary">Next <ArrowRight class="w-4 ml-2" /></Button
						>
					{:else}
						<Button disabled={data.nextChapter === null} variant="outline"
							>Next <ArrowRight class="w-4 ml-2" /></Button
						>
					{/if}
				</div>
			</div>
			<div class="px-1 w-full place-self-center">
				{#each chapter.images as image, i}
					<img
						loading="lazy"
						class="first:rounded-t-lg last:rounded-b-lg self-center mx-auto"
						src="/images/chapter?type=manga&id=manga_{chapter.manga_id}/chapter_{chapter.slug}&slug={image}"
						alt="Read {chapter.manga_title}'s page {i}"
					/>
				{/each}
			</div>
			<div class="flex items-center justify-between mx-2 gap-x-3 mt-5 w-full">
				{#if data.prevChapter !== null}
					<Button
						href="/manga/{data.params?.id}/{data.params?.slug}/{data.prevChapter?.id}/chapter-{data.prevChapter?.slug}"
						variant="secondary"><ArrowLeft class="w-4 mr-2" /> Previous</Button
					>
				{:else}
					<Button disabled={data.prevChapter === null} variant="outline"
						><ArrowLeft class="w-4 mr-2" /> Previous</Button
					>
				{/if}
				{#if data.nextChapter !== null}
					<Button
						href="/manga/{data.params?.id}/{data.params?.slug}/{data.nextChapter?.id}/chapter-{data.nextChapter?.slug}"
						variant="secondary">Next <ArrowRight class="w-4 ml-2" /></Button
					>
				{:else}
					<Button disabled={data.nextChapter === null} variant="outline"
						>Next <ArrowRight class="w-4 ml-2" /></Button
					>
				{/if}
			</div>
		</div>
		<div class="fixed right-10 w-1/5 hidden lg:block">
			{#if chapters.length}
				<div transition:fly={{ x: '100%', duration: 300 }}>
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-center leading-normal line-clamp-1"
								>{chapter.manga_title}</Card.Title
							>
							<Card.Description class="">
								<img
									class="rounded-lg mt-4 mx-auto"
									loading="lazy"
									src="/images?type=covers&id=manga_{chapter.manga_id}&slug={chapter.manga_cover}"
									alt="Read {chapter.manga_title}"
								/>
							</Card.Description>
						</Card.Header>
						<Card.Content class="grid place-items-center gap-y-4">
							{#if chapters.length}
								<Button variant="outline" class="w-full flex items-center justify-between"
									>Total Chapters <span>{chapters.length}</span></Button
								>
							{/if}
							<ChapterDropDown
								id={data.params.id}
								slug={data.params?.slug}
								currentChapter={chapter.chapter_number}
								{chapters}
							/>
							<Button
								variant="outline"
								class="flex items-center w-full {isFavorite
									? 'border-rose-500 hover:border-rose-800 hover:bg-rose-100 hover:text-rose-500 ease-in-out'
									: ''}"
								on:click={(e) => {
									addToFavorites(e);
								}}
							>
								<span class="flex items-center {isFavorite ? 'text-rose-500' : ''}">
									<Heart class="w-5 mr-2" />
									{isFavorite ? 'Remove' : 'Mark as'} Favorites
								</span>
							</Button>
						</Card.Content>
					</Card.Root>
				</div>
			{/if}
		</div>
	</div>
{/if}
