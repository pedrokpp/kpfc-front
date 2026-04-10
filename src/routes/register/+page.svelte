<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { authApi } from '$lib/api/auth';
	import { usersApi } from '$lib/api/users';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let displayName = $state('');
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
			await authApi.register(email, password, displayName || undefined);
			// Auto-login after register
			const res = await authApi.login(email, password);
			auth.login(res.token, res.user);
			toasts.success('Account created! Welcome to kpfc.');
			goto('/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Registration failed.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Register — kpfc</title></svelte:head>

<div class="max-w-sm mx-auto mt-12 flex flex-col gap-6">
	<div class="text-center">
		<h1 class="text-2xl font-bold text-primary">Create account</h1>
		<p class="text-text/50 text-sm mt-1">Start studying smarter</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-4 bg-background border border-secondary/20 rounded-xl p-6 shadow-sm">
		<Input label="Email" id="email" type="email" bind:value={email} placeholder="you@example.com" required />
		<Input label="Display name" id="display_name" bind:value={displayName} placeholder="Optional" />
		<Input label="Password" id="password" type="password" bind:value={password} placeholder="••••••••" required />

		{#if error}
			<p class="text-sm text-accent" role="alert">{error}</p>
		{/if}

		<Button type="submit" {loading} class="w-full mt-1">Create account</Button>
	</form>

	<p class="text-center text-sm text-text/50">
		Already have an account?
		<a href="/login" class="text-accent hover:underline underline-offset-2">Sign in</a>
	</p>
</div>
