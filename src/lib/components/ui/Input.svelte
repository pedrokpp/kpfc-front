<script lang="ts">
	interface Props {
		id?: string;
		label?: string;
		type?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		class?: string;
		onchange?: (e: Event) => void;
		oninput?: (e: Event) => void;
	}

	let {
		id,
		label,
		type = 'text',
		value = $bindable(''),
		placeholder,
		required = false,
		disabled = false,
		error,
		class: className = '',
		onchange,
		oninput
	}: Props = $props();

	const inputId = $derived(id ?? crypto.randomUUID());
</script>

<div class="flex flex-col gap-1 {className}">
	{#if label}
		<label for={inputId} class="text-sm font-medium text-text/80">
			{label}{#if required}<span class="text-accent ml-0.5" aria-hidden="true">*</span>{/if}
		</label>
	{/if}
	<input
		{type}
		id={inputId}
		bind:value
		{placeholder}
		{required}
		{disabled}
		{onchange}
		{oninput}
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${inputId}-error` : undefined}
		class="px-3 py-2 rounded-md border border-secondary/30 bg-background text-text text-sm placeholder:text-text/40
		       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
		       disabled:opacity-50 disabled:cursor-not-allowed transition-colors
		       {error ? 'border-accent' : ''}"
	/>
	{#if error}
		<p id="{inputId}-error" class="text-xs text-accent">{error}</p>
	{/if}
</div>
