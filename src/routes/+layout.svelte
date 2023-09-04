<script>
	import '../app.postcss';
	import {onNavigate} from "$app/navigation";
	import Navbar from '$lib/components/navbar.svelte';

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
		<slot />
	</div>
</div>
