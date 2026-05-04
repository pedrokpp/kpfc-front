import { writable } from 'svelte/store';
import { ApiRequestError } from '$lib/api/client';
import { cardsApi, type CardInput } from '$lib/api/cards';
import { decksApi } from '$lib/api/decks';
import type { Card, Deck, DeckDraft } from '$lib/types';

interface DeckDetailState {
	deck: Deck | null;
	cards: Card[];
	dueCount: number;
	loading: boolean;
	saving: boolean;
}

function countDueCards(cards: Card[]) {
	return cards.filter((card) => new Date(card.next_review_at) <= new Date()).length;
}

function createDefaultState(): DeckDetailState {
	return {
		deck: null,
		cards: [],
		dueCount: 0,
		loading: true,
		saving: false
	};
}

export function createDeckDetailModule(deckId: number) {
	const { subscribe, update } = writable<DeckDetailState>(createDefaultState());

	function patch(mutator: (state: DeckDetailState) => DeckDetailState) {
		update((state) => mutator(state));
	}

	function replaceCards(cards: Card[]) {
		patch((state) => ({ ...state, cards, dueCount: countDueCards(cards) }));
	}

	return {
		subscribe,

		async initialize(): Promise<'ready' | 'missing-deck'> {
			patch((state) => ({ ...state, loading: true }));
			try {
				const [deck, cards] = await Promise.all([decksApi.get(deckId), cardsApi.list(deckId)]);
				patch((state) => ({
					...state,
					deck,
					cards,
					dueCount: countDueCards(cards)
				}));
				return 'ready';
			} catch (error) {
				if (error instanceof ApiRequestError && error.status === 404) {
					return 'missing-deck';
				}
				throw error;
			} finally {
				patch((state) => ({ ...state, loading: false }));
			}
		},

		async updateDeck(input: DeckDraft) {
			patch((state) => ({ ...state, saving: true }));
			try {
				const deck = await decksApi.update(deckId, input);
				patch((state) => ({ ...state, deck }));
				return deck;
			} finally {
				patch((state) => ({ ...state, saving: false }));
			}
		},

		async createCard(input: CardInput) {
			patch((state) => ({ ...state, saving: true }));
			try {
				const card = await cardsApi.create(deckId, input);
				update((state) => {
					const cards = [...state.cards, card];
					return { ...state, cards, dueCount: countDueCards(cards) };
				});
				return card;
			} finally {
				patch((state) => ({ ...state, saving: false }));
			}
		},

		async updateCard(cardId: number, input: CardInput) {
			patch((state) => ({ ...state, saving: true }));
			try {
				const card = await cardsApi.update(cardId, input);
				update((state) => {
					const cards = state.cards.map((item) => (item.id === card.id ? card : item));
					return { ...state, cards, dueCount: countDueCards(cards) };
				});
				return card;
			} finally {
				patch((state) => ({ ...state, saving: false }));
			}
		},

		async removeCard(cardId: number) {
			patch((state) => ({ ...state, saving: true }));
			try {
				await cardsApi.delete(cardId);
				update((state) => {
					const cards = state.cards.filter((item) => item.id !== cardId);
					return { ...state, cards, dueCount: countDueCards(cards) };
				});
			} finally {
				patch((state) => ({ ...state, saving: false }));
			}
		},

		replaceCards
	};
}
