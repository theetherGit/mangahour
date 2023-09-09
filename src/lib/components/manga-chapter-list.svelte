<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { create, insertMultiple, search } from '@orama/orama';
	import { db } from '$lib/db';

	export let id: string;
	export let slug: string;

	let allChapters: any = [];
	let chaptersInView: any = [];
	let chapterSearchDB: any = null;
	let alreadyReadChapters: any = null;

	onMount(async () => {
		chapterSearchDB = await create({
			schema: {
				chapter_number: 'string'
			},
			components: {}
		});
		const chapterResponse = await fetch(`/chapters?id=${id}&slug=${slug}`);
		if (chapterResponse.ok) {
			const chaptersResponseJson = await chapterResponse.json();
			allChapters = chaptersInView = chaptersResponseJson.chapters;
			const validSearchData = allChapters.map((chapter: any) => {
				return {
					...chapter,
					id: chapter.id.toString()
				};
			});
			await insertMultiple(chapterSearchDB, validSearchData, validSearchData.length);
		}
		alreadyReadChapters = await db.mangaChapterReadHistory.get(id.toString());
	});

	const searchChapter = async (value: string) => {
		if (value) {
			const results = await search(chapterSearchDB, {
				term: value,
				properties: '*',
				limit: 20
			});
			const searchResultChapters = results.hits.map((data) => {
				return data.document;
			});
			chaptersInView = searchResultChapters;
		} else {
			chaptersInView = allChapters;
		}
	};
</script>

<Card.Root class="mt-5 col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title class="text-center">Chapter List</Card.Title>
	</Card.Header>
	<Card.Content>
		<Input
			on:input={(e) => searchChapter(e?.target?.value)}
			type="text"
			placeholder="Search chapter..."
			class="mb-2"
		/>
		{#if chaptersInView}
			<div
				transition:slide={{ axis: 'y', duration: 300 }}
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-96 gap-4
							overflow-y-scroll px-2 py-4 scrollbar-thin scrollbar-thumb-primary
							scrollbar-track-accent"
			>
				{#each chaptersInView as chapter}
					{@const alreadyRead = alreadyReadChapters?.chapters.includes(chapter.id.toString())}
					<Button
						href="/manga/{id}/{slug}/{chapter.id}/chapter-{chapter.slug}"
						variant={alreadyRead ? 'secondary' : 'default'}
					>
						Chapter {chapter.chapter_number}
					</Button>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
