<script lang="ts">
	interface Props {
		total: number;
		reviews: { quality: number }[];
		deckId: number;
		deckTitle: string;
	}

	let { total, reviews, deckId, deckTitle }: Props = $props();

	const avg = $derived(
		reviews.length > 0
			? (reviews.reduce((s, r) => s + r.quality, 0) / reviews.length).toFixed(1)
			: '—'
	);

	const good = $derived(reviews.filter((r) => r.quality >= 3).length);
</script>

<div class="flex flex-col items-center gap-6 py-8 text-center">
	<div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
			<path d="m9 11 3 3L22 4"/>
		</svg>
	</div>

	<div class="flex flex-col gap-1">
		<h2 class="text-xl font-bold text-text">Session complete!</h2>
		<p class="text-text/50 text-sm">You reviewed all cards in <strong class="text-text">{deckTitle}</strong></p>
	</div>

	<div class="grid grid-cols-3 gap-6 w-full max-w-xs">
		<div class="flex flex-col gap-1">
			<span class="text-2xl font-bold text-primary">{total}</span>
			<span class="text-xs text-text/50">Cards reviewed</span>
		</div>
		<div class="flex flex-col gap-1">
			<span class="text-2xl font-bold text-primary">{good}</span>
			<span class="text-xs text-text/50">Correct (≥3)</span>
		</div>
		<div class="flex flex-col gap-1">
			<span class="text-2xl font-bold text-primary">{avg}</span>
			<span class="text-xs text-text/50">Avg quality</span>
		</div>
	</div>

	<div class="flex gap-3">
		<a
			href="/decks/{deckId}"
			class="bg-secondary/20 text-text px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/30 transition-colors"
		>
			Back to deck
		</a>
		<a
			href="/decks/{deckId}/study"
			class="bg-primary text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
		>
			Study again
		</a>
	</div>
</div>
