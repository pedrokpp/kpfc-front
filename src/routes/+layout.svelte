<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { reviewSync } from '$lib/modules/review-sync';
	import { theme } from '$lib/stores/theme';
	import { siteConfig } from '$lib/content/site';
	import PublicFooter from '$lib/components/layout/PublicFooter.svelte';
	import AppNavbar from '$lib/components/layout/AppNavbar.svelte';
	import AppFooter from '$lib/components/layout/AppFooter.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';

	let { children } = $props();
	let pathname = $derived($page.url.pathname);
	let isExploreRoute = $derived(pathname === '/explore');
	let isAppRoute = $derived(pathname.startsWith('/dashboard') || pathname.startsWith('/decks/') || pathname.startsWith('/profile'));
	let isAuthRoute = $derived(pathname === '/login' || pathname === '/register');
	let isHomeRoute = $derived(pathname === '/');

	onMount(() => {
		theme.init();
		reviewSync.start();
	});
</script>

<svelte:head>
	<title>{siteConfig.name} - Flashcards</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-background text-text">
	<AppNavbar />
	{#if isAppRoute || isExploreRoute}
		<main class="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
			<div class="w-full">
				{@render children()}
			</div>
		</main>
		{#if isAppRoute || isExploreRoute}
			<AppFooter />
		{/if}
	{:else}
		<main class="flex-1">
			<div class={isHomeRoute ? 'w-full' : isAuthRoute ? 'mx-auto w-full max-w-7xl px-4 py-10 sm:px-6' : 'mx-auto w-full max-w-7xl px-4 py-10 sm:px-6'}>
				{@render children()}
			</div>
		</main>
		<PublicFooter />
	{/if}
</div>

<ToastContainer />
