import { writable } from 'svelte/store';
import { decksApi } from '$lib/api/decks';
import type { Deck } from '$lib/types';

interface PublicDecksState {
	decks: Deck[];
	loading: boolean;
	sort: 'upvotes' | '';
	upvotingId: number | null;
}

function createDefaultState(): PublicDecksState {
	return {
		decks: [],
		loading: true,
		sort: 'upvotes',
		upvotingId: null
	};
}

export function createPublicDecksModule() {
	const { subscribe, update } = writable<PublicDecksState>(createDefaultState());
	let currentSort: 'upvotes' | '' = 'upvotes';

	function patch(mutator: (state: PublicDecksState) => PublicDecksState) {
		update((state) => {
			const next = mutator(state);
			currentSort = next.sort;
			return next;
		});
	}

	async function loadDecks() {
		patch((state) => ({ ...state, loading: true }));
		try {
			const decks = await decksApi.listPublic(currentSort || undefined);
			patch((state) => ({ ...state, decks }));
		} finally {
			patch((state) => ({ ...state, loading: false }));
		}
	}

	return {
		subscribe,

		async initialize() {
			await loadDecks();
		},

		async setSort(sort: 'upvotes' | '') {
			patch((state) => ({ ...state, sort }));
			await loadDecks();
		},

		async toggleUpvote(deckId: number) {
			patch((state) => ({ ...state, upvotingId: deckId }));
			try {
				await decksApi.upvote(deckId);
				await loadDecks();
			} finally {
				patch((state) => ({ ...state, upvotingId: null }));
			}
		}
	};
}
