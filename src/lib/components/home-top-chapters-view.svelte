<script>
	import { Eye } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';

	export let mangaList;
</script>

<div class="pt-2 space-y-4">
	{#each mangaList as manga}
		<div class="group">
			<Card.Root class="group-hover:scale-105 transition-all duration-300 ">
				<Card.Content class="pt-2 pb-1.5 px-2.5">
					<div class="grid grid-cols-3">
						<div class="col-span-1">
							<img
								class="w-20 bg-cover rounded-lg"
								src="/images?type=covers_optimized_home_main&id=manga_{manga.manga_id}&slug={manga.manga_cover}"
								alt="Read {manga.manga_title}"
							/>
						</div>
						<div class="col-span-2">
							<a href="/manga/{manga.manga_id}/{manga.manga_slug}">
								<div class="flex items-center gap-x-1 pb-1 border-b">
									<h3 class="text-lg font-semibold tracking-tight truncate">{manga.manga_title}</h3>
								</div>
							</a>
							<div class="pt-2">
								<a
									href="/manga/{manga.manga_id}/{manga.manga_slug}/{manga.chapter_id}/chapter-{manga.slug}"
								>
									<Card.Root>
										<Card.Content class="px-2.5 py-1">
											<div class="flex items-center justify-between">
												<p>Chapter {manga.chapter_number}</p>
												<p>New</p>
											</div>
										</Card.Content>
									</Card.Root>
								</a>
							</div>
							<div class="pt-2 pl-0">
								<Card.Root>
									<Card.Content class="px-2.5 py-1">
										<div class="flex items-center justify-between">
											<p>Views</p>
											<p class="flex gap-x-2"><Eye class="w-5" />{manga.views_count}</p>
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
