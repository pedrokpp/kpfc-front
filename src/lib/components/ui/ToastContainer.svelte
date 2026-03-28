<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toasts } from '$lib/stores/toast';
</script>

<div
	class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
	aria-live="assertive"
	aria-atomic="false"
>
	{#each $toasts as toast (toast.id)}
		<div
			role="alert"
			transition:fly={{ y: 16, duration: 200 }}
			class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm text-sm border
			{toast.type === 'success'
				? 'bg-primary text-background border-primary/50'
				: toast.type === 'error'
					? 'bg-accent text-background border-accent/50'
					: 'bg-secondary/20 text-text border-secondary/30'}"
		>
			<span class="flex-1">{toast.message}</span>
			<button
				onclick={() => toasts.dismiss(toast.id)}
				aria-label="Dismiss notification"
				class="opacity-70 hover:opacity-100 transition-opacity shrink-0 mt-px"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M18 6 6 18M6 6l12 12"/>
				</svg>
			</button>
		</div>
	{/each}
</div>
