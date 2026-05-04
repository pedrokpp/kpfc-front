export interface User {
	id: number;
	email: string;
	display_name: string;
	login_streak: number;
	total_points: number;
}

export interface Deck {
	id: number;
	user_id: number;
	title: string;
	description: string;
	is_public: boolean;
	upvote_count: number;
	created_at: string;
	updated_at: string;
}

export interface DeckDraft {
	title: string;
	description: string;
	is_public: boolean;
}

export type CardType = 'basic' | 'cloze';

export interface Card {
	id: number;
	deck_id: number;
	title: string;
	front: string;
	back: string;
	card_type: CardType;
	cloze_index: number;
	extra: string;
	interval: number;
	repetitions: number;
	ease_factor: number;
	next_review_at: string;
	created_at: string;
	updated_at: string;
}

export interface ApiError {
	error: string;
}

export type StudyMode = 'spaced' | 'random';

export interface QueuedReview {
	id: string;
	deckId: number;
	cardId: number;
	quality: number;
	createdAt: string;
}

export interface DeckReviewSyncState {
	pendingCount: number;
	syncStatus: 'idle' | 'syncing' | 'degraded';
	lastSyncError: string | null;
}

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
}

export interface MediaObject {
	id: number;
	public_id: string;
	filename: string;
	content_type: string;
	size: number;
	url: string;
}
