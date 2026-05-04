import type { MessageKey } from '$lib/i18n/locales/enUS';

export const siteConfig = {
	name: 'kpfc',
	url: 'https://flashcards.kpp.dev',
	repository: 'https://github.com/pedrokpp/kpfc-front',
	email: 'mailto:pedrkp@proton.me'
};

export const publicNavigation = [
	{ labelKey: 'publicNav.studySession', href: '/#study-session' },
	{ labelKey: 'publicNav.community', href: '/#comunidade' },
	{ labelKey: 'publicNav.explore', href: '/explore' }
] as const satisfies ReadonlyArray<{ labelKey: MessageKey; href: string }>;

export const welcomeSignals = [
	{
		labelKey: 'welcome.signalSm2Label',
		descriptionKey: 'welcome.signalSm2Description'
	},
	{
		labelKey: 'welcome.signalDecksLabel',
		descriptionKey: 'welcome.signalDecksDescription'
	},
	{
		labelKey: 'welcome.signalSessionLabel',
		descriptionKey: 'welcome.signalSessionDescription'
	}
] as const satisfies ReadonlyArray<{ labelKey: MessageKey; descriptionKey: MessageKey }>;

export const welcomeStudyModes = [
	{
		nameKey: 'welcome.studyModeSpacedName',
		descriptionKey: 'welcome.studyModeSpacedDescription',
		accent: 'bg-primary text-background'
	},
	{
		nameKey: 'welcome.studyModeRandomName',
		descriptionKey: 'welcome.studyModeRandomDescription',
		accent: 'bg-secondary/30 text-text'
	}
] as const satisfies ReadonlyArray<{ nameKey: MessageKey; descriptionKey: MessageKey; accent: string }>;
