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

<Meta title="Criar conta" description="Abra sua conta no kpfc para criar Decks, Cards e iniciar Study Sessions." path="/register" robots="noindex,nofollow" />

<div class="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
	<div class="flex flex-col gap-5">
		<p class="text-xs uppercase tracking-[0.24em] text-text/45">Cadastro</p>
		<h1 class="text-4xl font-bold tracking-[-0.05em] text-primary sm:text-5xl">{$t('auth.createAccount')}</h1>
		<p class="max-w-xl text-sm leading-7 text-text/68">
			{$t('auth.startStudying')}. Crie seu primeiro Deck, publique quando fizer sentido e mantenha o ritmo com streaks e pontos.
		</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-4 rounded-[1.8rem] border border-secondary/18 bg-surface p-6 shadow-[0_26px_80px_rgba(18,32,51,0.08)] sm:p-7">
		<Input label={$t('auth.email')} id="email" type="email" bind:value={email} placeholder="you@example.com" required />
		<Input label={$t('auth.displayName')} id="display_name" bind:value={displayName} placeholder={$t('auth.optional')} />
		<Input label={$t('auth.password')} id="password" type="password" bind:value={password} placeholder="********" required />

		{#if error}
			<p class="text-sm text-accent" role="alert">{error}</p>
		{/if}

		<Button type="submit" {loading} class="w-full mt-1">{$t('auth.createAccount')}</Button>
		<p class="text-center text-sm text-text/50">
			{$t('auth.alreadyHaveAccount')}
			<a href="/login" class="text-accent hover:underline underline-offset-2">{$t('auth.signIn')}</a>
		</p>
	</form>
</div>
