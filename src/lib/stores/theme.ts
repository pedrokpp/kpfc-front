import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
	const initial = browser
		? localStorage.getItem('theme') === 'dark' ||
			(!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
		: false;

	const { subscribe, set } = writable<boolean>(initial);

	return {
		subscribe,
		toggle() {
			set(
				(() => {
					const isDark = !document.documentElement.classList.contains('dark');
					if (isDark) {
						document.documentElement.classList.add('dark');
						localStorage.setItem('theme', 'dark');
					} else {
						document.documentElement.classList.remove('dark');
						localStorage.setItem('theme', 'light');
					}
					return isDark;
				})()
			);
		},
		init() {
			if (!browser) return;
			const isDark = document.documentElement.classList.contains('dark');
			set(isDark);
		}
	};
}

export const theme = createThemeStore();
