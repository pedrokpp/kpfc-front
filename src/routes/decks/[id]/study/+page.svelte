<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { decksApi } from '$lib/api/decks';
	import { studyApi } from '$lib/api/study';
	import type { Deck, Card, StudyMode } from '$lib/types';
	import Flashcard from '$lib/components/study/Flashcard.svelte';
	import QualityRating from '$lib/components/study/QualityRating.svelte';
	import SessionSummary from '$lib/components/study/SessionSummary.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const deckId = Number($page.params.id);

	type Phase = 'select' | 'studying' | 'done';

	let phase = $state<Phase>('select');
	let deck = $state<Deck | null>(null);
	let cards = $state<Card[]>([]);
	let currentIndex = $state(0);
	let revealed = $state(false);
	let submitting = $state(false);
	let reviews = $state<{ quality: number }[]>([]);

	onMount(async () => {
		if (!$auth.token) { goto('/login'); return; }
		try {
			deck = await decksApi.get(deckId);
		} catch {
			toasts.error('Deck not found.');
			goto('/dashboard');
		}
	});

	async function startSession(mode: StudyMode) {
		try {
			cards = await studyApi.start(deckId, mode);
			if (cards.length === 0) {
				toasts.info('No cards due for review right now.');
				return;
			}
			currentIndex = 0;
			revealed = false;
			reviews = [];
			phase = 'studying';
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to start session.');
		}
	}

	async function handleRate(quality: number) {
		const card = cards[currentIndex];
		submitting = true;
		try {
			await studyApi.review(card.id, quality);
			reviews = [...reviews, { quality }];
			if (currentIndex + 1 >= cards.length) {
				phase = 'done';
			} else {
				currentIndex += 1;
				revealed = false;
			}
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to submit review.');
		} finally {
			submitting = false;
		}
	}

	const currentCard = $derived(cards[currentIndex]);
	const progress = $derived(cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 0);
</script>

<svelte:head><title>Study — {deck?.title ?? 'kpfc'}</title></svelte:head>

<div class="max-w-2xl mx-auto flex flex-col gap-6">

	{#if phase === 'select'}
		<div class="flex flex-col gap-6">
			<div>
				<a href="/decks/{deckId}" class="text-text/40 hover:text-text/70 text-sm transition-colors">
					← Back to deck
				</a>
				<h1 class="text-xl font-bold text-text mt-2">Study: {deck?.title}</h1>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<button
					onclick={() => startSession('spaced')}
					class="flex flex-col gap-2 p-6 rounded-xl border-2 border-secondary/20 bg-background text-left hover:border-primary/40 hover:bg-primary/5 transition-all"
				>
					<span class="font-semibold text-text">Spaced Repetition</span>
					<span class="text-sm text-text/50">Review cards due today based on the SM-2 algorithm. Most efficient for long-term memory.</span>
				</button>
				<button
					onclick={() => startSession('random')}
					class="flex flex-col gap-2 p-6 rounded-xl border-2 border-secondary/20 bg-background text-left hover:border-secondary/60 hover:bg-secondary/5 transition-all"
				>
					<span class="font-semibold text-text">Random Practice</span>
					<span class="text-sm text-text/50">Review all cards in random order. Good for self-testing. SM-2 state is not modified.</span>
				</button>
			</div>
		</div>

	{:else if phase === 'studying' && currentCard}
		<div class="flex flex-col gap-5 min-w-0">
			<!-- Progress -->
			<div class="flex items-center gap-3">
				<a href="/decks/{deckId}" class="text-text/40 hover:text-text/70 text-sm transition-colors shrink-0">
					← Exit
				</a>
				<div class="flex-1 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
					<div
						class="h-full bg-primary rounded-full transition-all duration-300"
						style="width: {progress}%"
					></div>
				</div>
				<span class="text-sm text-text/50 shrink-0">{currentIndex + 1} / {cards.length}</span>
			</div>

			<!-- Flashcard -->
			<Flashcard
				front={currentCard.front}
				back={currentCard.back}
				cardType={currentCard.card_type}
				extra={currentCard.extra}
				{revealed}
				onreveal={() => (revealed = true)}
			/>

			<!-- Rating (shown after reveal) -->
			{#if revealed}
				<QualityRating onrate={handleRate} loading={submitting} />
			{/if}
		</div>

	{:else if phase === 'done'}
		<SessionSummary
			total={cards.length}
			{reviews}
			{deckId}
			deckTitle={deck?.title ?? ''}
		/>
	{/if}
</div>
