<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowUpFromLine } from 'lucide-svelte';
	let below = false;
	let y: number;
	let innerWidth: number;
	$: below = y > 50; // You can change 50 as per your need.
	function scrollUp() {
		document.body.scrollIntoView({ behavior: 'smooth' }); // it works in js
	}
</script>

<Button
	variant="outline"
	on:click={scrollUp}
	class="fixed flex items-center space-x-2 px-2 py-2 group
		transition duration-75 ease-in-out
		rounded-full shadow-md active:shadow-lg
		bottom-5 right-5 md:bottom-3 lg:right-10 {below ? '' : 'hidden'}"
>
	<ArrowUpFromLine />
	<span class="hidden md:block">Back to top</span>
</Button>

<svelte:window bind:innerWidth bind:scrollY={y} />
