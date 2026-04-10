<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { decksApi } from '$lib/api/decks';
	import type { Deck } from '$lib/types';
	import DeckCard from '$lib/components/deck/DeckCard.svelte';
	import DeckForm from '$lib/components/deck/DeckForm.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	let decks = $state<Deck[]>([]);
	let loading = $state(true);
	let saving = $state(false);

	let showCreate = $state(false);
	let editingDeck = $state<Deck | null>(null);
	let deletingDeck = $state<Deck | null>(null);

	onMount(async () => {
		if (!$auth.token) { goto('/login'); return; }
		await loadDecks();
	});

	async function loadDecks() {
		loading = true;
		try {
			decks = await decksApi.list();
		} catch (err) {
			toasts.error('Failed to load decks.');
		} finally {
			loading = false;
		}
	}

	async function handleCreate(data: { title: string; description: string; is_public: boolean }) {
		saving = true;
		try {
			const deck = await decksApi.create(data);
			decks = [deck, ...decks];
			showCreate = false;
			toasts.success('Deck created.');
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to create deck.');
		} finally {
			saving = false;
		}
	}

	async function handleEdit(data: { title: string; description: string; is_public: boolean }) {
		if (!editingDeck) return;
		saving = true;
		try {
			const updated = await decksApi.update(editingDeck.id, data);
			decks = decks.map((d) => (d.id === updated.id ? updated : d));
			editingDeck = null;
			toasts.success('Deck updated.');
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to update deck.');
		} finally {
			saving = false;
		}
	}

	async function handleDelete() {
		if (!deletingDeck) return;
		saving = true;
		try {
			await decksApi.delete(deletingDeck.id);
			decks = decks.filter((d) => d.id !== deletingDeck!.id);
			deletingDeck = null;
			toasts.success('Deck deleted.');
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to delete deck.');
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head><title>My Decks — kpfc</title></svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-xl font-bold text-text">My Decks</h1>
			{#if $auth.user}
				<p class="text-sm text-text/50 mt-0.5">
					{$auth.user.login_streak} day streak &middot; {$auth.user.total_points} pts
				</p>
			{/if}
		</div>
		<Button onclick={() => (showCreate = true)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M5 12h14M12 5v14"/>
			</svg>
			New deck
		</Button>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(3) as _}
				<div class="h-28 rounded-xl bg-secondary/10 animate-pulse"></div>
			{/each}
		</div>
	{:else if decks.length === 0}
		<EmptyState
			title="No decks yet"
			description="Create your first deck to start studying."
		>
			{#snippet children()}
				<Button onclick={() => (showCreate = true)}>Create deck</Button>
			{/snippet}
		</EmptyState>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each decks as deck (deck.id)}
				<DeckCard
					{deck}
					onedit={() => (editingDeck = deck)}
					ondelete={() => (deletingDeck = deck)}
				/>
			{/each}
		</div>
	{/if}
</div>

<!-- Create modal -->
<Modal open={showCreate} title="New deck" onclose={() => (showCreate = false)}>
	<DeckForm loading={saving} onsubmit={handleCreate} oncancel={() => (showCreate = false)} />
</Modal>

<!-- Edit modal -->
<Modal open={!!editingDeck} title="Edit deck" onclose={() => (editingDeck = null)}>
	{#if editingDeck}
		<DeckForm deck={editingDeck} loading={saving} onsubmit={handleEdit} oncancel={() => (editingDeck = null)} />
	{/if}
</Modal>

<!-- Delete confirmation modal -->
<Modal open={!!deletingDeck} title="Delete deck" onclose={() => (deletingDeck = null)}>
	<p class="text-sm text-text/70">
		Are you sure you want to delete <strong>{deletingDeck?.title}</strong>? This will remove all cards inside it. This action cannot be undone.
	</p>
	<div class="flex gap-2 justify-end pt-2">
		<Button variant="ghost" onclick={() => (deletingDeck = null)}>Cancel</Button>
		<Button variant="danger" loading={saving} onclick={handleDelete}>Delete</Button>
	</div>
</Modal>
