<script>
	import { Eye, Bookmark } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';

	export let mangaList;
	export let typeOfView = 'readers';
</script>

{#if mangaList && mangaList.length}
	<div class="grid md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-y-3 md:gap-3">
		{#each mangaList as manga}
			<div class="group">
				<Card.Root class="group-hover:scale-105 transition-all duration-300 h-full">
					<Card.Content class="pt-2 pb-1.5 px-2.5">
						<div class="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-3">
							<div class="col-span-1">
								<img
									class="w-20 h-28 bg-cover rounded-lg"
									src="/images?type=covers_optimized_home_main&id=manga_{manga.id}&slug={manga.cover}"
									alt="Read {manga.manga_title}"
								/>
							</div>
							<div class="col-span-2 md:col-span-3 xl:col-span-2 md:pl-3 xl:pl-0">
								<a href="/manga/{manga.id}/{manga.slug}">
									<div class="flex items-center gap-x-1 pb-1 border-b">
										<h3 class="text-lg font-semibold tracking-tight truncate">{manga.title}</h3>
									</div>
								</a>
								<div class="pt-2">
									<Card.Root>
										<Card.Content class="px-2.5 py-1">
											<div class="flex items-center justify-between">
												<p>Rating</p>
												<p>{manga.rating}/10</p>
											</div>
										</Card.Content>
									</Card.Root>
								</div>
								<div class="pt-2 pl-0">
									<Card.Root>
										<Card.Content class="px-2.5 py-1">
											<div class="flex items-center justify-between">
												<p>{typeOfView === 'readers' ? 'Reads' : 'Bookmarks'}</p>
												<p class="flex gap-x-2">
													{#if typeOfView === 'readers'}
														<Eye class="w-5 text-primary" />
													{:else}
														<Bookmark class="w-4 text-green-700" />
													{/if}
													{typeOfView === 'readers' ? manga.views_count : manga.bookmarks_count}
												</p>
											</div>
										</Card.Content>
									</Card.Root>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		{/each}
	</div>
{/if}