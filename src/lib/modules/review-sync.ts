import { browser } from '$app/environment';
import { readable, writable, type Readable } from 'svelte/store';
import { studyApi } from '$lib/api/study';
import type { DeckReviewSyncState, QueuedReview } from '$lib/types';

interface ReviewSyncStoreState {
	queue: QueuedReview[];
	deckStates: Record<number, DeckReviewSyncState>;
}

const REVIEW_OUTBOX_KEY = 'kpfc.review-outbox';

function createIdleState(): DeckReviewSyncState {
	return {
		pendingCount: 0,
		syncStatus: 'idle',
		lastSyncError: null
	};
}

function readQueue(): QueuedReview[] {
	if (!browser) return [];

	try {
		const raw = localStorage.getItem(REVIEW_OUTBOX_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writeQueue(queue: QueuedReview[]) {
	if (!browser) return;
	localStorage.setItem(REVIEW_OUTBOX_KEY, JSON.stringify(queue));
}

function buildDeckStates(
	queue: QueuedReview[],
	base: Record<number, DeckReviewSyncState>,
	syncingDeckIds: Set<number> = new Set()
) {
	const next: Record<number, DeckReviewSyncState> = {};
	const allDeckIds = new Set<number>([
		...Object.keys(base).map(Number),
		...queue.map((review) => review.deckId),
		...syncingDeckIds
	]);

	for (const deckId of allDeckIds) {
		const pendingCount = queue.filter((review) => review.deckId === deckId).length;
		const previous = base[deckId] ?? createIdleState();

		if (pendingCount === 0) {
			next[deckId] = createIdleState();
			continue;
		}

		next[deckId] = {
			pendingCount,
			syncStatus:
				previous.syncStatus === 'degraded'
					? 'degraded'
					: syncingDeckIds.has(deckId)
						? 'syncing'
						: previous.syncStatus,
			lastSyncError: previous.lastSyncError
		};
	}

	return next;
}

function createReviewSyncModule() {
	const { subscribe, set, update } = writable<ReviewSyncStoreState>({
		queue: readQueue(),
		deckStates: buildDeckStates(readQueue(), {})
	});

	let currentState: ReviewSyncStoreState = {
		queue: readQueue(),
		deckStates: buildDeckStates(readQueue(), {})
	};
	let started = false;
	let flushing: Promise<void> | null = null;

	subscribe((value) => {
		currentState = value;
	});

	function patch(mutator: (state: ReviewSyncStoreState) => ReviewSyncStoreState) {
		update((state) => {
			const next = mutator(state);
			writeQueue(next.queue);
			return next;
		});
	}

	function replaceState(next: ReviewSyncStoreState) {
		writeQueue(next.queue);
		set(next);
	}

	function refreshDeckStates(syncingDeckIds: Set<number> = new Set()) {
		patch((state) => ({
			...state,
			deckStates: buildDeckStates(state.queue, state.deckStates, syncingDeckIds)
		}));
	}

	async function flushDecks(targetDeckIds?: Set<number>) {
		if (!browser) return;
		if (flushing) return flushing;

		flushing = (async () => {
			const queue = currentState.queue;
			if (queue.length === 0) {
				refreshDeckStates();
				return;
			}

			const scopedDeckIds = targetDeckIds ?? new Set(queue.map((review) => review.deckId));
			refreshDeckStates(scopedDeckIds);

			let remaining = [...queue];
			const errors = new Map<number, string>();

			for (const pending of queue) {
				if (!scopedDeckIds.has(pending.deckId)) continue;

				try {
					await studyApi.review(pending.cardId, pending.quality);
					remaining = remaining.filter((item) => item.id !== pending.id);
					replaceState({
						queue: remaining,
						deckStates: buildDeckStates(
							remaining,
							Object.fromEntries(
								Object.entries(currentState.deckStates).map(([key, value]) => [
									Number(key),
									errors.has(Number(key))
										? { ...value, syncStatus: 'degraded', lastSyncError: errors.get(Number(key)) ?? null }
										: value
								])
							),
							scopedDeckIds
						)
					});
				} catch (error) {
					errors.set(pending.deckId, error instanceof Error ? error.message : 'sync_failed');
				}
			}

			replaceState({
				queue: remaining,
				deckStates: buildDeckStates(
					remaining,
					Object.fromEntries(
						Array.from(
							new Set([
								...Object.keys(currentState.deckStates).map(Number),
								...remaining.map((review) => review.deckId),
								...scopedDeckIds
							])
						).map((deckId) => [
							deckId,
							errors.has(deckId)
								? {
										pendingCount: remaining.filter((review) => review.deckId === deckId).length,
										syncStatus: 'degraded',
										lastSyncError: errors.get(deckId) ?? null
									}
								: createIdleState()
						])
					),
					new Set()
				)
			});
		})().finally(() => {
			flushing = null;
		});

		return flushing;
	}

	return {
		subscribe,

		start() {
			if (!browser || started) return;
			started = true;
			window.addEventListener('online', () => {
				void this.flush();
			});
			void this.flush();
		},

		observeDeck(deckId: number): Readable<DeckReviewSyncState> {
			return readable(currentState.deckStates[deckId] ?? createIdleState(), (setDeckState) => {
				return subscribe((state) => {
					setDeckState(state.deckStates[deckId] ?? createIdleState());
				});
			});
		},

		async enqueue(review: QueuedReview) {
			patch((state) => {
				const queue = [...state.queue, review];
				return {
					queue,
					deckStates: buildDeckStates(queue, state.deckStates)
				};
			});
			await this.flush();
		},

		async retryDeck(deckId: number) {
			await flushDecks(new Set([deckId]));
		},

		async flush() {
			await flushDecks();
		}
	};
}

export const reviewSync = createReviewSyncModule();
