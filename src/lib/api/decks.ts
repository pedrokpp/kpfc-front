import { api } from './client';
import type { Deck, DeckDraft } from '$lib/types';

export type DeckInput = DeckDraft;

export const decksApi = {
	list: () => api.get<Deck[]>('/decks'),
	get: (id: number) => api.get<Deck>(`/decks/${id}`),
	create: (data: DeckInput) => api.post<Deck>('/decks', data),
	update: (id: number, data: DeckInput) => api.put<Deck>(`/decks/${id}`, data),
	delete: (id: number) => api.del(`/decks/${id}`),
	upvote: (id: number) => api.post<void>(`/decks/${id}/upvote`),
	listPublic: (sort?: 'upvotes') =>
		api.get<Deck[]>(`/public/decks${sort ? `?sort=${sort}` : ''}`)
};
