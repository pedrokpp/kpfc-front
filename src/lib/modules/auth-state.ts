import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { User } from '$lib/types';

export interface AuthState {
	token: string | null;
	user: User | null;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

let unauthorizedHandler: (() => void) | null = null;

function readPersistedState(): AuthState {
	if (!browser) {
		return { token: null, user: null };
	}

	const token = localStorage.getItem(TOKEN_KEY);
	const rawUser = localStorage.getItem(USER_KEY);

	try {
		return {
			token,
			user: rawUser ? (JSON.parse(rawUser) as User) : null
		};
	} catch {
		localStorage.removeItem(USER_KEY);
		return { token, user: null };
	}
}

function persistState(state: AuthState) {
	if (!browser) return;

	if (state.token) {
		localStorage.setItem(TOKEN_KEY, state.token);
	} else {
		localStorage.removeItem(TOKEN_KEY);
	}

	if (state.user) {
		localStorage.setItem(USER_KEY, JSON.stringify(state.user));
	} else {
		localStorage.removeItem(USER_KEY);
	}
}

function createAuthStateModule() {
	const { subscribe, set, update } = writable<AuthState>(readPersistedState());
	let currentState = readPersistedState();

	subscribe((value) => {
		currentState = value;
	});

	function patch(next: AuthState) {
		persistState(next);
		set(next);
	}

	return {
		subscribe,

		getSnapshot() {
			return currentState;
		},

		patch,

		clear() {
			patch({ token: null, user: null });
		},

		mergeUser(user: User) {
			update((state) => {
				const next = { ...state, user };
				persistState(next);
				return next;
			});
		},

		registerUnauthorizedHandler(handler: () => void) {
			unauthorizedHandler = handler;
		},

		handleUnauthorized() {
			this.clear();
			unauthorizedHandler?.();
		}
	};
}

export const authState = createAuthStateModule();
