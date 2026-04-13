<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<footer class="border-t border-secondary/20 py-6 mt-auto">
	<div class="max-w-5xl mx-auto px-4 text-center text-text/40 text-sm">
		<p>
			kpfc &mdash; {$t('footer.tagline')}
			<a
				href="https://github.com/pedrokpp/kpfc"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-text/70 transition-colors underline underline-offset-2"
			>
				{$t('footer.apiSource')}
			</a>
		</p>
	</div>
</footer>
