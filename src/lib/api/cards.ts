import { api } from './client';
import type { Card } from '$lib/types';

export interface CardInput {
	title?: string;
	front: string;
	back: string;
	card_type?: 'basic' | 'cloze';
	cloze_index?: number;
	extra?: string;
}

export const cardsApi = {
	list: (deckId: number) => api.get<Card[]>(`/decks/${deckId}/cards`),
	get: (id: number) => api.get<Card>(`/cards/${id}`),
	create: (deckId: number, data: CardInput) => api.post<Card>(`/decks/${deckId}/cards`, data),
	update: (id: number, data: CardInput) => api.put<Card>(`/cards/${id}`, data),
	delete: (id: number) => api.del(`/cards/${id}`)
};
