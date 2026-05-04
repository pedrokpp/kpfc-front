import { writable } from 'svelte/store';
import { decksApi } from '$lib/api/decks';
import type { Deck, DeckDraft } from '$lib/types';

interface UserDecksState {
	decks: Deck[];
	loading: boolean;
	saving: boolean;
}

function createDefaultState(): UserDecksState {
	return {
		decks: [],
		loading: true,
		saving: false
	};
}

export function createUserDecksModule() {
	const { subscribe, update } = writable<UserDecksState>(createDefaultState());

	function patch(mutator: (state: UserDecksState) => UserDecksState) {
		update((state) => mutator(state));
	}

	return {
		subscribe,

		async initialize() {
			patch((state) => ({ ...state, loading: true }));
			try {
				const decks = await decksApi.list();
				patch((state) => ({ ...state, decks }));
			} finally {
				patch((state) => ({ ...state, loading: false }));
			}
		},

		async create(input: DeckDraft) {
			patch((state) => ({ ...state, saving: true }));
			try {
				const deck = await decksApi.create(input);
				patch((state) => ({ ...state, decks: [deck, ...state.decks] }));
				return deck;
			} finally {
				patch((state) => ({ ...state, saving: false }));
			}
		},

		async update(id: number, input: DeckDraft) {
			patch((state) => ({ ...state, saving: true }));
			try {
				const deck = await decksApi.update(id, input);
				patch((state) => ({
					...state,
					decks: state.decks.map((item) => (item.id === deck.id ? deck : item))
				}));
				return deck;
			} finally {
				patch((state) => ({ ...state, saving: false }));
			}
		},

		async remove(id: number) {
			patch((state) => ({ ...state, saving: true }));
			try {
				await decksApi.delete(id);
				patch((state) => ({
					...state,
					decks: state.decks.filter((item) => item.id !== id)
				}));
			} finally {
				patch((state) => ({ ...state, saving: false }));
			}
		}
	};
}
