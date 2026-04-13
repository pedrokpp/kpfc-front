<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { decksApi } from '$lib/api/decks';
	import { cardsApi } from '$lib/api/cards';
	import { t } from '$lib/i18n';
	import type { CardInput } from '$lib/api/cards';
	import type { Deck, Card } from '$lib/types';
	import CardItem from '$lib/components/card/CardItem.svelte';
	import CardForm from '$lib/components/card/CardForm.svelte';
	import DeckForm from '$lib/components/deck/DeckForm.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Flashcard from '$lib/components/study/Flashcard.svelte';

	const deckId = Number($page.params.id);

	let deck = $state<Deck | null>(null);
	let cards = $state<Card[]>([]);
	let loading = $state(true);
	let saving = $state(false);

	let showAddCard = $state(false);
	let previewingCard = $state<Card | null>(null);
	let previewRevealed = $state(false);
	let editingCard = $state<Card | null>(null);
	let deletingCard = $state<Card | null>(null);
	let showEditDeck = $state(false);

	onMount(async () => {
		if (!$auth.token) { goto('/login'); return; }
		await loadData();
	});

	async function loadData() {
		loading = true;
		try {
			[deck, cards] = await Promise.all([
				decksApi.get(deckId),
				cardsApi.list(deckId)
			]);
		} catch (err) {
			toasts.error($t('deck.failedToLoad'));
			goto('/dashboard');
		} finally {
			loading = false;
		}
	}

	async function handleAddCard(data: CardInput) {
		saving = true;
		try {
			const card = await cardsApi.create(deckId, data);
			cards = [...cards, card];
			showAddCard = false;
			toasts.success($t('deck.cardAdded'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('deck.failedToAddCard'));
		} finally {
			saving = false;
		}
	}

	async function handleEditCard(data: CardInput) {
		if (!editingCard) return;
		saving = true;
		try {
			const updated = await cardsApi.update(editingCard.id, data);
			cards = cards.map((c) => (c.id === updated.id ? updated : c));
			editingCard = null;
			toasts.success($t('deck.cardUpdated'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('deck.failedToUpdateCard'));
		} finally {
			saving = false;
		}
	}

	async function handleDeleteCard() {
		if (!deletingCard) return;
		saving = true;
		try {
			await cardsApi.delete(deletingCard.id);
			cards = cards.filter((c) => c.id !== deletingCard!.id);
			deletingCard = null;
			toasts.success($t('deck.cardDeleted'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('deck.failedToDeleteCard'));
		} finally {
			saving = false;
		}
	}

	async function handleEditDeck(data: { title: string; description: string; is_public: boolean }) {
		if (!deck) return;
		saving = true;
		try {
			deck = await decksApi.update(deckId, data);
			showEditDeck = false;
			toasts.success($t('dashboard.deckUpdated'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('deck.failedToUpdateDeck'));
		} finally {
			saving = false;
		}
	}

	const dueCount = $derived(cards.filter((c) => new Date(c.next_review_at) <= new Date()).length);
</script>

<svelte:head><title>{deck?.title ?? 'Deck'} — kpfc</title></svelte:head>

{#if loading}
	<div class="flex flex-col gap-4">
		<div class="h-8 w-48 rounded bg-secondary/10 animate-pulse"></div>
		<div class="h-4 w-64 rounded bg-secondary/10 animate-pulse"></div>
	</div>
{:else if deck}
	<div class="flex flex-col gap-6">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
			<div class="flex flex-col gap-1">
				<div class="flex items-center gap-2">
					<a href="/dashboard" class="text-text/40 hover:text-text/70 text-sm transition-colors">{$t('deck.myDecks')}</a>
					<span class="text-text/30 text-sm">/</span>
					<h1 class="text-xl font-bold text-text">{deck.title}</h1>
					{#if deck.is_public}
						<span class="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">{$t('deck.public')}</span>
					{/if}
				</div>
				{#if deck.description}
					<p class="text-sm text-text/50">{deck.description}</p>
				{/if}
				<p class="text-xs text-text/40">{cards.length} {cards.length !== 1 ? $t('deck.cards') : $t('deck.card')} &middot; {dueCount} {$t('deck.due')}</p>
			</div>
			<div class="flex items-center gap-2 shrink-0">
				<Button variant="ghost" size="sm" onclick={() => (showEditDeck = true)}>{$t('deck.editDeck')}</Button>
				{#if cards.length > 0}
					<a
						href="/decks/{deckId}/study"
						class="inline-flex items-center gap-2 bg-primary text-background text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<polygon points="5 3 19 12 5 21 5 3"/>
						</svg>
						{$t('deck.study')}
					</a>
				{/if}
				<Button onclick={() => (showAddCard = true)} size="sm">
					<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 12h14M12 5v14"/>
					</svg>
					{$t('deck.addCard')}
				</Button>
			</div>
		</div>

		<!-- Cards list -->
		{#if cards.length === 0}
			<EmptyState
				title={$t('deck.noCardsTitle')}
				description={$t('deck.noCardsDesc')}
			>
				{#snippet children()}
					<Button onclick={() => (showAddCard = true)}>{$t('deck.addCard')}</Button>
				{/snippet}
			</EmptyState>
		{:else}
			<div class="flex flex-col gap-2">
				{#each cards as card (card.id)}
					<CardItem
						{card}
						onpreview={() => { previewingCard = card; previewRevealed = false; }}
						onedit={() => (editingCard = card)}
						ondelete={() => (deletingCard = card)}
					/>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<Modal open={!!previewingCard} title={$t('deck.preview')} onclose={() => { previewingCard = null; previewRevealed = false; }}>
	{#if previewingCard}
		<Flashcard
			front={previewingCard.front}
			back={previewingCard.back}
			cardType={previewingCard.card_type}
			extra={previewingCard.extra}
			revealed={previewRevealed}
			onreveal={() => (previewRevealed = true)}
		/>
	{/if}
</Modal>

<Modal open={showAddCard} title={$t('deck.addCard')} onclose={() => (showAddCard = false)}>
	<CardForm loading={saving} onsubmit={handleAddCard} oncancel={() => (showAddCard = false)} />
</Modal>

<Modal open={!!editingCard} title={$t('deck.editCard')} onclose={() => (editingCard = null)}>
	{#if editingCard}
		<CardForm card={editingCard} loading={saving} onsubmit={handleEditCard} oncancel={() => (editingCard = null)} />
	{/if}
</Modal>

<Modal open={!!deletingCard} title={$t('deck.deleteCard')} onclose={() => (deletingCard = null)}>
	<p class="text-sm text-text/70">{$t('deck.deleteCardConfirm')}</p>
	<div class="flex gap-2 justify-end pt-2">
		<Button variant="ghost" onclick={() => (deletingCard = null)}>{$t('cardForm.cancel')}</Button>
		<Button variant="danger" loading={saving} onclick={handleDeleteCard}>{$t('deck.deleteCard')}</Button>
	</div>
</Modal>

<Modal open={showEditDeck} title={$t('deck.editDeck')} onclose={() => (showEditDeck = false)}>
	{#if deck}
		<DeckForm {deck} loading={saving} onsubmit={handleEditDeck} oncancel={() => (showEditDeck = false)} />
	{/if}
</Modal>
