<script lang="ts">
	import { onMount } from 'svelte';
	import { authSession as auth } from '$lib/modules/auth-session';
	import { toasts } from '$lib/stores/toast';
	import { createPublicDecksModule } from '$lib/modules/public-decks';
	import { t } from '$lib/i18n';
	import type { Deck } from '$lib/types';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	const publicDecks = createPublicDecksModule();

	onMount(async () => {
		try {
			await publicDecks.initialize();
		} catch {
			toasts.error($t('explore.failedToLoad'));
		}
	});

	async function toggleSort(value: 'upvotes' | '') {
		try {
			await publicDecks.setSort(value);
		} catch {
			toasts.error($t('explore.failedToLoad'));
		}
	}

	async function handleUpvote(deck: Deck) {
		if (!$auth.token) { toasts.info($t('explore.loginToUpvote')); return; }
		try {
			await publicDecks.toggleUpvote(deck.id);
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('explore.failedToUpvote'));
		}
	}
</script>

<svelte:head><title>{$t('explore.title')} — kpfc</title></svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between flex-wrap gap-3">
		<h1 class="text-xl font-bold text-text">{$t('explore.title')}</h1>
		<div class="flex items-center gap-1 text-sm">
			<button
				onclick={() => toggleSort('upvotes')}
				class="px-3 py-1.5 rounded-md transition-colors {$publicDecks.sort === 'upvotes' ? 'bg-primary text-background' : 'text-text/60 hover:text-text hover:bg-secondary/20'}"
			>
				{$t('explore.top')}
			</button>
			<button
				onclick={() => toggleSort('')}
				class="px-3 py-1.5 rounded-md transition-colors {$publicDecks.sort === '' ? 'bg-primary text-background' : 'text-text/60 hover:text-text hover:bg-secondary/20'}"
			>
				{$t('explore.newest')}
			</button>
		</div>
	</div>

	{#if $publicDecks.loading}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(6) as _}
				<div class="h-28 rounded-xl bg-secondary/10 animate-pulse"></div>
			{/each}
		</div>
	{:else if $publicDecks.decks.length === 0}
		<EmptyState title={$t('explore.noDecksTitle')} description={$t('explore.noDecksDesc')} />
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each $publicDecks.decks as deck (deck.id)}
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
							disabled={$publicDecks.upvotingId === deck.id}
							aria-label={$t('explore.upvoteDeck')}
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
