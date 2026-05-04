import { beforeEach, describe, expect, it, vi } from 'vitest';

const review = vi.fn();

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$lib/api/study', () => ({
	studyApi: {
		review
	}
}));

function installStorage() {
	const store = new Map<string, string>();
	const storage = {
		getItem: vi.fn((key: string) => store.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			store.delete(key);
		}),
		clear: vi.fn(() => {
			store.clear();
		}),
		key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
		get length() {
			return store.size;
		}
	};

	vi.stubGlobal('localStorage', storage);
	return storage;
}

describe('reviewSync module', () => {
	beforeEach(() => {
		review.mockReset();
		vi.resetModules();
		installStorage();
	});

	it('keeps deck-scoped pending reviews when sync fails', async () => {
		review.mockRejectedValue(new Error('offline'));

		const { reviewSync } = await import('$lib/modules/review-sync');
		const deck1 = reviewSync.observeDeck(1);
		const deck2 = reviewSync.observeDeck(2);
		let state1: any;
		let state2: any;
		deck1.subscribe((value) => {
			state1 = value;
		});
		deck2.subscribe((value) => {
			state2 = value;
		});

		await reviewSync.enqueue({ id: 'r1', deckId: 1, cardId: 10, quality: 4, createdAt: 'now' });

		expect(JSON.parse(localStorage.getItem('kpfc.review-outbox') ?? '[]')).toHaveLength(1);
		expect(state1.pendingCount).toBe(1);
		expect(state1.syncStatus).toBe('degraded');
		expect(state2.pendingCount).toBe(0);
	});

	it('flushes successful reviews and retries on online', async () => {
		localStorage.setItem(
			'kpfc.review-outbox',
			JSON.stringify([{ id: 'r2', deckId: 2, cardId: 20, quality: 5, createdAt: 'later' }])
		);
		review.mockResolvedValue({});

		const { reviewSync } = await import('$lib/modules/review-sync');
		const deckState = reviewSync.observeDeck(2);
		let state: any;
		deckState.subscribe((value) => {
			state = value;
		});

		reviewSync.start();
		window.dispatchEvent(new Event('online'));
		await reviewSync.flush();

		expect(review).toHaveBeenCalledWith(20, 5);
		expect(JSON.parse(localStorage.getItem('kpfc.review-outbox') ?? '[]')).toEqual([]);
		expect(state.pendingCount).toBe(0);
		expect(state.syncStatus).toBe('idle');
	});
});
