<script lang="ts">
	import { siteConfig } from '$lib/content/site';
	import { t } from '$lib/i18n';
</script>

<footer class="border-t border-secondary/15 bg-surface text-text">
	<div class="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-3">
				<img
					src="/favicon.svg"
					alt="kpfc"
					class="h-11 w-11 rounded-2xl object-contain"
				/>
				<div class="flex flex-col">
					<span class="font-go text-lg font-bold">kpfc</span>
					<span class="text-sm text-text/62">{$t('footer.tagline')}</span>
				</div>
			</div>
			<p class="max-w-xl text-sm leading-6 text-text/66">
				{$t('publicFooter.description')}
			</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2">
			<div class="flex flex-col gap-2 text-sm">
				<span class="text-xs uppercase tracking-[0.24em] text-text/42">{$t('publicFooter.navigation')}</span>
				<a href="/" class="text-text/70 transition-colors hover:text-text">{$t('publicFooter.home')}</a>
				<a href="/explore" class="text-text/70 transition-colors hover:text-text">{$t('home.exploreDecks')}</a>
				<a href="/register" class="text-text/70 transition-colors hover:text-text">{$t('auth.createAccount')}</a>
			</div>
			<div class="flex flex-col gap-2 text-sm">
				<span class="text-xs uppercase tracking-[0.24em] text-text/42">{$t('publicFooter.contact')}</span>
				<a href={siteConfig.repository} target="_blank" rel="noopener noreferrer" class="text-text/70 transition-colors hover:text-text">
					GitHub
				</a>
				<a href={siteConfig.email} class="text-text/70 transition-colors hover:text-text">
					pedrkp@proton.me
				</a>
				<span class="text-text/42">{$t('publicFooter.domainPlanned')}</span>
			</div>
		</div>
	</div>
</footer>
