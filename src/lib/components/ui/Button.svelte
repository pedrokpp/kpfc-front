<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		loading?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		loading = false,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const base = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none';

	const variants: Record<string, string> = {
		primary: 'bg-primary text-background hover:opacity-90',
		secondary: 'bg-secondary/20 text-text hover:bg-secondary/30',
		ghost: 'text-text/70 hover:text-text hover:bg-secondary/20',
		danger: 'bg-accent text-background hover:opacity-90'
	};

	const sizes: Record<string, string> = {
		sm: 'text-sm px-3 py-1.5',
		md: 'text-sm px-4 py-2'
	};
</script>

<button
	{type}
	disabled={disabled || loading}
	{onclick}
	class="{base} {variants[variant]} {sizes[size]} {className}"
>
	{#if loading}
		<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
			<path d="M21 12a9 9 0 1 1-6.219-8.56"/>
		</svg>
	{/if}
	{@render children()}
</button>
