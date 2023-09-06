<script lang="ts">
	import NoBgLogo from '$lib/images/noBgLogo.png';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	let show = false;
	let navItems = [
		{ title: 'Home', link: '/home', active: '/' },
		{ title: 'All Mangas', link: '/manga', active: 'manga' },
		{ title: 'Hot Mangas', link: '/hot-mangas', active: 'hot-mangas' },
		{ title: 'Favourites', link: '/favourite', active: 'favourite' },
		{ title: 'About', link: '/about', active: 'about' }
	];

	let path;
	$: if (browser) {
		path = $page.url.pathname;
	}
</script>

<svelte:head>
	<meta name="theme-color" content="/DCF2F1" />
</svelte:head>

<header class="flex flex-wrap justify-center">
	<nav class="fixed z-10 w-full border-b bg-opacity-70 backdrop-blur">
		<div class="container m-auto px-2 md:px-12 lg:px-7">
			<div class="flex flex-wrap items-center justify-between gap-6 md:gap-0 md:py-3">
				<div class="flex w-full justify-between px-3 py-2 md:py-0 md:px-0 lg:w-max">
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
					<button
						class="relative -mr-6 h-8 w-10 p-6 lg:hidden"
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
				<div
					class="{show
						? 'block transition delay-75 duration-500 ease-in-out'
						: 'hidden'} mx-6 mb-16 w-full flex-wrap items-center justify-end space-y-20 rounded-xl bg-accent p-6 shadow-lg md:flex-nowrap lg:m-0 lg:flex lg:w-7/12 lg:space-y-0 lg:bg-transparent lg:p-0 lg:shadow-none"
				>
					<div class="text-foreground lg:pr-4">
						<ul class="space-y-6 text-lg font-medium tracking-wide lg:flex lg:space-y-0 lg:text-sm">
							{#each navItems as item}
								<li>
									<a
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
