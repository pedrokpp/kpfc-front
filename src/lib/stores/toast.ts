import { writable } from 'svelte/store';
import type { Toast } from '$lib/types';

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function add(message: string, type: Toast['type'], duration = 4000) {
		const id = crypto.randomUUID();
		update((toasts) => [...toasts, { id, message, type }]);
		setTimeout(() => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		}, duration);
	}

	return {
		subscribe,
		success: (message: string) => add(message, 'success'),
		error: (message: string) => add(message, 'error', 6000),
		info: (message: string) => add(message, 'info'),
		dismiss: (id: string) => update((toasts) => toasts.filter((t) => t.id !== id))
	};
}

export const toasts = createToastStore();
