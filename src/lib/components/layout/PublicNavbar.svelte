<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { locale, t } from '$lib/i18n';
	import { publicNavigation, siteConfig } from '$lib/content/site';
	let menuOpen = $state(false);
</script>

<header class="sticky top-0 z-40 border-b border-secondary/15 bg-background/80 backdrop-blur-xl">
	<nav class="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
		<a href="/" class="flex items-center gap-3 text-primary">
			<img
				src="/favicon.svg"
				alt="kpfc"
				class="h-11 w-11 rounded-2xl object-contain shadow-[0_14px_40px_rgba(18,32,51,0.18)]"
			/>
			<span class="font-go text-lg font-bold tracking-tight">{siteConfig.name}</span>
		</a>

		<div class="hidden items-center gap-2 lg:flex">
			{#each publicNavigation as item}
				<a href={item.href} class="rounded-full px-4 py-2 text-sm text-text/70 transition-colors hover:bg-secondary/14 hover:text-text">
					{$t(item.labelKey)}
				</a>
			{/each}
		</div>

		<div class="hidden items-center gap-2 lg:flex">
			<a href="/login" class="rounded-full px-4 py-2 text-sm text-text/70 transition-colors hover:bg-secondary/14 hover:text-text">
				{$t('nav.login')}
			</a>
			<a href="/register" class="rounded-full bg-primary px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5">
				{$t('nav.register')}
			</a>
			<button
				onclick={() => locale.toggle()}
				aria-label={$t('nav.toggleLanguage')}
				class="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/20 text-xs font-semibold text-text/65 transition-colors hover:border-secondary/35 hover:text-text"
			>
				{$locale === 'ptBR' ? 'PT' : 'EN'}
			</button>
			<button
				onclick={() => theme.toggle()}
				aria-label={$t('nav.toggleDarkMode')}
				class="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/20 text-text/65 transition-colors hover:border-secondary/35 hover:text-text"
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

		<div class="flex items-center gap-2 lg:hidden">
			<button
				onclick={() => locale.toggle()}
				aria-label={$t('nav.toggleLanguage')}
				class="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/20 text-xs font-semibold text-text/65"
			>
				{$locale === 'ptBR' ? 'PT' : 'EN'}
			</button>
			<button
				onclick={() => theme.toggle()}
				aria-label={$t('nav.toggleDarkMode')}
				class="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/20 text-text/65"
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
			<button
				onclick={() => (menuOpen = !menuOpen)}
				aria-expanded={menuOpen}
				aria-label={$t('publicNav.openMenu')}
				class="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/20 text-text/70"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<path d="M4 7h16M4 12h16M4 17h16" />
				</svg>
			</button>
		</div>
	</nav>

	{#if menuOpen}
		<div class="border-t border-secondary/15 bg-background/94 px-4 py-4 lg:hidden">
			<div class="mx-auto flex max-w-7xl flex-col gap-2">
				{#each publicNavigation as item}
					<a href={item.href} class="rounded-2xl px-4 py-3 text-sm text-text/75 transition-colors hover:bg-secondary/14 hover:text-text" onclick={() => (menuOpen = false)}>
						{$t(item.labelKey)}
					</a>
				{/each}
				<div class="mt-3 flex flex-col gap-2">
					<a href="/login" class="rounded-2xl border border-secondary/20 px-4 py-3 text-sm text-text/75">{$t('nav.login')}</a>
					<a href="/register" class="rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-background">{$t('nav.register')}</a>
				</div>
			</div>
		</div>
	{/if}
</header>
