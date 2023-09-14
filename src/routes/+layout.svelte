<script lang="ts">
	import '../app.postcss';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/navbar.svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { partytownSnippet } from '@builder.io/partytown/integration';
	import {BackToTop, Footer} from '$lib/components';
	import SvelteSeo from "svelte-seo";

	let path: string;

	$: path = $page.url.pathname.split('/').pop() as string;

	onNavigate((navigation) => {
		if (!document?.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<script>
		partytown = {
			forward: ['dataLayer.push']
		};
	</script>

	{@html '<script>' + partytownSnippet() + '</script>'}

	<script
		type="text/partytown"
		src="https://www.googletagmanager.com/gtag/js?id=G-6ESELQN018"
	></script>
	<script type="text/partytown">
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-6ESELQN018');
	</script>
</svelte:head>

<SvelteSeo
		title="Mangahour | Home"
		description="Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas."
		canonical="{$page.url.href}"
		keywords="Read Manga on Mangahour, mangahour home, mangahour latest mangas"
		applicationName="MangaHour"
		openGraph={{
			title: "Mangahour | Home",
			description: "Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas.",
			url: `${$page.url.href}`,
			type: "website",
			images: [
			  {
				url: `${$page.url.origin}/og/home`,
				width: 800,
				height: 600,
				alt: "Read manga, manwha and manhua on mangahour",
			  }
			],
			site_name: "MangaHour",
		}}
		twitter={{
			card: "summary",
			site: "@mangahour",
			title: "Mangahour | Home",
			description: "Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas.",
			image: `${$page.url.origin}/og/home`,
		}}
		jsonLd={{
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "Mangahour | Home",
			description:
			"Read all latest updated mangas, manwha and manhua only on mangahour. Here read updated mangas, top chapter and top mangas.",
			url: `${$page.url.href}`
		}}
/>

<div class="min-h-screen bg-background">
	<Navbar />
	<div class="pt-20 md:pt-24 m-auto px-2 md:px-12 lg:px-14">
		{#key path}
			<div in:fly out:fade={{ duration: 300, easing: quintOut }}>
				<slot />
			</div>
		{/key}
	</div>
	<Footer />
	<BackToTop />
</div>
