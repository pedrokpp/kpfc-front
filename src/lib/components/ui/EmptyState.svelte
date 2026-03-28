<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		children?: import('svelte').Snippet;
	}

	let { title, description, children }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 text-center gap-3">
	<div class="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-text/40">
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10"/>
			<path d="M12 8v4M12 16h.01"/>
		</svg>
	</div>
	<p class="text-text/70 font-medium">{title}</p>
	{#if description}
		<p class="text-text/40 text-sm max-w-xs">{description}</p>
	{/if}
	{#if children}
		<div class="mt-2">{@render children()}</div>
	{/if}
</div>
