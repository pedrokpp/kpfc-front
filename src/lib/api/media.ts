import { api, BASE_URL } from './client';
import type { MediaObject } from '$lib/types';

export const mediaApi = {
	upload: (file: File) => api.upload<MediaObject>('/media', file),
	url: (id: number) => `${BASE_URL}/media/${id}`,
	delete: (id: number) => api.del(`/media/${id}`)
};
