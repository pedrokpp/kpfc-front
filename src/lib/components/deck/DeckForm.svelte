<script lang="ts">
	import { untrack } from 'svelte';
	import type { Deck } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		deck?: Deck;
		loading?: boolean;
		onsubmit: (data: { title: string; description: string; is_public: boolean }) => void;
		oncancel: () => void;
	}

	let { deck, loading = false, onsubmit, oncancel }: Props = $props();

	let title = $state(untrack(() => deck?.title ?? ''));
	let description = $state(untrack(() => deck?.description ?? ''));
	let is_public = $state(untrack(() => deck?.is_public ?? false));

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onsubmit({ title, description, is_public });
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<Input label="Title" id="deck-title" bind:value={title} placeholder="e.g. Go Basics" required />
	<div class="flex flex-col gap-1">
		<label for="deck-description" class="text-sm font-medium text-text/80">Description</label>
		<textarea
			id="deck-description"
			bind:value={description}
			placeholder="Optional description"
			rows="3"
			class="px-3 py-2 rounded-md border border-secondary/30 bg-background text-text text-sm placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none transition-colors"
		></textarea>
	</div>
	<label class="flex items-center gap-2 cursor-pointer select-none">
		<input type="checkbox" bind:checked={is_public} class="w-4 h-4 accent-accent rounded" />
		<span class="text-sm text-text/80">Make this deck public</span>
	</label>
	<div class="flex gap-2 justify-end pt-1">
		<Button variant="ghost" onclick={oncancel} type="button">Cancel</Button>
		<Button type="submit" {loading}>{deck ? 'Save changes' : 'Create deck'}</Button>
	</div>
</form>
