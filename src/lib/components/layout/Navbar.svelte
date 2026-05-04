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

<header class="border-b border-secondary/20 bg-background/90 backdrop-blur-sm sticky top-0 z-40">
	<nav class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
		<a href={$auth.token ? '/dashboard' : '/'} class="text-primary font-bold text-lg tracking-tight font-go">
			kpfc
		</a>

		<div class="flex items-center gap-2">
			{#if $auth.token}
				<a
					href="/dashboard"
					class="text-sm text-text/70 hover:text-text px-3 py-1.5 rounded-md transition-colors"
				>
					{$t('nav.myDecks')}
				</a>
				<a
					href="/explore"
					class="text-sm text-text/70 hover:text-text px-3 py-1.5 rounded-md transition-colors"
				>
					{$t('nav.explore')}
				</a>
				<a
					href="/profile"
					class="text-sm text-text/70 hover:text-text px-3 py-1.5 rounded-md transition-colors"
				>
					{$t('nav.profile')}
				</a>
				<button
					onclick={handleLogout}
					class="text-sm text-text/50 hover:text-text px-3 py-1.5 rounded-md transition-colors"
				>
					{$t('nav.logout')}
				</button>
			{:else}
				<a
					href="/explore"
					class="text-sm text-text/70 hover:text-text px-3 py-1.5 rounded-md transition-colors"
				>
					{$t('nav.explore')}
				</a>
				<a
					href="/login"
					class="text-sm text-text/70 hover:text-text px-3 py-1.5 rounded-md transition-colors"
				>
					{$t('nav.login')}
				</a>
				<a
					href="/register"
					class="text-sm bg-primary text-background px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
				>
					{$t('nav.register')}
				</a>
			{/if}

			<button
				onclick={() => locale.toggle()}
				aria-label={$t('nav.toggleLanguage')}
				class="ml-1 w-8 h-8 flex items-center justify-center rounded-md text-text/60 hover:text-text hover:bg-secondary/20 transition-colors text-xs font-semibold"
			>
				{$locale === 'ptBR' ? 'PT' : 'EN'}
			</button>

			<button
				onclick={() => theme.toggle()}
				aria-label={$t('nav.toggleDarkMode')}
				class="w-8 h-8 flex items-center justify-center rounded-md text-text/60 hover:text-text hover:bg-secondary/20 transition-colors"
			>
				{#if $theme}
					<!-- Sun icon -->
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="4"/>
						<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
					</svg>
				{:else}
					<!-- Moon icon -->
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
					</svg>
				{/if}
			</button>
		</div>
	</nav>
</header>
