<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { authApi } from '$lib/api/auth';
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
			const res = await authApi.login(email, password);
			auth.login(res.token, res.user);
			toasts.success('Welcome back!');
			goto('/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Login — KPFC</title></svelte:head>

<div class="max-w-sm mx-auto mt-12 flex flex-col gap-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold text-primary">Sign in</h1>
		<p class="text-text/50 text-sm mt-1">Welcome back</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-4 bg-background border border-secondary/20 rounded-xl p-6 shadow-sm">
		<Input label="Email" id="email" type="email" bind:value={email} placeholder="you@example.com" required />
		<Input label="Password" id="password" type="password" bind:value={password} placeholder="••••••••" required />

		{#if error}
			<p class="text-sm text-accent" role="alert">{error}</p>
		{/if}

		<Button type="submit" {loading} class="w-full mt-1">Sign in</Button>
	</form>

	<p class="text-center text-sm text-text/50">
		No account?
		<a href="/register" class="text-accent hover:underline underline-offset-2">Register</a>
	</p>
</div>
