import { api } from './client';
import type { User } from '$lib/types';

export interface LoginResponse {
	token: string;
	user: User;
}

export interface RegisterResponse {
	id: number;
	email: string;
	display_name: string;
}

export const authApi = {
	login: (email: string, password: string) =>
		api.post<LoginResponse>('/auth/login', { email, password }),

	register: (email: string, password: string, display_name?: string) =>
		api.post<RegisterResponse>('/auth/register', { email, password, display_name })
};
