import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '$lib/types';

interface AuthState {
	token: string | null;
	user: User | null;
}

function createAuthStore() {
	const initial: AuthState = browser
		? {
				token: localStorage.getItem('token'),
				user: (() => {
					const raw = localStorage.getItem('user');
					return raw ? JSON.parse(raw) : null;
				})()
			}
		: { token: null, user: null };

	const { subscribe, set, update } = writable<AuthState>(initial);

	return {
		subscribe,
		login(token: string, user: User) {
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			set({ token, user });
		},
		updateUser(user: User) {
			localStorage.setItem('user', JSON.stringify(user));
			update((s) => ({ ...s, user }));
		},
		logout() {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			set({ token: null, user: null });
		}
	};
}

export const auth = createAuthStore();
