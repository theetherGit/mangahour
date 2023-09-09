<script lang="ts">
	import '../app.postcss';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/navbar.svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { partytownSnippet } from '@builder.io/partytown/integration';
	import { BackToTop } from '$lib/components';

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
	<!-- Config options -->
	<!-- Config options -->
	<!-- Config options -->
	<script>
		// Forward the necessary functions to the web worker layer
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

<div class="min-h-screen bg-background">
	<Navbar />
	<div class="pt-20 md:pt-24 m-auto px-2 md:px-12 lg:px-14">
		{#key path}
			<div in:fly out:fade={{ duration: 300, easing: quintOut }}>
				<slot />
			</div>
		{/key}
	</div>
	<BackToTop />
</div>
