<script lang="ts">
	import { goto } from '$app/navigation';
	import { authSession as auth } from '$lib/modules/auth-session';
	import { toasts } from '$lib/stores/toast';
	import { t } from '$lib/i18n';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let email = $state('');
	let password = $state('');
	let displayName = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			await auth.registerAndLogin(email, password, displayName || undefined);
			toasts.success($t('auth.accountCreatedToast'));
			goto('/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : $t('auth.registrationFailed');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Register — kpfc</title></svelte:head>

<div class="max-w-sm mx-auto mt-12 flex flex-col gap-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold text-primary">{$t('auth.createAccount')}</h1>
		<p class="text-text/50 text-sm mt-1">{$t('auth.startStudying')}</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-4 bg-background border border-secondary/20 rounded-xl p-6 shadow-sm">
		<Input label={$t('auth.email')} id="email" type="email" bind:value={email} placeholder="you@example.com" required />
		<Input label={$t('auth.displayName')} id="display_name" bind:value={displayName} placeholder={$t('auth.optional')} />
		<Input label={$t('auth.password')} id="password" type="password" bind:value={password} placeholder="••••••••" required />

		{#if error}
			<p class="text-sm text-accent" role="alert">{error}</p>
		{/if}

		<Button type="submit" {loading} class="w-full mt-1">{$t('auth.createAccount')}</Button>
	</form>

	<p class="text-center text-sm text-text/50">
		{$t('auth.alreadyHaveAccount')}
		<a href="/login" class="text-accent hover:underline underline-offset-2">{$t('auth.signIn')}</a>
	</p>
</div>
