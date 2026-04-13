import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';
import enUS, { type MessageKey, type Messages } from './locales/enUS';
import ptBR from './locales/ptBR';

export type Locale = 'ptBR' | 'enUS';

const locales: Record<Locale, Messages> = { ptBR, enUS };

function createLocaleStore() {
	const initial: Locale = browser ? ((localStorage.getItem('locale') as Locale) ?? 'ptBR') : 'ptBR';
	const { subscribe, update } = writable<Locale>(initial);

	return {
		subscribe,
		update,
		toggle() {
			update((l) => {
				const next = l === 'ptBR' ? 'enUS' : 'ptBR';
				if (browser) localStorage.setItem('locale', next);
				return next;
			});
		}
	};
}

export const locale = createLocaleStore();

export const t = derived(locale, ($locale) => {
	const msgs = locales[$locale];
	return (key: MessageKey, params?: Record<string, string | number>): string => {
		let str: string = msgs[key] ?? key;
		if (params) {
			for (const [k, v] of Object.entries(params)) {
				str = str.replace(`{${k}}`, String(v));
			}
		}
		return str;
	};
});
