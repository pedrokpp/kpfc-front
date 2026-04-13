<script lang="ts">
	import { fly } from 'svelte/transition';
	import { t } from '$lib/i18n';

	interface Props {
		open: boolean;
		title: string;
		onclose: () => void;
		children: import('svelte').Snippet;
	}

	let { open, title, onclose, children }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div
		role="presentation"
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
		onclick={onclose}
		transition:fly={{ duration: 150, y: 0, opacity: 0 }}
	></div>

	<!-- Panel -->
	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		onkeydown={handleKeydown}
		class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
	>
		<div
			class="pointer-events-auto w-full max-w-md bg-background border border-secondary/20 rounded-xl shadow-xl p-6 flex flex-col gap-4"
			transition:fly={{ duration: 200, y: 8 }}
		>
			<div class="flex items-center justify-between">
				<h2 id="modal-title" class="text-base font-semibold text-text">{title}</h2>
				<button
					onclick={onclose}
					aria-label={$t('modal.closeDialog')}
					class="w-7 h-7 flex items-center justify-center rounded-md text-text/50 hover:text-text hover:bg-secondary/20 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6 6 18M6 6l12 12"/>
					</svg>
				</button>
			</div>
			{@render children()}
		</div>
	</div>
{/if}
