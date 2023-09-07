<script lang="ts">
    import type {PageServerData} from "./$types"
    import {browser} from "$app/environment";
    import {Button} from "$lib/components/ui/button";
    import {ChapterDropDown} from "$lib//components"
    import {ArrowLeft, ArrowRight} from "lucide-svelte"
    import {page} from "$app/stores";

    export let data: PageServerData;

    $: chapter = data.chapter;
    $: nextChapter = data.nextChapter;
    $: prevChapter = data.prevChapter;
    $: params = $page.params;
    if (browser){
        console.log(data)
    }
</script>

{#if chapter}
    <div class="grid lg:grid-cols-4 py-4 justify-items-center">
    <div class="lg:col-span-3">
        <div class="mb-5 space-y-5">
            <div class="">
                <h2 class="text-center pb-2 text-2xl lg:text-3xl font-semibold tracking-tight transition-colors">{chapter.manga_title}</h2>
            </div>
            <div class="flex items-center justify-between mx-2">
                {#if prevChapter!==null}
                    <Button disabled={prevChapter===null} href="/manga/{params?.id}/{params?.slug}/{prevChapter?.id}/chapter-{prevChapter?.slug}" variant="secondary"><ArrowLeft class="w-4 mr-2"/> Previous</Button>
                {/if}
                <ChapterDropDown id={params.id} slug={params?.slug} currentChapter={chapter.chapter_number} />
                {#if nextChapter!==null}
                    <Button disabled={nextChapter===null} href="/manga/{params?.id}/{params?.slug}/{nextChapter?.id}/chapter-{nextChapter?.slug}" variant="secondary">Next <ArrowRight class="w-4 ml-2"/></Button>
                {/if}
            </div>
        </div>
        <div class="px-1 w-full place-self-center">
            {#each chapter.images as image, i}
                <img loading="lazy" class="first:rounded-lg last:rounded-lg self-center mx-auto" src="/images?type=manga&id=manga_{chapter.manga_id}/chapter_{chapter.slug}&slug={image}" alt="Read {chapter.manga_title}'s page {i}">
            {/each}
        </div>
    </div>
    <div class="fixed right-0 hidden lg:block">
        hi
    </div>
</div>
{/if}
