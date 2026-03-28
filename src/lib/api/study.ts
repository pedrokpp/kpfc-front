import { api } from './client';
import type { Card, StudyMode } from '$lib/types';

export const studyApi = {
	start: (deckId: number, mode: StudyMode) =>
		api.post<Card[]>(`/decks/${deckId}/study`, { mode }),

	review: (cardId: number, quality: number) =>
		api.post<Card>(`/cards/${cardId}/review`, { quality })
};
