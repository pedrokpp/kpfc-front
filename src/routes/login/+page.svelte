<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { t } from '$lib/i18n';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	onMount(() => {
		if ($auth.token) goto('/dashboard');
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			await auth.login(email, password);
			toasts.success($t('auth.welcomeBackToast'));
			goto('/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : $t('auth.loginFailed');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Login — kpfc</title></svelte:head>

<div class="max-w-sm mx-auto mt-12 flex flex-col gap-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold text-primary">{$t('auth.signIn')}</h1>
		<p class="text-text/50 text-sm mt-1">{$t('auth.welcomeBack')}</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-4 bg-background border border-secondary/20 rounded-xl p-6 shadow-sm">
		<Input label={$t('auth.email')} id="email" type="email" bind:value={email} placeholder="you@example.com" required />
		<Input label={$t('auth.password')} id="password" type="password" bind:value={password} placeholder="••••••••" required />

		{#if error}
			<p class="text-sm text-accent" role="alert">{error}</p>
		{/if}

		<Button type="submit" {loading} class="w-full mt-1">{$t('auth.signIn')}</Button>
	</form>

	<p class="text-center text-sm text-text/50">
		{$t('auth.noAccount')}
		<a href="/register" class="text-accent hover:underline underline-offset-2">{$t('nav.register')}</a>
	</p>
</div>
