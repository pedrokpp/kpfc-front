import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { authApi } from '$lib/api/auth';
import { usersApi } from '$lib/api/users';
import { authState } from '$lib/modules/auth-state';

function createAuthSessionModule() {
	authState.registerUnauthorizedHandler(() => {
		if (browser) {
			goto('/login');
		}
	});

	return {
		subscribe: authState.subscribe,

		getToken() {
			return authState.getSnapshot().token;
		},

		getUser() {
			return authState.getSnapshot().user;
		},

		isAuthenticated() {
			return Boolean(authState.getSnapshot().token);
		},

		getAccessRedirect(mode: 'guest' | 'authenticated') {
			if (!browser) return null;

			const isAuthenticated = this.isAuthenticated();
			if (mode === 'guest' && isAuthenticated) {
				return '/dashboard';
			}

			if (mode === 'authenticated' && !isAuthenticated) {
				return '/login';
			}

			return null;
		},

		async login(email: string, password: string) {
			const result = await authApi.login(email, password);
			authState.patch({ token: result.token, user: result.user });
			return result.user;
		},

		async registerAndLogin(email: string, password: string, displayName?: string) {
			await authApi.register(email, password, displayName);
			return this.login(email, password);
		},

		async refreshUser() {
			const user = await usersApi.me();
			authState.mergeUser(user);
			return user;
		},

		async updateDisplayName(displayName: string) {
			const user = await usersApi.update(displayName);
			authState.mergeUser(user);
			return user;
		},

		logout(redirectTo = '/login') {
			authState.clear();
			if (browser) {
				goto(redirectTo);
			}
		},

		handleUnauthorized() {
			authState.handleUnauthorized();
		}
	};
}

export const authSession = createAuthSessionModule();
