<script lang="ts">
    import * as Select from "$lib/components/ui/select";
    import {onMount} from "svelte";

    export let id;
    export let slug;
    export let currentChapter;
    export let chapters = [];
    onMount(async () => {
        const chapterResponse = await fetch(`/chapters?id=${id}&slug=${slug}`);
        if (chapterResponse.ok) {
            const chaptersResponseJson = await chapterResponse.json();
            chapters = chaptersResponseJson.chapters
        }
    });


    const fruits = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grapes", label: "Grapes" },
        { value: "pineapple", label: "Pineapple" }
    ];
</script>

<Select.Root>
    <Select.Trigger class="w-full">
        <Select.Value placeholder="Chapter {currentChapter}"/>
    </Select.Trigger>
    {#if chapters.length}
        <Select.Content class="h-1/2 overflow-y-scroll py-4 scrollbar-thin scrollbar-thumb-primary
							scrollbar-track-accent">
            <Select.Group>
                {#each chapters as chapter}
                    <a href="/manga/{id}/{slug}/{chapter.id}/chapter-{chapter.slug}">
                        <Select.Item value={chapter.id} label="Chapter {chapter.chapter_number}">Chapter {chapter.chapter_number}</Select.Item>
                    </a>
                {/each}
            </Select.Group>
        </Select.Content>
    {/if}
<!--    <Select.Input name="currentChapter" />-->
</Select.Root>
