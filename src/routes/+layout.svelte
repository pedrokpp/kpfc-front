<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { reviewSync } from '$lib/modules/review-sync';
	import { theme } from '$lib/stores/theme';
	import { t } from '$lib/i18n';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';

	let { children } = $props();

	onMount(() => {
		theme.init();
		reviewSync.start();
	});
</script>

<svelte:head>
	<title>{$t('layout.pageTitle')}</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-background text-text">
	<Navbar />
	<main class="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
		{@render children()}
	</main>
	<Footer />
</div>

<ToastContainer />
