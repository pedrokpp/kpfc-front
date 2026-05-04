import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Card, Deck, QueuedReview, StudyMode } from '$lib/types';

export type StudyPhase = 'select' | 'studying' | 'done';

interface ReviewRecord {
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
}

interface DeckAdapter {
	get(id: number): Promise<Deck>;
}

interface StudyAdapter {
	start(deckId: number, mode: StudyMode): Promise<Card[]>;
}

interface ReviewSyncAdapter {
	enqueue(review: QueuedReview): Promise<void>;
}

interface StudySessionModuleOptions {
	deckId: number;
	decks: DeckAdapter;
	study: StudyAdapter;
	reviewSync: ReviewSyncAdapter;
}

type InitializeResult = 'ready' | 'offline-resumed' | 'missing-deck';
type StartResult = 'started' | 'empty';
type RateResult = 'advanced' | 'done';

const SESSION_KEY_PREFIX = 'kpfc.study-session';
const STORAGE_VERSION = 1;

function createDefaultState(): StudySessionState {
	return {
		deck: null,
		mode: null,
		phase: 'select',
		cards: [],
		currentIndex: 0,
		revealed: false,
		reviews: []
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

function newReviewId() {
	return browser && typeof crypto.randomUUID === 'function'
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createStudySessionModule({ deckId, decks, study, reviewSync }: StudySessionModuleOptions) {
	const restored = readSession(deckId);
	const { subscribe, update } = writable<StudySessionState>({
		...createDefaultState(),
		deck: restored?.deck ?? null,
		mode: restored?.mode ?? null,
		phase: restored?.phase ?? 'select',
		cards: restored?.cards ?? [],
		currentIndex: restored?.currentIndex ?? 0,
		revealed: restored?.revealed ?? false,
		reviews: restored?.reviews ?? []
	});

	let currentState: StudySessionState = {
		...createDefaultState(),
		deck: restored?.deck ?? null,
		mode: restored?.mode ?? null,
		phase: restored?.phase ?? 'select',
		cards: restored?.cards ?? [],
		currentIndex: restored?.currentIndex ?? 0,
		revealed: restored?.revealed ?? false,
		reviews: restored?.reviews ?? []
	};

	subscribe((value) => {
		currentState = value;
	});

	function patch(mutator: (state: StudySessionState) => StudySessionState) {
		update((state) => {
			const next = mutator(state);
			writeSession(deckId, next);
			return next;
		});
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

				return 'offline-resumed';
			}

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
				reviews: []
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
				createdAt: new Date().toISOString()
			};

			await reviewSync.enqueue({
				id: review.id,
				deckId,
				cardId: review.cardId,
				quality: review.quality,
				createdAt: review.createdAt
			});

			const isLastCard = currentState.currentIndex + 1 >= currentState.cards.length;

			patch((state) => ({
				...state,
				reviews: [...state.reviews, review],
				currentIndex: isLastCard ? state.currentIndex : state.currentIndex + 1,
				revealed: false,
				phase: isLastCard ? 'done' : 'studying'
			}));

			return isLastCard ? 'done' : 'advanced';
		}
	};
}
