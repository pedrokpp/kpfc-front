<script lang="ts">
	import { goto } from '$app/navigation';
	import Meta from '$lib/components/Meta.svelte';
	import { authSession as auth } from '$lib/modules/auth-session';
	import { toasts } from '$lib/stores/toast';
	import { t } from '$lib/i18n';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

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

<Meta title="Login" description="Acesse sua Auth Session para continuar estudando seus Decks no kpfc." path="/login" robots="noindex,nofollow" />

<div class="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
	<div class="flex flex-col gap-5">
		<p class="text-xs uppercase tracking-[0.24em] text-text/45">Auth Session</p>
		<h1 class="text-4xl font-bold tracking-[-0.05em] text-primary sm:text-5xl">{$t('auth.signIn')}</h1>
		<p class="max-w-xl text-sm leading-7 text-text/68">
			{$t('auth.welcomeBack')}. Continue seus Decks, retome a Study Session e acompanhe streaks e pontos sem perder contexto.
		</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-4 rounded-[1.8rem] border border-secondary/18 bg-surface p-6 shadow-[0_26px_80px_rgba(18,32,51,0.08)] sm:p-7">
		<Input label={$t('auth.email')} id="email" type="email" bind:value={email} placeholder="you@example.com" required />
		<Input label={$t('auth.password')} id="password" type="password" bind:value={password} placeholder="********" required />

		{#if error}
			<p class="text-sm text-accent" role="alert">{error}</p>
		{/if}

		<Button type="submit" {loading} class="w-full mt-1">{$t('auth.signIn')}</Button>
		<p class="text-center text-sm text-text/50">
			{$t('auth.noAccount')}
			<a href="/register" class="text-accent hover:underline underline-offset-2">{$t('nav.register')}</a>
		</p>
	</form>
</div>
