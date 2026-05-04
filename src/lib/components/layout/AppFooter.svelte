<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<footer class="mt-auto border-t border-secondary/15">
	<div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5 text-xs text-text/45 sm:px-6">
		<p>kpfc - {$t('footer.tagline')}</p>
		<a
			href="https://github.com/pedrokpp/kpfc"
			target="_blank"
			rel="noopener noreferrer"
			class="transition-colors hover:text-text/75"
		>
			{$t('footer.apiSource')}
		</a>
	</div>
</footer>
