import { beforeEach, describe, expect, it, vi } from 'vitest';

const goto = vi.fn();
const login = vi.fn();
const register = vi.fn();
const me = vi.fn();
const updateUser = vi.fn();

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto }));
vi.mock('$lib/api/auth', () => ({
	authApi: {
		login,
		register
	}
}));
vi.mock('$lib/api/users', () => ({
	usersApi: {
		me,
		update: updateUser
	}
}));

function installStorage() {
	const store = new Map<string, string>();
	const storage = {
		getItem: vi.fn((key: string) => store.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			store.delete(key);
		}),
		clear: vi.fn(() => {
			store.clear();
		}),
		key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
		get length() {
			return store.size;
		}
	};

	vi.stubGlobal('localStorage', storage);
	return storage;
}

describe('authSession', () => {
	beforeEach(() => {
		goto.mockReset();
		login.mockReset();
		register.mockReset();
		me.mockReset();
		updateUser.mockReset();
		vi.resetModules();
		installStorage();
	});

	it('persists login state and exposes access redirects', async () => {
		login.mockResolvedValue({
			token: 'token-1',
			user: { id: 1, email: 'kp@example.com', display_name: 'KP', login_streak: 3, total_points: 10 }
		});

		const { authSession } = await import('$lib/modules/auth-session');

		await authSession.login('kp@example.com', 'secret');

		expect(authSession.getToken()).toBe('token-1');
		expect(authSession.isAuthenticated()).toBe(true);
		expect(authSession.getAccessRedirect('guest')).toBe('/dashboard');
		expect(JSON.parse(localStorage.getItem('user') ?? '{}').display_name).toBe('KP');
	});

	it('clears state on logout and unauthorized recovery', async () => {
		localStorage.setItem('token', 'token-1');
		localStorage.setItem(
			'user',
			JSON.stringify({ id: 1, email: 'kp@example.com', display_name: 'KP', login_streak: 3, total_points: 10 })
		);

		const { authSession } = await import('$lib/modules/auth-session');

		authSession.logout();
		expect(localStorage.getItem('token')).toBeNull();
		expect(goto).toHaveBeenLastCalledWith('/login');

		localStorage.setItem('token', 'token-2');
		localStorage.setItem(
			'user',
			JSON.stringify({ id: 2, email: 'kp2@example.com', display_name: 'KP2', login_streak: 2, total_points: 20 })
		);

		authSession.handleUnauthorized();
		expect(localStorage.getItem('token')).toBeNull();
		expect(goto).toHaveBeenCalledTimes(2);
		expect(goto).toHaveBeenLastCalledWith('/login');
	});
});
