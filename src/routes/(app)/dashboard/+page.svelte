<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { createUserDecksModule } from '$lib/modules/user-decks';
	import { t } from '$lib/i18n';
	import type { Deck, DeckDraft } from '$lib/types';
	import DeckCard from '$lib/components/deck/DeckCard.svelte';
	import DeckForm from '$lib/components/deck/DeckForm.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { onMount } from 'svelte';

	const userDecks = createUserDecksModule();

	let showCreate = $state(false);
	let editingDeck = $state<Deck | null>(null);
	let deletingDeck = $state<Deck | null>(null);
	let sort = $state<'updated' | 'title'>('updated');

	const sortedDecks = $derived.by(() => {
		const decks = [...$userDecks.decks];
		if (sort === 'title') {
			return decks.sort((a, b) => a.title.localeCompare(b.title));
		}

		return decks.sort(
			(a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
		);
	});

	onMount(async () => {
		try {
			await userDecks.initialize();
		} catch {
			toasts.error($t('dashboard.failedToLoad'));
		}
	});

	async function handleCreate(data: DeckDraft) {
		try {
			await userDecks.create(data);
			showCreate = false;
			toasts.success($t('dashboard.deckCreated'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('dashboard.failedToCreate'));
		}
	}

	async function handleEdit(data: DeckDraft) {
		if (!editingDeck) return;
		try {
			await userDecks.update(editingDeck.id, data);
			editingDeck = null;
			toasts.success($t('dashboard.deckUpdated'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('dashboard.failedToUpdate'));
		}
	}

	async function handleDelete() {
		if (!deletingDeck) return;
		try {
			await userDecks.remove(deletingDeck.id);
			deletingDeck = null;
			toasts.success($t('dashboard.deckDeleted'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('dashboard.failedToDelete'));
		}
	}
</script>

<svelte:head><title>{$t('dashboard.title')} - kpfc</title></svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-bold tracking-[-0.04em] text-primary">{$t('dashboard.title')}</h1>
			<p class="text-sm text-text/58">{$t('dashboard.description')}</p>
		</div>
		<Button onclick={() => (showCreate = true)} class="shrink-0">
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M5 12h14M12 5v14"/>
			</svg>
			{$t('dashboard.newDeck')}
		</Button>
	</div>

	<div class="flex items-center justify-between flex-wrap gap-3">
		<div class="text-xs uppercase tracking-[0.24em] text-text/45">
			{$userDecks.loading
				? $t('dashboard.loadingDecks')
				: $t('dashboard.deckCount', { count: $userDecks.decks.length })}
		</div>
		<div class="flex items-center gap-1 text-sm">
			<button
				onclick={() => (sort = 'updated')}
				class="rounded-full px-3 py-1.5 transition-colors {sort === 'updated' ? 'bg-primary text-background' : 'text-text/60 hover:bg-secondary/14 hover:text-text'}"
			>
				{$t('dashboard.recent')}
			</button>
			<button
				onclick={() => (sort = 'title')}
				class="rounded-full px-3 py-1.5 transition-colors {sort === 'title' ? 'bg-primary text-background' : 'text-text/60 hover:bg-secondary/14 hover:text-text'}"
			>
				{$t('dashboard.alphabetical')}
			</button>
		</div>
	</div>

	{#if $userDecks.loading}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(3) as _}
				<div class="h-32 rounded-[1.6rem] border border-secondary/18 bg-surface animate-pulse"></div>
			{/each}
		</div>
	{:else if $userDecks.decks.length === 0}
		<section class="rounded-[1.8rem] border border-secondary/18 bg-surface px-6 py-8 shadow-[0_18px_50px_rgba(18,32,51,0.05)] sm:px-7">
			<EmptyState
				title={$t('dashboard.noDecksTitle')}
				description={$t('dashboard.noDecksDesc')}
			>
				{#snippet children()}
					<Button onclick={() => (showCreate = true)}>{$t('dashboard.createDeck')}</Button>
				{/snippet}
			</EmptyState>
		</section>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each sortedDecks as deck (deck.id)}
				<DeckCard
					{deck}
					surface="surface"
					showCreatedAt={true}
					onedit={() => (editingDeck = deck)}
					ondelete={() => (deletingDeck = deck)}
				/>
			{/each}
		</div>
	{/if}
</div>

<Modal open={showCreate} title={$t('dashboard.newDeck')} onclose={() => (showCreate = false)}>
	<DeckForm loading={$userDecks.saving} onsubmit={handleCreate} oncancel={() => (showCreate = false)} />
</Modal>

<Modal open={!!editingDeck} title={$t('dashboard.editDeck')} onclose={() => (editingDeck = null)}>
	{#if editingDeck}
		<DeckForm deck={editingDeck} loading={$userDecks.saving} onsubmit={handleEdit} oncancel={() => (editingDeck = null)} />
	{/if}
</Modal>

<Modal open={!!deletingDeck} title={$t('dashboard.deleteDeck')} onclose={() => (deletingDeck = null)}>
	<p class="text-sm text-text/70">
		{$t('dashboard.deleteConfirmPre')} <strong>{deletingDeck?.title}</strong>{$t('dashboard.deleteConfirmPost')}
	</p>
	<div class="flex gap-2 justify-end pt-2">
		<Button variant="ghost" onclick={() => (deletingDeck = null)}>{$t('deckForm.cancel')}</Button>
		<Button variant="danger" loading={$userDecks.saving} onclick={handleDelete}>{$t('dashboard.deleteDeck')}</Button>
	</div>
</Modal>
