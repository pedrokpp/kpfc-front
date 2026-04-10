<script lang="ts">
	import type { Card } from '$lib/types';

	interface Props {
		card: Card;
		onedit?: () => void;
		ondelete?: () => void;
	}

	let { card, onedit, ondelete }: Props = $props();

	const isDue = $derived(new Date(card.next_review_at) <= new Date());
	const nextReview = $derived(new Date(card.next_review_at));
</script>

<article
	onclick={() => onedit?.()}
	role="button"
	tabindex="0"
	onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onedit?.(); }}
	class="group bg-background border border-secondary/20 rounded-lg p-4 flex flex-col gap-2 hover:border-secondary/40 transition-colors cursor-pointer"
>
	<div class="flex items-start justify-between gap-2">
		<div class="flex flex-col gap-1.5 min-w-0 flex-1">
			<div class="flex items-start gap-1.5">
				<p class="text-sm font-medium text-text line-clamp-2">{card.title || card.front}</p>
				{#if card.card_type === 'cloze'}
					<span class="shrink-0 text-xs bg-secondary/20 text-secondary px-1.5 py-0.5 rounded">cloze</span>
				{/if}
			</div>
			<p class="text-sm text-text/50 line-clamp-2">{card.card_type === 'cloze' && card.extra ? card.extra : card.back}</p>
		</div>
		<div class="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
			{#if onedit}
				<button
					onclick={(e) => { e.stopPropagation(); onedit?.(); }}
					aria-label="Edit card"
					class="p-1.5 rounded-md text-text/40 hover:text-text hover:bg-secondary/20 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
					</svg>
				</button>
			{/if}
			{#if ondelete}
				<button
					onclick={(e) => { e.stopPropagation(); ondelete?.(); }}
					aria-label="Delete card"
					class="p-1.5 rounded-md text-text/40 hover:text-accent hover:bg-accent/10 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
					</svg>
				</button>
			{/if}
		</div>
	</div>
	<div class="flex items-center gap-3 text-xs text-text/40 mt-1">
		{#if isDue}
			<span class="text-accent font-medium">Due for review</span>
		{:else}
			<span>Next: {nextReview.toLocaleDateString()}</span>
		{/if}
		<span>Interval: {card.interval}d</span>
		<span>Reps: {card.repetitions}</span>
	</div>
</article>
