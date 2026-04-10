<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { decksApi } from '$lib/api/decks';
	import { cardsApi } from '$lib/api/cards';
	import type { CardInput } from '$lib/api/cards';
	import type { Deck, Card } from '$lib/types';
	import CardItem from '$lib/components/card/CardItem.svelte';
	import CardForm from '$lib/components/card/CardForm.svelte';
	import DeckForm from '$lib/components/deck/DeckForm.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	const deckId = Number($page.params.id);

	let deck = $state<Deck | null>(null);
	let cards = $state<Card[]>([]);
	let loading = $state(true);
	let saving = $state(false);

	let showAddCard = $state(false);
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
			toasts.error('Failed to load deck.');
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
			toasts.success('Card added.');
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to add card.');
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
			toasts.success('Card updated.');
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to update card.');
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
			toasts.success('Card deleted.');
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to delete card.');
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
			toasts.success('Deck updated.');
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to update deck.');
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
					<a href="/dashboard" class="text-text/40 hover:text-text/70 text-sm transition-colors">My Decks</a>
					<span class="text-text/30 text-sm">/</span>
					<h1 class="text-xl font-bold text-text">{deck.title}</h1>
					{#if deck.is_public}
						<span class="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">Public</span>
					{/if}
				</div>
				{#if deck.description}
					<p class="text-sm text-text/50">{deck.description}</p>
				{/if}
				<p class="text-xs text-text/40">{cards.length} card{cards.length !== 1 ? 's' : ''} &middot; {dueCount} due</p>
			</div>
			<div class="flex items-center gap-2 shrink-0">
				<Button variant="ghost" size="sm" onclick={() => (showEditDeck = true)}>Edit deck</Button>
				{#if cards.length > 0}
					<a
						href="/decks/{deckId}/study"
						class="inline-flex items-center gap-2 bg-primary text-background text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<polygon points="5 3 19 12 5 21 5 3"/>
						</svg>
						Study
					</a>
				{/if}
				<Button onclick={() => (showAddCard = true)} size="sm">
					<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 12h14M12 5v14"/>
					</svg>
					Add card
				</Button>
			</div>
		</div>

		<!-- Cards list -->
		{#if cards.length === 0}
			<EmptyState
				title="No cards yet"
				description="Add your first card to this deck."
			>
				{#snippet children()}
					<Button onclick={() => (showAddCard = true)}>Add card</Button>
				{/snippet}
			</EmptyState>
		{:else}
			<div class="flex flex-col gap-2">
				{#each cards as card (card.id)}
					<CardItem
						{card}
						onedit={() => (editingCard = card)}
						ondelete={() => (deletingCard = card)}
					/>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<Modal open={showAddCard} title="Add card" onclose={() => (showAddCard = false)}>
	<CardForm loading={saving} onsubmit={handleAddCard} oncancel={() => (showAddCard = false)} />
</Modal>

<Modal open={!!editingCard} title="Edit card" onclose={() => (editingCard = null)}>
	{#if editingCard}
		<CardForm card={editingCard} loading={saving} onsubmit={handleEditCard} oncancel={() => (editingCard = null)} />
	{/if}
</Modal>

<Modal open={!!deletingCard} title="Delete card" onclose={() => (deletingCard = null)}>
	<p class="text-sm text-text/70">Are you sure you want to delete this card? This action cannot be undone.</p>
	<div class="flex gap-2 justify-end pt-2">
		<Button variant="ghost" onclick={() => (deletingCard = null)}>Cancel</Button>
		<Button variant="danger" loading={saving} onclick={handleDeleteCard}>Delete</Button>
	</div>
</Modal>

<Modal open={showEditDeck} title="Edit deck" onclose={() => (showEditDeck = false)}>
	{#if deck}
		<DeckForm {deck} loading={saving} onsubmit={handleEditDeck} oncancel={() => (showEditDeck = false)} />
	{/if}
</Modal>
