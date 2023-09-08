<script>
	import '../app.postcss';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/navbar.svelte';
	import { slide, fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let path;

	$: path = $page.url.pathname.split('/').pop();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="min-h-screen bg-background">
	<Navbar />
	<div class="pt-20 md:pt-24 m-auto px-2 md:px-12 lg:px-14">
		{#key path}
			<div in:fly={{ axis: 'x' }} out:fade={{ duration: 300, easing: quintOut }}>
				<slot />
			</div>
		{/key}
	</div>
</div>
