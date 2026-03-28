<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { toasts } from '$lib/stores/toast';
	import { usersApi } from '$lib/api/users';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let displayName = $state($auth.user?.display_name ?? '');
	let loading = $state(false);
	let editing = $state(false);

	onMount(() => {
		if (!$auth.token) goto('/login');
	});

	async function handleSave(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		try {
			const user = await usersApi.update(displayName);
			auth.updateUser(user);
			editing = false;
			toasts.success('Profile updated.');
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : 'Failed to update profile.');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Profile — KPFC</title></svelte:head>

{#if $auth.user}
	<div class="max-w-md flex flex-col gap-6">
		<h1 class="text-xl font-bold text-text">Profile</h1>

		<!-- Stats -->
		<div class="grid grid-cols-2 gap-4">
			<div class="bg-background border border-secondary/20 rounded-xl p-5 flex flex-col gap-1">
				<span class="text-3xl font-bold text-primary">{$auth.user.login_streak}</span>
				<span class="text-sm text-text/50">Day streak</span>
			</div>
			<div class="bg-background border border-secondary/20 rounded-xl p-5 flex flex-col gap-1">
				<span class="text-3xl font-bold text-primary">{$auth.user.total_points}</span>
				<span class="text-sm text-text/50">Total points</span>
			</div>
		</div>

		<!-- Account info -->
		<div class="bg-background border border-secondary/20 rounded-xl p-5 flex flex-col gap-4">
			<h2 class="text-sm font-semibold text-text/70 uppercase tracking-wide">Account</h2>

			<div class="flex flex-col gap-1">
				<span class="text-xs text-text/40">Email</span>
				<span class="text-sm text-text">{$auth.user.email}</span>
			</div>

			{#if editing}
				<form onsubmit={handleSave} class="flex flex-col gap-3">
					<Input
						label="Display name"
						id="display-name"
						bind:value={displayName}
						placeholder="Your name"
					/>
					<div class="flex gap-2">
						<Button type="submit" size="sm" {loading}>Save</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onclick={() => { editing = false; displayName = $auth.user?.display_name ?? ''; }}
						>
							Cancel
						</Button>
					</div>
				</form>
			{:else}
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<span class="text-xs text-text/40">Display name</span>
						<span class="text-sm text-text">{$auth.user.display_name || '—'}</span>
					</div>
					<Button variant="ghost" size="sm" onclick={() => (editing = true)}>Edit</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}
