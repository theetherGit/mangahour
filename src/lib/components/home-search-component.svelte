<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Book, Bookmark, Eye } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let searchResults: any[] = [];
	let showSearchResults = false;
	let inputValue = '';

	async function getSearchedManga(query: string) {
		if (query.length < 3) return;
		const response = await fetch(`/api/search?query=${query}`);
		if (response.ok) {
			showSearchResults = true;
			searchResults = (await response.json()).results;
		}
	}

	$: if (inputValue.length > 2) {
		getSearchedManga(inputValue);
	} else if (inputValue.length === 0) {
		showSearchResults = false;
	}
</script>

<div class="w-full relative space-y-3">
	<Input type="search" placeholder="Search Manga..." bind:value={inputValue} />
	{#if showSearchResults}
		<div transition:slide={{ axis: 'y' }}>
			<Card.Root
				class="px-2 py-4 space-y-4 z-10 absolute h-96 overflow-y-auto scrollbar-thin w-full scrollbar-thumb-primary scrollbar-track-rounded-lg scrollbar-track-accent"
			>
				{#if searchResults.length}
					{#each searchResults as manga}
						<Button
							href="/manga/{manga.id}/{manga.slug}"
							variant="outline"
							class="flex w-full h-15 px-2 items-start justify-start space-x-5"
						>
							<img
								class="w-14 rounded"
								src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.cover}"
								alt=""
							/>
							<div class="grid grid-cols-1 gap-y-4">
								<h3 class="text-lg font-semibold tracking-tight truncate">{manga.title.trim()}</h3>
								<div class="flex items-center space-x-5">
									<div class="flex items-center gap-x-2">
										<Book class="w-4 h-4" />
										{manga['chapters_count']}
									</div>
									<div class="flex items-center gap-x-2">
										<Eye class="w-4 h-4" />
										{manga['views_count']}
									</div>
									<div class="flex items-center gap-x-2">
										<Bookmark class="w-4 h-4" />
										{manga['bookmarks_count']}
									</div>
								</div>
							</div>
						</Button>
					{/each}
				{/if}
			</Card.Root>
		</div>
	{/if}
</div>
