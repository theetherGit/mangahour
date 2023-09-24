<script>
	import * as Card from '$lib/components/ui/card';
	import {liveReaders} from "$lib/utils";
</script>

<div class="m-auto px-2 md:px-12 lg:px-14">
	<Card.Root class="border-b-0 py-4 px-6 rounded-b-none">
		<div class="flex items-center justify-between pb-2 border-b-2">
			<a href="/" aria-label="logo" class="flex items-center">
				<span
					class="animate-text bg-gradient-to-r from-amber-500 via-red-500 to-yellow-500 bg-clip-text
                                text-2xl font-bold text-transparent md:text-2xl">MangaHour</span
				>
			</a>
			<p class="leading-7">Made with &#10084;</p>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-x-2.5 gap-y-2.5">
			<div class="flex flex-col items-start md:mt-2 py-1 md:px-1">
				<h3 class="text-xl font-bold tracking-tight md:border-b md:pb-1 italic">Main</h3>
				<div class="flex flex-col space-y-4 mt-2">
					<a href="/">Home</a>
					<a href="/manga">All Mangas</a>
					<a href="/favourite">Favourites</a>
				</div>
			</div>
			<div class="flex flex-col items-start md:mt-2 py-1 md:px-1">
				<h3 class="text-xl font-bold tracking-tight md:border-b md:pb-1 italic">Connect</h3>
				<div class="flex flex-col space-y-4 mt-2">
					<a href="/about">About</a>
					<a href="/blog">Blog</a>
					<a href="/contact">Contact</a>
				</div>
			</div>
			<div class="flex flex-col items-start md:mt-2 py-1 md:px-1">
				<h3 class="text-xl font-bold tracking-tight md:border-b md:pb-1 italic">References</h3>
				<div class="flex flex-col space-y-4 mt-2">
					<a href="/sitemap/index.xml">Sitemap.xml</a>
					<a href="/robots.txt">Robots.txt</a>
					<a href="/contact">Report an Issue</a>
				</div>
			</div>
			<div class="flex flex-col items-start md:mt-2 py-1 md:px-1">
				<h3 class="text-xl font-bold tracking-tight md:border-b md:pb-1 italic">Live</h3>
				<div class="flex flex-col space-y-4 mt-2">
					<button>Readers: {$liveReaders}</button>
					<a href="/data">Your Data</a>
				</div>
			</div>
		</div>
		<blockquote class="mt-6 border-l-2 pl-6 italic">
			"We/Mangahour," does not store any files on our server, we only linked to the media which is
			hosted on 3rd party services.
		</blockquote>

		<p class="text-base text-muted-foreground mt-6">© MangaHour.Com. All rights reserved.</p>
	</Card.Root>
</div>
