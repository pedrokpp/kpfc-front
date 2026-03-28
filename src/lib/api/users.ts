import { api } from './client';
import type { User } from '$lib/types';

export const usersApi = {
	me: () => api.get<User>('/users/me'),
	update: (display_name: string) => api.put<User>('/users/me', { display_name })
};
