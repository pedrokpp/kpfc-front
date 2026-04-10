<script lang="ts">
	import type { CardType } from '$lib/types';
	import CardContent from '$lib/components/card/CardContent.svelte';

	interface Props {
		front: string;
		back: string;
		cardType?: CardType;
		extra?: string;
		revealed: boolean;
		onreveal: () => void;
	}

	let { front, back, cardType = 'basic', extra = '', revealed, onreveal }: Props = $props();

	const isCloze = $derived(cardType === 'cloze');
</script>

<div class="w-full perspective-1000 overflow-hidden">
	<button
		onclick={revealed ? undefined : onreveal}
		aria-label={revealed ? undefined : 'Reveal answer'}
		disabled={revealed}
		class="w-full min-h-52 rounded-2xl border-2 border-secondary/30 bg-background shadow-lg
		       flex flex-col items-center justify-center p-8 text-center gap-4
		       transition-all duration-300 cursor-pointer hover:border-secondary/60
		       {revealed ? 'cursor-default' : ''}"
	>
		{#if !revealed}
			<div class="text-lg font-medium text-text leading-relaxed">
				<CardContent content={front} revealCloze={false} />
			</div>
			<p class="text-xs text-text/40 mt-2">Click to reveal answer</p>
		{:else}
			<div class="w-full flex flex-col gap-5">
				<div class="pb-5 border-b border-secondary/20">
					<p class="text-sm text-text/50 font-medium uppercase tracking-wide mb-2">
						{isCloze ? 'Text' : 'Question'}
					</p>
					<div class="text-base text-text leading-relaxed">
						<CardContent content={front} revealCloze={true} />
					</div>
				</div>
				{#if isCloze}
					{#if extra}
						<div>
							<p class="text-sm text-text/50 font-medium uppercase tracking-wide mb-2">Extra</p>
							<div class="text-lg font-medium text-primary leading-relaxed">
								<CardContent content={extra} />
							</div>
						</div>
					{/if}
				{:else}
					<div>
						<p class="text-sm text-text/50 font-medium uppercase tracking-wide mb-2">Answer</p>
						<div class="text-lg font-medium text-primary leading-relaxed">
							<CardContent content={back} />
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</button>
</div>
