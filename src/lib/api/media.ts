import { api, BASE_URL } from './client';
import type { MediaObject } from '$lib/types';

export const mediaApi = {
	upload: (file: File) => api.upload<MediaObject>('/media', file),
	url: (publicId: string) => `${BASE_URL}/media/${publicId}`,
	delete: (publicId: string) => api.del(`/media/${publicId}`)
};
