import { beforeEach, describe, expect, it, vi } from 'vitest';

const getDeck = vi.fn();
const updateDeck = vi.fn();
const listCards = vi.fn();
const createCard = vi.fn();
const updateCard = vi.fn();
const deleteCard = vi.fn();

vi.mock('$lib/api/decks', async () => {
	const actual = await vi.importActual<typeof import('$lib/api/decks')>('$lib/api/decks');
	return {
		...actual,
		decksApi: {
			...actual.decksApi,
			get: getDeck,
			update: updateDeck
		}
	};
});

vi.mock('$lib/api/cards', async () => {
	const actual = await vi.importActual<typeof import('$lib/api/cards')>('$lib/api/cards');
	return {
		...actual,
		cardsApi: {
			...actual.cardsApi,
			list: listCards,
			create: createCard,
			update: updateCard,
			delete: deleteCard
		}
	};
});

describe('deckDetail module', () => {
	beforeEach(() => {
		getDeck.mockReset();
		updateDeck.mockReset();
		listCards.mockReset();
		createCard.mockReset();
		updateCard.mockReset();
		deleteCard.mockReset();
		vi.resetModules();
	});

	it('loads one deck and reconciles its cards', async () => {
		const deck = {
			id: 7,
			user_id: 1,
			title: 'Algorithms',
			description: '',
			is_public: false,
			upvote_count: 0,
			created_at: '',
			updated_at: ''
		};
		const cardA = {
			id: 11,
			deck_id: 7,
			title: 'A',
			front: 'A',
			back: 'A',
			card_type: 'basic' as const,
			cloze_index: 0,
			extra: '',
			interval: 1,
			repetitions: 1,
			ease_factor: 2.5,
			next_review_at: new Date(Date.now() - 1_000).toISOString(),
			created_at: '',
			updated_at: ''
		};
		const cardB = { ...cardA, id: 12, title: 'B', next_review_at: new Date(Date.now() + 86_400_000).toISOString() };

		getDeck.mockResolvedValue(deck);
		listCards.mockResolvedValue([cardA]);
		createCard.mockResolvedValue(cardB);
		updateCard.mockResolvedValue({ ...cardA, title: 'Updated A' });
		deleteCard.mockResolvedValue(undefined);
		updateDeck.mockResolvedValue({ ...deck, title: 'Algorithms 2' });

		const { createDeckDetailModule } = await import('$lib/modules/deck-detail');
		const module = createDeckDetailModule(7);
		let state: any;
		module.subscribe((value) => {
			state = value;
		});

		await expect(module.initialize()).resolves.toBe('ready');
		expect(state.deck.title).toBe('Algorithms');
		expect(state.dueCount).toBe(1);

		await module.createCard({ front: 'B', back: 'B' });
		expect(state.cards).toHaveLength(2);

		await module.updateCard(11, { front: 'A', back: 'A' });
		expect(state.cards.find((card: any) => card.id === 11).title).toBe('Updated A');

		await module.removeCard(12);
		expect(state.cards.map((card: any) => card.id)).toEqual([11]);

		await module.updateDeck({ title: 'Algorithms 2', description: '', is_public: false });
		expect(state.deck.title).toBe('Algorithms 2');
	});

	it('returns missing-deck on 404', async () => {
		const { ApiRequestError } = await import('$lib/api/client');
		getDeck.mockRejectedValue(new ApiRequestError(404, 'not found'));

		const { createDeckDetailModule } = await import('$lib/modules/deck-detail');
		const module = createDeckDetailModule(99);

		await expect(module.initialize()).resolves.toBe('missing-deck');
	});
});
