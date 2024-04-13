<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	export let id: string;
	export let slug: string;
	export let currentChapter: string;
	export let chapters: Array<Record<string, any>> = [];
</script>

<Select.Root disabled={!chapters.length}>
	<Select.Trigger class="w-full">
		<Select.Value placeholder="Chapter {currentChapter}" />
	</Select.Trigger>
	{#if chapters.length}
		<Select.Content
			class="min-h-fit max-h-[50%] md:max-h-[25%] overflow-y-auto overflow-auto py-4 scrollbar-thin scrollbar-thumb-primary
							scrollbar-track-accent"
		>
			<Select.Group>
				{#each chapters as chapter}
					<a data-sveltekit-preload-data="tap" href="/manga/{id}/{slug}/{chapter.id}/chapter-{chapter.slug}">
						<Select.Item value={chapter.id} label="Chapter {chapter.chapter_number}"
							>Chapter {chapter.chapter_number}</Select.Item
						>
					</a>
				{/each}
			</Select.Group>
		</Select.Content>
	{/if}
	<!--    <Select.Input name="currentChapter" />-->
</Select.Root>
