<script lang="ts">
	import { untrack } from 'svelte';
	import type { Card } from '$lib/types';
	import type { CardInput } from '$lib/api/cards';
	import { mediaApi } from '$lib/api/media';
	import { toasts } from '$lib/stores/toast';
	import { t } from '$lib/i18n';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		card?: Card;
		loading?: boolean;
		onsubmit: (data: CardInput) => void;
		oncancel: () => void;
	}

	let { card, loading = false, onsubmit, oncancel }: Props = $props();

	let cardType = $state<'basic' | 'cloze'>(untrack(() => card?.card_type ?? 'basic'));
	let title = $state(untrack(() => card?.title ?? ''));
	let front = $state(untrack(() => card?.front ?? ''));
	let back = $state(untrack(() => card?.back ?? ''));
	let extra = $state(untrack(() => card?.extra ?? ''));
	let uploading = $state(false);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const data: CardInput = { front, back };
		if (title.trim()) data.title = title.trim();
		if (cardType === 'cloze') {
			data.card_type = 'cloze';
			const match = front.match(/\{\{c(\d+)::/);
			data.cloze_index = match ? parseInt(match[1], 10) : 1;
			data.extra = extra || undefined;
		}
		onsubmit(data);
	}

	async function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'audio/mpeg', 'audio/mp4'];
		if (!allowed.includes(file.type)) {
			toasts.error($t('cardForm.unsupportedFileType'));
			input.value = '';
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			toasts.error($t('cardForm.fileTooLarge'));
			input.value = '';
			return;
		}

		uploading = true;
		try {
			const media = await mediaApi.upload(file);
			const isAudio = file.type.startsWith('audio/');
			const tag = isAudio ? `[audio](${media.url})` : `![${file.name}](${media.url})`;
			front = front ? front + '\n' + tag : tag;
			toasts.success($t('cardForm.fileUploaded'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('cardForm.uploadFailed'));
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	const textareaClass = 'px-3 py-2 rounded-md border border-secondary/30 bg-background text-text text-sm placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none transition-colors';
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Title (optional) -->
	<div class="flex flex-col gap-1">
		<label for="card-title" class="text-sm font-medium text-text/80">{$t('cardForm.title')} <span class="text-text/30 font-normal">({$t('cardForm.titleOptional')})</span></label>
		<input
			id="card-title"
			type="text"
			bind:value={title}
			placeholder={$t('cardForm.titlePlaceholder')}
			class="px-3 py-2 rounded-md border border-secondary/30 bg-background text-text text-sm placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
		/>
	</div>

	<!-- Card type toggle -->
	<div class="flex gap-1 p-1 bg-secondary/10 rounded-lg w-fit">
		<button
			type="button"
			onclick={() => (cardType = 'basic')}
			class="px-3 py-1.5 text-sm rounded-md transition-colors {cardType === 'basic' ? 'bg-primary text-background font-medium shadow-sm' : 'text-text/60 hover:text-text'}"
		>
			{$t('cardForm.basic')}
		</button>
		<button
			type="button"
			onclick={() => (cardType = 'cloze')}
			class="px-3 py-1.5 text-sm rounded-md transition-colors {cardType === 'cloze' ? 'bg-primary text-background font-medium shadow-sm' : 'text-text/60 hover:text-text'}"
		>
			{$t('cardForm.cloze')}
		</button>
	</div>

	<!-- Front / Text -->
	<div class="flex flex-col gap-1">
		<label for="card-front" class="text-sm font-medium text-text/80">
			{cardType === 'cloze' ? $t('cardForm.text') : $t('cardForm.front')} <span class="text-accent" aria-hidden="true">*</span>
		</label>
		{#if cardType === 'cloze'}
			<p class="text-xs text-text/40">Use <code class="bg-secondary/20 px-1 rounded">{'{{c1::answer}}'}</code> {$t('cardForm.clozeHintPost')}</p>
		{/if}
		<textarea
			id="card-front"
			bind:value={front}
			placeholder={cardType === 'cloze' ? 'The {{c1::Go}} runtime manages goroutines.' : $t('cardForm.frontPlaceholderBasic')}
			rows="3"
			required
			class={textareaClass}
		></textarea>
	</div>

	<!-- Back (basic only) -->
	{#if cardType === 'basic'}
		<div class="flex flex-col gap-1">
			<label for="card-back" class="text-sm font-medium text-text/80">
				{$t('cardForm.back')} <span class="text-accent" aria-hidden="true">*</span>
			</label>
			<textarea
				id="card-back"
				bind:value={back}
				placeholder={$t('cardForm.backPlaceholder')}
				rows="3"
				required
				class={textareaClass}
			></textarea>
		</div>
	{/if}

	<!-- Extra (cloze only) -->
	{#if cardType === 'cloze'}
		<div class="flex flex-col gap-1">
			<label for="card-extra" class="text-sm font-medium text-text/80">{$t('cardForm.extra')} ({$t('cardForm.extraOptional')})</label>
			<textarea
				id="card-extra"
				bind:value={extra}
				placeholder={$t('cardForm.extraPlaceholder')}
				rows="2"
				class={textareaClass}
			></textarea>
		</div>
	{/if}

	<!-- Media upload -->
	<div class="flex items-center gap-2">
		<label class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-text/60 hover:bg-secondary/20 transition-colors cursor-pointer {uploading ? 'opacity-50 pointer-events-none' : ''}">
			{#if uploading}
				<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
				{$t('cardForm.uploading')}
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
				{$t('cardForm.attachFile')}
			{/if}
			<input
				type="file"
				accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,audio/mpeg,audio/mp4"
				onchange={handleFileUpload}
				class="hidden"
				disabled={uploading}
			/>
		</label>
		<span class="text-xs text-text/30">{$t('cardForm.fileHint')}</span>
	</div>

	<div class="flex gap-2 justify-end pt-1">
		<Button variant="ghost" onclick={oncancel} type="button">{$t('cardForm.cancel')}</Button>
		<Button type="submit" loading={loading || uploading}>{card ? $t('cardForm.saveChanges') : $t('cardForm.addCard')}</Button>
	</div>
</form>
