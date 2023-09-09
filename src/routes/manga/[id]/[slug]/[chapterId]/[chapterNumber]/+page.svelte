<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { ChapterDropDown } from '$lib//components';
	import { ArrowLeft, ArrowRight, Heart } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { db } from '$lib/db';
	import { invalidateAll } from '$app/navigation';

	export let data: PageServerData;

	$: chapter = data.chapter;
	$: nextChapter = data.nextChapter;
	$: prevChapter = data.prevChapter;
	$: params = $page.params;
	$: chapters = [];
	let isFavorite: any = null;

	$: if (browser) {
		console.log(chapters);
	}

	onMount(async () => {
		isFavorite = await db.favouriteManga.get(params.id.toString());
	});

	const addToFavorites = async (e: any) => {
		e.preventDefault();
		if (isFavorite) {
			await db.favouriteManga.delete(params.id.toString());
		} else {
			await db.favouriteManga.put({
				id: params.id.toString(),
				image: chapter.manga_cover,
				name: chapter.manga_title,
				description: '',
				slug: chapter.manga_slug
			});
		}
		isFavorite = await db.favouriteManga.get(params.id.toString());
		await invalidateAll();
	};
</script>

{#if chapter}
	<div class="grid lg:grid-cols-4 py-4 justify-items-center">
		<div class="lg:col-span-3">
			<div class="mb-5 space-y-5">
				<div class="">
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
									<a href="/manga/{params.id}/{params.slug}">
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
					<a href="/manga/{params.id}/{params.slug}"
						class="hidden text-primary/90 lg:block text-center pb-2 text-xl lg:text-3xl font-semibold tracking-tight transition-colors"
					>
						{chapter.manga_title}
					</a>
				</div>
				<div class="flex items-center justify-between mx-2 gap-x-3">
					{#if prevChapter !== null}
						<Button
							href="/manga/{params?.id}/{params?.slug}/{prevChapter?.id}/chapter-{prevChapter?.slug}"
							variant="secondary"><ArrowLeft class="w-4 mr-2" /> Previous</Button
						>
					{:else}
						<Button disabled={prevChapter === null} variant="outline"
							><ArrowLeft class="w-4 mr-2" /> Previous</Button
						>
					{/if}
					<ChapterDropDown
						bind:chapters
						id={params.id}
						slug={params?.slug}
						currentChapter={chapter.chapter_number}
					/>
					{#if nextChapter !== null}
						<Button
							href="/manga/{params?.id}/{params?.slug}/{nextChapter?.id}/chapter-{nextChapter?.slug}"
							variant="secondary">Next <ArrowRight class="w-4 ml-2" /></Button
						>
					{:else}
						<Button disabled={nextChapter === null} variant="outline"
							>Next <ArrowRight class="w-4 ml-2" /></Button
						>
					{/if}
				</div>
			</div>
			<div class="px-1 w-full place-self-center">
				{#each chapter.images as image, i}
					<img
						loading="lazy"
						class="first:rounded-lg last:rounded-lg self-center mx-auto"
						src="/images?type=manga&id=manga_{chapter.manga_id}/chapter_{chapter.slug}&slug={image}"
						alt="Read {chapter.manga_title}'s page {i}"
					/>
				{/each}
			</div>
			<div class="flex items-center justify-between mx-2 gap-x-3 mt-5">
				{#if prevChapter !== null}
					<Button
							href="/manga/{params?.id}/{params?.slug}/{prevChapter?.id}/chapter-{prevChapter?.slug}"
							variant="secondary"><ArrowLeft class="w-4 mr-2" /> Previous</Button
					>
				{:else}
					<Button disabled={prevChapter === null} variant="outline"
					><ArrowLeft class="w-4 mr-2" /> Previous</Button
					>
				{/if}
				{#if nextChapter !== null}
					<Button
							href="/manga/{params?.id}/{params?.slug}/{nextChapter?.id}/chapter-{nextChapter?.slug}"
							variant="secondary">Next <ArrowRight class="w-4 ml-2" /></Button
					>
				{:else}
					<Button disabled={nextChapter === null} variant="outline"
					>Next <ArrowRight class="w-4 ml-2" /></Button
					>
				{/if}
			</div>
		</div>
		<div class="fixed right-10 w-1/5 hidden lg:block">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-center leading-normal">{chapter.manga_title}</Card.Title>
					<Card.Description>
						<img
							class="rounded-lg mt-4"
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
						id={params.id}
						slug={params?.slug}
						currentChapter={chapter.chapter_number}
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
	</div>
{/if}
