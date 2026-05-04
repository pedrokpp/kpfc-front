import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { writable } from 'svelte/store';
import { authApi } from '$lib/api/auth';
import { usersApi } from '$lib/api/users';
import type { User } from '$lib/types';

interface AuthState {
	token: string | null;
	user: User | null;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

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

function createAuthSessionModule() {
	const { subscribe, set, update } = writable<AuthState>(readPersistedState());
	let currentState = readPersistedState();

	subscribe((value) => {
		currentState = value;
	});

	function patch(next: AuthState) {
		persistState(next);
		set(next);
	}

	function mergeUser(user: User) {
		update((state) => {
			const next = { ...state, user };
			persistState(next);
			return next;
		});
	}

	return {
		subscribe,

		getToken() {
			return currentState.token;
		},

		isAuthenticated() {
			return Boolean(currentState.token);
		},

		async login(email: string, password: string) {
			const result = await authApi.login(email, password);
			patch({ token: result.token, user: result.user });
			return result.user;
		},

		async registerAndLogin(email: string, password: string, displayName?: string) {
			await authApi.register(email, password, displayName);
			return this.login(email, password);
		},

		async refreshUser() {
			const user = await usersApi.me();
			mergeUser(user);
			return user;
		},

		async updateDisplayName(displayName: string) {
			const user = await usersApi.update(displayName);
			mergeUser(user);
			return user;
		},

		logout(redirectTo = '/login') {
			patch({ token: null, user: null });
			if (browser) {
				goto(redirectTo);
			}
		},

		handleUnauthorized() {
			patch({ token: null, user: null });
			if (browser) {
				goto('/login');
			}
		}
	};
}

export const authSession = createAuthSessionModule();
