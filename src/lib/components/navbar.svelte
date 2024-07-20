<script lang="ts">
	import NoBgLogo from '$lib/images/noBgLogo.webp';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Search } from 'lucide-svelte';
	import { showSearchPanel } from '$lib/utils';
	import { onMount } from 'svelte';
	let show = false;
	let navItems = [
		{ title: 'Home', link: '/home', active: '/' },
		{ title: 'All Mangas', link: '/manga', active: 'manga' },
		{ title: 'Favourites', link: '/favourite', active: 'favourite' },
		{ title: 'Your Data', link: '/data', active: 'data' },
		{ title: 'Anime News', link: 'https://newzertainment.com/category/anime-nw?ref=https://mangahour.com', active: 'anime-news' }
	];

	beforeNavigate(() => {
		if (show) show = false;
	});

	let path = '/';

	$: if (browser) {
		path = $page.url.pathname;
	}

	function addFocusToSearch(id: string) {
		const searchEleId = document.getElementById(id)
		if (searchEleId) {
			searchEleId.focus()
		}
	}

	onMount(() => {
		const animeNewsLink = document.getElementById('nav-anime-news') as HTMLAnchorElement
		animeNewsLink.rel='external'
		animeNewsLink.target='_blank'
		animeNewsLink.referrerPolicy='origin'
	})
</script>

<header class="flex flex-wrap justify-center">
	<nav class="fixed z-10 w-full border-b bg-opacity-70 backdrop-blur">
		<div class="m-auto px-2 md:px-12 xl:px-7 w-full">
			<div class="flex flex-wrap items-center justify-between gap-6 xl:gap-0 xl:py-3">
				<div class="flex w-full justify-between px-3 py-2 xl:py-0 xl:px-0 xl:w-max">
					<a href="/" aria-label="logo" class="flex items-center gap-1">
						<img
							src={NoBgLogo}
							class="w-12 md:w-16"
							alt="Ether Corps logo"
							width="144"
							height="133"
						/>
						<span
							class="animate-text bg-gradient-to-r from-amber-500 via-red-500 to-yellow-500 bg-clip-text
            						text-2xl font-bold text-transparent md:text-2xl">MangaHour</span
						>
					</a>
					<div class="flex items-center xl:hidden">
						<Button variant="ghost" size="icon" class="h-6 w-6 bg-transparent hover:bg-transparent" on:click={() => {
							switch (path) {
								case '/home':
								case '/favourite':
									addFocusToSearch('global-search')
									break;
								case '/manga':
									addFocusToSearch('manga-global-search')
									break;
								default:
									showSearchPanel.set(!$showSearchPanel);
									setTimeout(() => {
										addFocusToSearch('global-search')
									}, 500)
							}
						}}>
							<Search class="text-primary/70"/>
						</Button>
						<button
							class="relative -mr-6 h-8 w-10 p-6"
							on:click={() => {
								show = !show;
							}}
						>
							<span class="sr-only">Open main menu</span>
							<div
								class="absolute left-1/2 top-1/2 block w-5 -translate-x-1/2 -translate-y-1/2 transform"
							>
								<span
									aria-hidden="true"
									class="hamburger-line {show === true ? 'rotate-45' : '-translate-y-1.5'}"
								/>
								<span
									aria-hidden="true"
									class="absolute block h-0.5 w-3 transform rounded bg-primary/70 transition duration-500 ease-in-out {show ===
									true
										? 'opacity-0'
										: ''}"
								/>
								<span
									aria-hidden="true"
									class="hamburger-line {show === true ? '-rotate-45' : 'translate-y-1.5'}"
								/>
							</div>
						</button>
					</div>
				</div>
				<div
					class="{show
						? 'block transition delay-75 duration-500 ease-in-out'
						: 'hidden'} mx-6 mb-16 w-full flex-wrap items-center justify-end space-y-10 rounded-xl bg-accent p-6 shadow-lg md:flex-nowrap xl:m-0 xl:flex xl:w-7/12 xl:space-y-0 xl:bg-transparent xl:p-0 xl:shadow-none"
				>
					<div class="text-foreground xl:pr-4">
						<ul class="space-y-6 text-lg font-medium tracking-wide xl:flex xl:space-y-0 xl:text-sm">
							{#each navItems as item}
								<li>
									<a id="nav-{item.active}"
										href={item.link}
										class:active={$page.url.pathname.includes(item.link)}
										class="block transition hover:text-primary md:px-4"
									>
										<span>{item.title}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
					<div
						class="hidden md:block flex w-full flex-col sm:flex-row md:w-max xl:space-y-0 xl:space-x-2"
					/>
				</div>
			</div>
		</div>
	</nav>
</header>

<style>
	.hamburger-line {
		@apply absolute block  h-0.5 w-5 transform rounded bg-primary/70 transition duration-500 ease-in-out;
	}
	.active {
		@apply text-primary;
	}
</style>
