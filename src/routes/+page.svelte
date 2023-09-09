<script lang="ts">
	import { onMount } from 'svelte';
	import { Squirrel } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { HomePageMangaViewCard } from '$lib/components';

	export let data: PageServerData;
</script>

<section id="main">
	<div class="grid grid-cols-3">
		<div class="col-span-3 md:col-span-2 space-y-4">
			<Input type="search" placeholder="Search Manga..." />
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="flex items-center justify-between border-b pb-2">
							<div class="flex items-center gap-2 text-primary">
								<Squirrel class="text-primary" />
								<h2>Latest Updates</h2>
							</div>
							<div>
								<Button
									size="sm"
									class="h-min px-2 py-1 text-foreground bg-primary hover:bg-accent hover:text-foreground transition-all duration-500 ease-in-out"
								>
									View All
								</Button>
							</div>
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					{#if data.home.latest}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
							{#each data.home.latest as manga}
								{@const newChapters = JSON.parse(manga['new_chapters'])}
								<HomePageMangaViewCard {manga} {newChapters} />
							{/each}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
		<div class="" />
	</div>
</section>
