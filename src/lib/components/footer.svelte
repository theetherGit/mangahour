<script>
    import * as Card from '$lib/components/ui/card'
    import NoBgLogo from "$lib/images/noBgLogo.webp";
    import {Button} from "$lib/components/ui/button";
</script>

<div class="m-auto px-2 md:px-12 lg:px-14">
    <Card.Root class="border-b-0 py-4 px-6 rounded-b-none">
        <div class="flex items-center justify-between pb-2 border-b-2">
            <a href="/" aria-label="logo" class="flex items-center">
<!--                <img-->
<!--                        src={NoBgLogo}-->
<!--                        class="object-contain ml-0 w-12 md:w-16"-->
<!--                        alt="Ether Corps logo"-->
<!--                />-->
                <span
                        class="animate-text bg-gradient-to-r from-amber-500 via-red-500 to-yellow-500 bg-clip-text
                                text-2xl font-bold text-transparent md:text-2xl">MangaHour</span
                >
            </a>
            <p class="leading-7">Made with &#10084;</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3">
            <div class="flex flex-col items-start md:mt-2 py-1 md:px-1 border-b md:border-b-0">
                <h3 class="text-xl font-semibold tracking-tight md:border-b md:pb-1">Main</h3>
                <div class="flex flex-col space-y-2 mt-2">
                    <a href="/">Home</a>
                    <a href="/manga">All Mangas</a>
                    <a href="/hot-mangas">Hot Mangas</a>
                </div>
            </div>
            <div class="flex flex-col items-start md:mt-2 py-1 md:px-1 border-b md:border-b-0">
                <h3 class="text-xl font-semibold tracking-tight md:border-b md:pb-1">Main</h3>
                <div class="flex flex-col space-y-2 mt-2">
                    <a href="/about">About</a>
                    <a href="/blog">Blog</a>
                    <a href="/contact">Contact</a>
                </div>
            </div>
            <div class="flex flex-col items-start md:mt-2 py-1 md:px-1 border-b md:border-b-0">
                <h3 class="text-xl font-semibold tracking-tight md:border-b md:pb-1">References</h3>
                <div class="flex flex-col space-y-2 mt-2">
                    <a href="/sitemap.xml">Sitemap.xml</a>
                    <a href="/robots.txt">Robots.txt</a>
                    <a href="/contact">Report an Issue</a>
                </div>
            </div>
        </div>
    </Card.Root>
</div>
