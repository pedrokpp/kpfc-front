<script lang="ts">
	import { authSession as auth } from '$lib/modules/auth-session';
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

<svelte:head><title>{$t('dashboard.title')} — kpfc</title></svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-xl font-bold text-text">{$t('dashboard.title')}</h1>
			{#if $auth.user}
				<p class="text-sm text-text/50 mt-0.5">
					{$auth.user.login_streak} {$t('dashboard.dayStreak')} &middot; {$auth.user.total_points} {$t('dashboard.pts')}
				</p>
			{/if}
		</div>
		<Button onclick={() => (showCreate = true)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M5 12h14M12 5v14"/>
			</svg>
			{$t('dashboard.newDeck')}
		</Button>
	</div>

	{#if $userDecks.loading}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(3) as _}
				<div class="h-28 rounded-xl bg-secondary/10 animate-pulse"></div>
			{/each}
		</div>
	{:else if $userDecks.decks.length === 0}
		<EmptyState
			title={$t('dashboard.noDecksTitle')}
			description={$t('dashboard.noDecksDesc')}
		>
			{#snippet children()}
				<Button onclick={() => (showCreate = true)}>{$t('dashboard.createDeck')}</Button>
			{/snippet}
		</EmptyState>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each $userDecks.decks as deck (deck.id)}
				<DeckCard
					{deck}
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
