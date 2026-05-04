import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: true }));

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

describe('studySession module', () => {
	beforeEach(() => {
		vi.resetModules();
		installStorage();
	});

	it('resumes offline and advances through ratings', async () => {
		const card = {
			id: 1,
			deck_id: 9,
			title: 'A',
			front: 'A',
			back: 'B',
			card_type: 'basic' as const,
			cloze_index: 0,
			extra: '',
			interval: 1,
			repetitions: 1,
			ease_factor: 2.5,
			next_review_at: new Date().toISOString(),
			created_at: '',
			updated_at: ''
		};
		localStorage.setItem(
			'kpfc.study-session.9',
			JSON.stringify({
				version: 1,
				deckId: 9,
				deck: { id: 9, user_id: 1, title: 'Deck', description: '', is_public: false, upvote_count: 0, created_at: '', updated_at: '' },
				mode: 'spaced',
				phase: 'studying',
				cards: [card],
				currentIndex: 0,
				revealed: true,
				reviews: []
			})
		);

		const reviewSync = { enqueue: vi.fn().mockResolvedValue(undefined) };
		const decks = { get: vi.fn().mockRejectedValue(new Error('offline')) };
		const study = { start: vi.fn().mockResolvedValue([card]) };

		const { createStudySessionModule } = await import('$lib/modules/study-session');
		const module = createStudySessionModule({ deckId: 9, decks, study, reviewSync });
		let state: any;
		module.subscribe((value) => {
			state = value;
		});

		await expect(module.initialize()).resolves.toBe('offline-resumed');
		module.reveal();
		await expect(module.rate(4)).resolves.toBe('done');
		expect(reviewSync.enqueue).toHaveBeenCalledWith(expect.objectContaining({ deckId: 9, cardId: 1, quality: 4 }));
		expect(state.phase).toBe('done');
		expect(state.reviews).toHaveLength(1);
	});

	it('returns missing-deck and empty session results correctly', async () => {
		const reviewSync = { enqueue: vi.fn().mockResolvedValue(undefined) };
		const decks = { get: vi.fn().mockRejectedValue(new Error('missing')) };
		const study = { start: vi.fn().mockResolvedValue([]) };

		const { createStudySessionModule } = await import('$lib/modules/study-session');
		const module = createStudySessionModule({ deckId: 4, decks, study, reviewSync });

		await expect(module.initialize()).resolves.toBe('missing-deck');
		await expect(module.start('spaced')).resolves.toBe('empty');
	});
});
