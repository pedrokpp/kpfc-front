<script lang="ts">
	interface Props {
		onrate: (quality: number) => void;
		loading?: boolean;
	}

	let { onrate, loading = false }: Props = $props();

	const ratings = [
		{ value: 0, label: 'Blackout', description: 'No recall' },
		{ value: 1, label: 'Wrong', description: 'Felt familiar' },
		{ value: 2, label: 'Wrong', description: 'Easy once seen' },
		{ value: 3, label: 'Hard', description: 'Significant effort' },
		{ value: 4, label: 'Good', description: 'Some hesitation' },
		{ value: 5, label: 'Perfect', description: 'Instant recall' }
	];

	const colors: Record<number, string> = {
		0: 'border-accent/40 hover:bg-accent/10 hover:border-accent',
		1: 'border-accent/30 hover:bg-accent/10 hover:border-accent',
		2: 'border-accent/20 hover:bg-accent/10 hover:border-accent',
		3: 'border-secondary/40 hover:bg-secondary/20 hover:border-secondary',
		4: 'border-primary/30 hover:bg-primary/10 hover:border-primary',
		5: 'border-primary/50 hover:bg-primary/10 hover:border-primary'
	};
</script>

<div class="flex flex-col gap-3">
	<p class="text-sm text-text/60 text-center font-medium">How well did you recall this?</p>
	<div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
		{#each ratings as rating}
			<button
				onclick={() => onrate(rating.value)}
				disabled={loading}
				class="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border text-center transition-colors disabled:opacity-50 disabled:pointer-events-none {colors[rating.value]}"
			>
				<span class="text-xl font-bold text-text">{rating.value}</span>
				<span class="text-xs font-medium text-text/70">{rating.label}</span>
				<span class="text-[10px] text-text/40 leading-tight">{rating.description}</span>
			</button>
		{/each}
	</div>
</div>
