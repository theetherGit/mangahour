<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { create, insertMultiple, search } from '@orama/orama';
	import { db } from '$lib/db';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { ArrowUpDown } from 'lucide-svelte';

	export let id: string;
	export let slug: string;

	export let chapters: Array<any> = []

	let chaptersInView: any = [];
	let chapterSearchDB: any = null;
	let alreadyReadChapters: any = null;

	onMount(async () => {

		if (chapters.length) {
			console.log('c', chapters);
		}

		chapterSearchDB = await create({
			schema: {
				chapter_number: 'string'
			}
		});

		chaptersInView = chapters;
			const validSearchData = chapters.map((chapter: any) => {
				return {
					...chapter,
					id: chapter.id.toString()
				};
			});
			await insertMultiple(chapterSearchDB, validSearchData, validSearchData.length);
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
			chaptersInView = chapters;
		}
	};
	let sorting = false
	let searchInput = '';
</script>

{#if chapters && chapters.length}
	<Card.Root class="mt-5 col-span-1 md:col-span-2">
		<Card.Header>
			<Card.Title class="flex items-center justify-between text-center">
				Chapter List
				<Button variant="ghost" size="icon" on:click={() => {
					sorting = !sorting
					chapters.reverse()
					chaptersInView = chapters
					if (searchInput) searchInput = ''
				}}>
					<ArrowUpDown class={sorting ? 'text-primary' : ''}/>
				</Button>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<Input
				on:input={(e) => searchChapter(e?.target?.value)}
				type="text"
				bind:value={searchInput}
				placeholder="Search chapter e.g. 61, ..."
				class="mb-2"
			/>
			{#if chaptersInView && chaptersInView.length}
				<div
					transition:slide={{ axis: 'y', duration: 300 }}
					class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 max-h-96 gap-4
							overflow-y-scroll px-2 py-4 scrollbar-thin scrollbar-thumb-primary
							scrollbar-track-accent"
				>
					{#each chaptersInView as chapter}
						{@const alreadyRead = alreadyReadChapters?.chapters.includes(chapter.id.toString())}
						<Button
							class="flex items-center justify-between"
							href="/manga/{id}/{slug}/{chapter.id}/chapter-{chapter.slug}"
							variant={alreadyRead ? 'secondary' : 'default'}
						>
							Chapter {chapter.chapter_number}<span
								>{formatDistanceToNowStrict(new Date(chapter['created_at']))}</span
							>
						</Button>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{:else}
	<div class="flex min-w-full min-h-96 gap-4 px-2 py-4" />
{/if}
