<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { decksApi } from '$lib/api/decks';
	import type { Deck } from '$lib/types';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let decks = $state<Deck[]>([]);
	let loading = $state(true);
	let sort = $state<'upvotes' | ''>('upvotes');
	let upvotingId = $state<number | null>(null);

	onMount(() => loadDecks());

	async function loadDecks() {
		loading = true;
		try {
			decks = await decksApi.listPublic(sort || undefined);
		} catch {
			toasts.error('Failed to load public decks.');
		} finally {
			loading = false;
		}
	}

	async function toggleSort(value: 'upvotes' | '') {
		sort = value;
		await loadDecks();
	}

	async function handleUpvote(deck: Deck) {
		if (!$auth.token) { toasts.info('Log in to upvote decks.'); return; }
		upvotingId = deck.id;
		try {
			await decksApi.upvote(deck.id);
			decks = decks.map((d) =>
				d.id === deck.id ? { ...d, upvote_count: d.upvote_count + 1 } : d
			);
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to upvote.');
		} finally {
			upvotingId = null;
		}
	}
</script>

<svelte:head><title>Explore — kpfc</title></svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between flex-wrap gap-3">
		<h1 class="text-xl font-bold text-text">Explore</h1>
		<div class="flex items-center gap-1 text-sm">
			<button
				onclick={() => toggleSort('upvotes')}
				class="px-3 py-1.5 rounded-md transition-colors {sort === 'upvotes' ? 'bg-primary text-background' : 'text-text/60 hover:text-text hover:bg-secondary/20'}"
			>
				Top
			</button>
			<button
				onclick={() => toggleSort('')}
				class="px-3 py-1.5 rounded-md transition-colors {sort === '' ? 'bg-primary text-background' : 'text-text/60 hover:text-text hover:bg-secondary/20'}"
			>
				Newest
			</button>
		</div>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(6) as _}
				<div class="h-28 rounded-xl bg-secondary/10 animate-pulse"></div>
			{/each}
		</div>
	{:else if decks.length === 0}
		<EmptyState title="No public decks yet" description="Be the first to share a deck with the community." />
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each decks as deck (deck.id)}
				<article class="bg-background border border-secondary/20 rounded-xl p-5 flex flex-col gap-3 hover:border-secondary/40 transition-colors">
					<div class="flex flex-col gap-1 min-w-0">
						<p class="font-semibold text-text truncate">{deck.title}</p>
						{#if deck.description}
							<p class="text-sm text-text/50 line-clamp-2">{deck.description}</p>
						{/if}
					</div>
					<div class="flex items-center justify-between mt-auto">
						<button
							onclick={() => handleUpvote(deck)}
							disabled={upvotingId === deck.id}
							aria-label="Upvote deck"
							class="flex items-center gap-1.5 text-sm text-text/50 hover:text-accent transition-colors disabled:opacity-50"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
							</svg>
							{deck.upvote_count}
						</button>
						<span class="text-xs text-text/30">{new Date(deck.created_at).toLocaleDateString()}</span>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>
