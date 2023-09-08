<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import type {PageServerData} from "./$types"
    import {Button} from "$lib/components/ui/button";
    import {ChapterDropDown} from "$lib//components"
    import {ArrowLeft, ArrowRight} from "lucide-svelte"
    import {page} from "$app/stores";
    import {browser} from "$app/environment";

    export let data: PageServerData;

    $: chapter = data.chapter;
    $: nextChapter = data.nextChapter;
    $: prevChapter = data.prevChapter;
    $: params = $page.params;
    $: chapters = [];

    $: if (browser) {
        console.log(chapters)
    }
</script>

{#if chapter}
    <div class="grid lg:grid-cols-4 py-4 justify-items-center">
    <div class="lg:col-span-3">
        <div class="mb-5 space-y-5">
            <div class="">
                <h2 class="text-center pb-2 text-2xl lg:text-3xl font-semibold tracking-tight transition-colors">{chapter.manga_title}</h2>
            </div>
            <div class="flex items-center justify-between mx-2 gap-x-3">
                {#if prevChapter!==null}
                    <Button href="/manga/{params?.id}/{params?.slug}/{prevChapter?.id}/chapter-{prevChapter?.slug}" variant="secondary"><ArrowLeft class="w-4 mr-2"/> Previous</Button>
                {:else}
                    <Button variant="secondary"><ArrowLeft class="w-4 mr-2"/> Previous</Button>
                {/if}
                <ChapterDropDown bind:chapters id={params.id} slug={params?.slug} currentChapter={chapter.chapter_number} />
                {#if nextChapter!==null}
                    <Button href="/manga/{params?.id}/{params?.slug}/{nextChapter?.id}/chapter-{nextChapter?.slug}" variant="secondary">Next <ArrowRight class="w-4 ml-2"/></Button>
                {:else}
                    <Button disabled={nextChapter===null} variant="secondary">Next <ArrowRight class="w-4 ml-2"/></Button>
                {/if}
            </div>
        </div>
        <div class="px-1 w-full place-self-center">
            {#each chapter.images as image, i}
                <img loading="lazy" class="first:rounded-lg last:rounded-lg self-center mx-auto" src="/images?type=manga&id=manga_{chapter.manga_id}/chapter_{chapter.slug}&slug={image}" alt="Read {chapter.manga_title}'s page {i}">
            {/each}
        </div>
    </div>
    <div class="fixed right-10 w-1/5 hidden lg:block">
        <Card.Root>
            <Card.Header>
                <Card.Title class="text-center leading-normal">{chapter.manga_title}</Card.Title>
                <Card.Description>
                    <img class="rounded-lg mt-4" loading="lazy" src="/images?type=covers&id=manga_{chapter.manga_id}&slug={chapter.manga_cover}" alt="Read {chapter.manga_title}"/>
                </Card.Description>
            </Card.Header>
            <Card.Content class="grid place-items-center gap-y-4">
                {#if chapters.length}
                    <Button variant="secondary" class="w-full flex items-center justify-between">Total Chapters <span>{chapters.length}</span></Button>
                {/if}
                <ChapterDropDown id={params.id} slug={params?.slug} currentChapter={chapter.chapter_number} />
            </Card.Content>
        </Card.Root>
    </div>
</div>
{/if}
