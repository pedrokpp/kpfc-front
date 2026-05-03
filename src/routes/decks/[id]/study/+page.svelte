<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { decksApi } from '$lib/api/decks';
	import { studyApi } from '$lib/api/study';
	import { createStudySessionModule } from '$lib/modules/study-session';
	import { t } from '$lib/i18n';
	import type { StudyMode } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import QualityRating from '$lib/components/study/QualityRating.svelte';
	import SessionSummary from '$lib/components/study/SessionSummary.svelte';
	import Flashcard from '$lib/components/study/Flashcard.svelte';

	const deckId = Number($page.params.id);
	const studySession = createStudySessionModule({
		deckId,
		decks: decksApi,
		study: studyApi
	});
	let submitting = $state(false);

	onMount(async () => {
		if (!$auth.token) { goto('/login'); return; }
		const result = await studySession.initialize();
		if (result === 'missing-deck') {
			toasts.error($t('study.deckNotFound'));
			goto('/dashboard');
			return;
		}

		if (result === 'offline-resumed') {
			toasts.info($t('study.offlineResumed'));
		}
	});

	async function startSession(mode: StudyMode) {
		try {
			const result = await studySession.start(mode);
			if (result === 'empty') {
				toasts.info($t('study.noCardsDue'));
			}
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('study.failedToStart'));
		}
	}

	async function handleRate(quality: number) {
		submitting = true;
		try {
			await studySession.rate(quality);
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('study.failedToSubmit'));
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head><title>{$t('study.pageTitle')} — {$studySession.deck?.title ?? 'kpfc'}</title></svelte:head>

<div class="max-w-2xl mx-auto flex flex-col gap-6">
	{#if $studySession.pendingCount > 0 || $studySession.syncStatus === 'syncing'}
		<div class="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 flex items-center justify-between gap-3">
			<div class="flex flex-col gap-1">
				<p class="text-sm font-medium text-text">
					{$studySession.syncStatus === 'syncing'
						? $t('study.syncing')
						: $t('study.syncPending', { count: $studySession.pendingCount })}
				</p>
				<p class="text-xs text-text/60">
					{$t('study.syncDegraded')}
				</p>
			</div>
			{#if $studySession.syncStatus === 'degraded'}
				<Button variant="ghost" size="sm" onclick={() => studySession.retrySync()}>
					{$t('study.retrySync')}
				</Button>
			{/if}
		</div>
	{/if}

	{#if $studySession.phase === 'select'}
		<div class="flex flex-col gap-6">
			<div>
				<a href="/decks/{deckId}" class="text-text/40 hover:text-text/70 text-sm transition-colors">
					{$t('study.backToDeck')}
				</a>
				<h1 class="text-xl font-bold text-text mt-2">{$t('study.titlePrefix')} {$studySession.deck?.title}</h1>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<button
					onclick={() => startSession('spaced')}
					class="flex flex-col gap-2 p-6 rounded-xl border-2 border-secondary/20 bg-background text-left hover:border-primary/40 hover:bg-primary/5 transition-all"
				>
					<span class="font-semibold text-text">{$t('study.spacedRepetition')}</span>
					<span class="text-sm text-text/50">{$t('study.spacedDesc')}</span>
				</button>
				<button
					onclick={() => startSession('random')}
					class="flex flex-col gap-2 p-6 rounded-xl border-2 border-secondary/20 bg-background text-left hover:border-secondary/60 hover:bg-secondary/5 transition-all"
				>
					<span class="font-semibold text-text">{$t('study.randomPractice')}</span>
					<span class="text-sm text-text/50">{$t('study.randomDesc')}</span>
				</button>
			</div>
		</div>

	{:else if $studySession.phase === 'studying' && $studySession.cards[$studySession.currentIndex]}
		<div class="flex flex-col gap-5 min-w-0">
			<!-- Progress -->
			<div class="flex items-center gap-3">
				<a href="/decks/{deckId}" class="text-text/40 hover:text-text/70 text-sm transition-colors shrink-0">
					{$t('study.exit')}
				</a>
				<div class="flex-1 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
					<div
						class="h-full bg-primary rounded-full transition-all duration-300"
						style="width: {$studySession.cards.length > 0 ? ($studySession.currentIndex / $studySession.cards.length) * 100 : 0}%"
					></div>
				</div>
				<span class="text-sm text-text/50 shrink-0">{$studySession.currentIndex + 1} / {$studySession.cards.length}</span>
			</div>

			<!-- Flashcard -->
			<Flashcard
				front={$studySession.cards[$studySession.currentIndex].front}
				back={$studySession.cards[$studySession.currentIndex].back}
				cardType={$studySession.cards[$studySession.currentIndex].card_type}
				extra={$studySession.cards[$studySession.currentIndex].extra}
				revealed={$studySession.revealed}
				onreveal={() => studySession.reveal()}
			/>

			<!-- Rating (shown after reveal) -->
			{#if $studySession.revealed}
				<QualityRating onrate={handleRate} loading={submitting} />
			{/if}
		</div>

	{:else if $studySession.phase === 'done'}
		<SessionSummary
			total={$studySession.cards.length}
			reviews={$studySession.reviews}
			{deckId}
			deckTitle={$studySession.deck?.title ?? ''}
		/>
	{/if}
</div>
