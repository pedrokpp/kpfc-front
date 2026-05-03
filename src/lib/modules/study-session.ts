import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Card, Deck, StudyMode } from '$lib/types';

export type StudyPhase = 'select' | 'studying' | 'done';
type SyncStatus = 'idle' | 'syncing' | 'degraded';

interface ReviewRecord {
	id: string;
	cardId: number;
	quality: number;
	synced: boolean;
	createdAt: string;
}

interface PendingReview {
	id: string;
	cardId: number;
	quality: number;
	createdAt: string;
}

interface PersistedStudySession {
	version: 1;
	deckId: number;
	deck: Deck | null;
	mode: StudyMode | null;
	phase: StudyPhase;
	cards: Card[];
	currentIndex: number;
	revealed: boolean;
	reviews: ReviewRecord[];
}

interface StudySessionState {
	deck: Deck | null;
	mode: StudyMode | null;
	phase: StudyPhase;
	cards: Card[];
	currentIndex: number;
	revealed: boolean;
	reviews: ReviewRecord[];
	pendingCount: number;
	syncStatus: SyncStatus;
	lastSyncError: string | null;
}

interface DeckAdapter {
	get(id: number): Promise<Deck>;
}

interface StudyAdapter {
	start(deckId: number, mode: StudyMode): Promise<Card[]>;
	review(cardId: number, quality: number): Promise<Card>;
}

interface StudySessionModuleOptions {
	deckId: number;
	decks: DeckAdapter;
	study: StudyAdapter;
}

type InitializeResult = 'ready' | 'offline-resumed' | 'missing-deck';
type StartResult = 'started' | 'empty';
type RateResult = 'advanced' | 'done';

const SESSION_KEY_PREFIX = 'kpfc.study-session';
const REVIEW_QUEUE_KEY = 'kpfc.study-review-queue';
const STORAGE_VERSION = 1;

function createDefaultState(): StudySessionState {
	return {
		deck: null,
		mode: null,
		phase: 'select',
		cards: [],
		currentIndex: 0,
		revealed: false,
		reviews: [],
		pendingCount: 0,
		syncStatus: 'idle',
		lastSyncError: null
	};
}

function isStudyMode(value: unknown): value is StudyMode {
	return value === 'spaced' || value === 'random';
}

function isStudyPhase(value: unknown): value is StudyPhase {
	return value === 'select' || value === 'studying' || value === 'done';
}

function readSession(deckId: number): PersistedStudySession | null {
	if (!browser) return null;

	try {
		const raw = localStorage.getItem(`${SESSION_KEY_PREFIX}.${deckId}`);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<PersistedStudySession>;
		if (
			parsed.version !== STORAGE_VERSION ||
			parsed.deckId !== deckId ||
			!isStudyPhase(parsed.phase) ||
			(parsed.mode !== null && !isStudyMode(parsed.mode))
		) {
			return null;
		}

		return {
			version: STORAGE_VERSION,
			deckId,
			deck: parsed.deck ?? null,
			mode: parsed.mode ?? null,
			phase: parsed.phase,
			cards: Array.isArray(parsed.cards) ? parsed.cards : [],
			currentIndex:
				typeof parsed.currentIndex === 'number' && parsed.currentIndex >= 0 ? parsed.currentIndex : 0,
			revealed: Boolean(parsed.revealed),
			reviews: Array.isArray(parsed.reviews) ? parsed.reviews : []
		};
	} catch {
		return null;
	}
}

function writeSession(deckId: number, state: StudySessionState) {
	if (!browser) return;

	const payload: PersistedStudySession = {
		version: STORAGE_VERSION,
		deckId,
		deck: state.deck,
		mode: state.mode,
		phase: state.phase,
		cards: state.cards,
		currentIndex: state.currentIndex,
		revealed: state.revealed,
		reviews: state.reviews
	};

	localStorage.setItem(`${SESSION_KEY_PREFIX}.${deckId}`, JSON.stringify(payload));
}

