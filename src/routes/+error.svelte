<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head><title>Error — kpfc</title></svelte:head>

<div class="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
	<p class="text-6xl font-bold text-primary/30">{$page.status}</p>
	<p class="text-text/70 font-medium">{$page.error?.message ?? 'Something went wrong'}</p>
	<a
		href="/dashboard"
		class="text-sm text-accent hover:underline underline-offset-2 transition-colors"
	>
		Back to dashboard
	</a>
</div>
