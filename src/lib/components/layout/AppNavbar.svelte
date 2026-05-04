<script lang="ts">
	import { authSession as auth } from '$lib/modules/auth-session';
	import { theme } from '$lib/stores/theme';
	import { toasts } from '$lib/stores/toast';
	import { t, locale } from '$lib/i18n';

	function handleLogout() {
		auth.logout();
		toasts.info($t('auth.loggedOutToast'));
	}
</script>

<header class="sticky top-0 z-40 border-b border-secondary/20 bg-background/85 backdrop-blur-xl">
	<nav class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
		<a href={$auth.token ? '/dashboard' : '/'} class="flex items-center gap-3 text-primary">
			<img
				src="/favicon.svg"
				alt="kpfc"
				class="h-10 w-10 rounded-2xl object-contain"
			/>
			<span class="font-go text-lg font-semibold tracking-tight">kpfc</span>
		</a>

		<div class="flex items-center gap-2">
			{#if $auth.token}
				<a href="/dashboard" class="rounded-full px-3 py-1.5 text-sm text-text/70 transition-colors hover:bg-secondary/16 hover:text-text">
					{$t('nav.myDecks')}
				</a>
				<a href="/explore" class="rounded-full px-3 py-1.5 text-sm text-text/70 transition-colors hover:bg-secondary/16 hover:text-text">
					{$t('nav.explore')}
				</a>
				<a href="/profile" class="rounded-full px-3 py-1.5 text-sm text-text/70 transition-colors hover:bg-secondary/16 hover:text-text">
					{$t('nav.profile')}
				</a>
				<button onclick={handleLogout} class="rounded-full px-3 py-1.5 text-sm text-text/55 transition-colors hover:bg-secondary/16 hover:text-text">
					{$t('nav.logout')}
				</button>
			{:else}
				<a href="/explore" class="rounded-full px-3 py-1.5 text-sm text-text/70 transition-colors hover:bg-secondary/16 hover:text-text">
					{$t('nav.explore')}
				</a>
				<a href="/login" class="rounded-full px-3 py-1.5 text-sm text-text/70 transition-colors hover:bg-secondary/16 hover:text-text">
					{$t('nav.login')}
				</a>
				<a href="/register" class="rounded-full bg-primary px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5">
					{$t('nav.register')}
				</a>
			{/if}

			<button
				onclick={() => locale.toggle()}
				aria-label={$t('nav.toggleLanguage')}
				class="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-secondary/20 text-xs font-semibold text-text/65 transition-colors hover:border-secondary/35 hover:text-text"
			>
				{$locale === 'ptBR' ? 'PT' : 'EN'}
			</button>

			<button
				onclick={() => theme.toggle()}
				aria-label={$t('nav.toggleDarkMode')}
				class="flex h-9 w-9 items-center justify-center rounded-full border border-secondary/20 text-text/65 transition-colors hover:border-secondary/35 hover:text-text"
			>
				{#if $theme}
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
					</svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				{/if}
			</button>
		</div>
	</nav>
</header>
