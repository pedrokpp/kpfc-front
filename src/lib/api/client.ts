import { browser } from '$app/environment';
import { auth } from '$lib/stores/auth';
import type { ApiError } from '$lib/types';

export const BASE_URL = browser
	? (import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080/api/v1')
	: 'http://localhost:8080/api/v1';

function getToken(): string | null {
	return browser ? auth.getToken() : null;
}

function authHeaders(): HeadersInit {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
	if (res.status === 401) {
		if (browser) auth.handleUnauthorized();
		throw new Error('Unauthorized');
	}

	if (res.status === 204) return undefined as T;

	const data = await res.json();

	if (!res.ok) {
		throw new Error((data as ApiError).error ?? 'Request failed');
	}

	return data as T;
}

export const api = {
	async get<T>(path: string): Promise<T> {
		const res = await fetch(`${BASE_URL}${path}`, {
			headers: { ...authHeaders() }
		});
		return handleResponse<T>(res);
	},

	async post<T>(path: string, body?: unknown): Promise<T> {
		const res = await fetch(`${BASE_URL}${path}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...authHeaders() },
			body: body !== undefined ? JSON.stringify(body) : undefined
		});
		return handleResponse<T>(res);
	},

	async put<T>(path: string, body?: unknown): Promise<T> {
		const res = await fetch(`${BASE_URL}${path}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', ...authHeaders() },
			body: body !== undefined ? JSON.stringify(body) : undefined
		});
		return handleResponse<T>(res);
	},

	async del(path: string): Promise<void> {
		const res = await fetch(`${BASE_URL}${path}`, {
			method: 'DELETE',
			headers: { ...authHeaders() }
		});
		return handleResponse<void>(res);
	},

	async upload<T>(path: string, file: File): Promise<T> {
		const formData = new FormData();
		formData.append('file', file);
		const res = await fetch(`${BASE_URL}${path}`, {
			method: 'POST',
			headers: { ...authHeaders() },
			body: formData
		});
		return handleResponse<T>(res);
	}
};