function readPendingReviews(): PendingReview[] {
	if (!browser) return [];

	try {
		const raw = localStorage.getItem(REVIEW_QUEUE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writePendingReviews(queue: PendingReview[]) {
	if (!browser) return;
	localStorage.setItem(REVIEW_QUEUE_KEY, JSON.stringify(queue));
}

function newReviewId() {
	return browser && typeof crypto.randomUUID === 'function'
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createStudySessionModule({ deckId, decks, study }: StudySessionModuleOptions) {
	const restored = readSession(deckId);
	const { subscribe, update } = writable<StudySessionState>({
		...createDefaultState(),
		deck: restored?.deck ?? null,
		mode: restored?.mode ?? null,
		phase: restored?.phase ?? 'select',
		cards: restored?.cards ?? [],
		currentIndex: restored?.currentIndex ?? 0,
		revealed: restored?.revealed ?? false,
		reviews: restored?.reviews ?? [],
		pendingCount: readPendingReviews().length
	});

	let currentState: StudySessionState = {
		...createDefaultState(),
		deck: restored?.deck ?? null,
		mode: restored?.mode ?? null,
		phase: restored?.phase ?? 'select',
		cards: restored?.cards ?? [],
		currentIndex: restored?.currentIndex ?? 0,
		revealed: restored?.revealed ?? false,
		reviews: restored?.reviews ?? [],
		pendingCount: readPendingReviews().length
	};

	subscribe((value) => {
		currentState = value;
	});

	let syncing = false;

	function patch(mutator: (state: StudySessionState) => StudySessionState) {
		update((state) => {
			const next = mutator(state);
			writeSession(deckId, next);
			return next;
		});
	}

	function setPendingCount() {
		const pendingCount = readPendingReviews().length;
		patch((state) => ({ ...state, pendingCount }));
	}

	async function flushPendingReviews() {
		if (!browser || syncing) return;

		const queue = readPendingReviews();
		if (queue.length === 0) {
			patch((state) => ({ ...state, pendingCount: 0, syncStatus: 'idle', lastSyncError: null }));
			return;
		}

		syncing = true;
		patch((state) => ({ ...state, pendingCount: queue.length, syncStatus: 'syncing', lastSyncError: null }));

		let remaining = queue;

		try {
			for (const pending of queue) {
				const updatedCard = await study.review(pending.cardId, pending.quality);
				remaining = remaining.filter((item) => item.id !== pending.id);
				writePendingReviews(remaining);

				patch((state) => ({
					...state,
					cards: state.cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
					reviews: state.reviews.map((review) =>
						review.id === pending.id ? { ...review, synced: true } : review
					),
					pendingCount: remaining.length
				}));
			}

			patch((state) => ({ ...state, syncStatus: 'idle', lastSyncError: null, pendingCount: 0 }));
		} catch (error) {
			patch((state) => ({
				...state,
				syncStatus: 'degraded',
				lastSyncError: error instanceof Error ? error.message : 'sync_failed',
				pendingCount: remaining.length
			}));
		} finally {
			syncing = false;
		}
	}

	function clearSession() {
		patch((state) => ({
			...state,
			mode: null,
			phase: 'select',
			cards: [],
			currentIndex: 0,
			revealed: false,
			reviews: []
		}));
	}

	return {
		subscribe,

		async initialize(): Promise<InitializeResult> {
			try {
				const deck = await decks.get(deckId);
				patch((state) => ({ ...state, deck }));
			} catch {
				if (!currentState.deck || currentState.cards.length === 0) {
					return 'missing-deck';
				}

				patch((state) => ({
					...state,
					syncStatus: state.pendingCount > 0 ? 'degraded' : state.syncStatus,
					lastSyncError: state.pendingCount > 0 ? 'offline_session' : state.lastSyncError
				}));

				void flushPendingReviews();
				return 'offline-resumed';
			}

			void flushPendingReviews();
			return 'ready';
		},

		async start(mode: StudyMode): Promise<StartResult> {
			const cards = await study.start(deckId, mode);
			if (cards.length === 0) {
				clearSession();
				return 'empty';
			}

			patch((state) => ({
				...state,
				mode,
				phase: 'studying',
				cards,
				currentIndex: 0,
				revealed: false,
				reviews: [],
				lastSyncError: null
			}));

			return 'started';
		},

		reveal() {
			patch((state) => ({ ...state, revealed: true }));
		},

		async rate(quality: number): Promise<RateResult> {
			const card = currentState.cards[currentState.currentIndex];
			if (!card) return currentState.phase === 'done' ? 'done' : 'advanced';

			const review: ReviewRecord = {
				id: newReviewId(),
				cardId: card.id,
				quality,
				synced: false,
				createdAt: new Date().toISOString()
			};

			const queue = [
				...readPendingReviews(),
				{
					id: review.id,
					cardId: review.cardId,
					quality: review.quality,
					createdAt: review.createdAt
				}
			];
			writePendingReviews(queue);

			const isLastCard = currentState.currentIndex + 1 >= currentState.cards.length;

			patch((state) => ({
				...state,
				reviews: [...state.reviews, review],
				currentIndex: isLastCard ? state.currentIndex : state.currentIndex + 1,
				revealed: false,
				phase: isLastCard ? 'done' : 'studying',
				pendingCount: queue.length,
				syncStatus: queue.length > 0 ? 'syncing' : state.syncStatus
			}));

			void flushPendingReviews();
			return isLastCard ? 'done' : 'advanced';
		},

		async retrySync() {
			await flushPendingReviews();
		}
	};
}
