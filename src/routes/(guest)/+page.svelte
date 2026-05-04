<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
	<div class="flex flex-col gap-2">
		<h1 class="text-4xl font-bold text-primary">kpfc</h1>
		<p class="text-text/60 text-lg">{$t('home.tagline')}</p>
	</div>
	<p class="text-text/50 text-sm max-w-sm">
		{$t('home.studySmarter')} <a href="https://www.supermemo.com/en/articles/twenty-rules" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-2">SM-2</a> {$t('home.algorithm')}
		{$t('home.description')}
	</p>
	<div class="flex gap-3">
		<a href="/register" class="bg-primary text-background px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
			{$t('home.getStarted')}
		</a>
		<a href="/explore" class="bg-secondary/20 text-text px-5 py-2.5 rounded-md text-sm font-medium hover:bg-secondary/30 transition-colors">
			{$t('home.exploreDecks')}
		</a>
	</div>
</div>
