<script lang="ts">
	import type { Deck } from '$lib/types';

	interface Props {
		deck: Deck;
		onedit?: () => void;
		ondelete?: () => void;
	}

	let { deck, onedit, ondelete }: Props = $props();
</script>

<article class="group bg-background border border-secondary/20 rounded-xl p-5 flex flex-col gap-3 hover:border-secondary/40 transition-colors">
	<div class="flex items-start justify-between gap-2">
		<div class="flex flex-col gap-1 min-w-0">
			<a href="/decks/{deck.id}" class="font-semibold text-text hover:text-primary transition-colors truncate">
				{deck.title}
			</a>
			{#if deck.description}
				<p class="text-sm text-text/50 line-clamp-2">{deck.description}</p>
			{/if}
		</div>
		{#if deck.is_public}
			<span class="shrink-0 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">Public</span>
		{/if}
	</div>

	<div class="flex items-center justify-between mt-auto">
		<div class="flex items-center gap-3 text-xs text-text/40">
			{#if deck.is_public}
				<span class="flex items-center gap-1">
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
					</svg>
					{deck.upvote_count}
				</span>
			{/if}
		</div>

		{#if onedit || ondelete}
			<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				{#if onedit}
					<button
						onclick={onedit}
						aria-label="Edit deck"
						class="p-1.5 rounded-md text-text/40 hover:text-text hover:bg-secondary/20 transition-colors"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
						</svg>
					</button>
				{/if}
				{#if ondelete}
					<button
						onclick={ondelete}
						aria-label="Delete deck"
						class="p-1.5 rounded-md text-text/40 hover:text-accent hover:bg-accent/10 transition-colors"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
						</svg>
					</button>
				{/if}
			</div>
		{/if}
	</div>
</article>
