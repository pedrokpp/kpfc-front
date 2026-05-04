<script lang="ts">
	import { authSession as auth } from '$lib/modules/auth-session';
	import { toasts } from '$lib/stores/toast';
	import { t } from '$lib/i18n';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let displayName = $state($auth.user?.display_name ?? '');
	let loading = $state(false);
	let editing = $state(false);

	async function handleSave(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		try {
			await auth.updateDisplayName(displayName);
			editing = false;
			toasts.success($t('profile.updated'));
		} catch (err) {
			toasts.error(err instanceof Error ? err.message : $t('profile.failedToUpdate'));
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>{$t('profile.title')} — kpfc</title></svelte:head>

{#if $auth.user}
	<div class="max-w-md flex flex-col gap-6">
		<h1 class="text-xl font-bold text-text">{$t('profile.title')}</h1>

		<div class="grid grid-cols-2 gap-4">
			<div class="bg-background border border-secondary/20 rounded-xl p-5 flex flex-col gap-1">
				<span class="text-3xl font-bold text-primary">{$auth.user.login_streak}</span>
				<span class="text-sm text-text/50">{$t('profile.dayStreak')}</span>
			</div>
			<div class="bg-background border border-secondary/20 rounded-xl p-5 flex flex-col gap-1">
				<span class="text-3xl font-bold text-primary">{$auth.user.total_points}</span>
				<span class="text-sm text-text/50">{$t('profile.totalPoints')}</span>
			</div>
		</div>

		<div class="bg-background border border-secondary/20 rounded-xl p-5 flex flex-col gap-4">
			<h2 class="text-sm font-semibold text-text/70 uppercase tracking-wide">{$t('profile.account')}</h2>

			<div class="flex flex-col gap-1">
				<span class="text-xs text-text/40">{$t('profile.email')}</span>
				<span class="text-sm text-text">{$auth.user.email}</span>
			</div>

			{#if editing}
				<form onsubmit={handleSave} class="flex flex-col gap-3">
					<Input
						label={$t('profile.displayName')}
						id="display-name"
						bind:value={displayName}
						placeholder={$t('profile.yourName')}
					/>
					<div class="flex gap-2">
						<Button type="submit" size="sm" {loading}>{$t('profile.save')}</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onclick={() => { editing = false; displayName = $auth.user?.display_name ?? ''; }}
						>
							{$t('profile.cancel')}
						</Button>
					</div>
				</form>
			{:else}
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<span class="text-xs text-text/40">{$t('profile.displayName')}</span>
						<span class="text-sm text-text">{$auth.user.display_name || '—'}</span>
					</div>
					<Button variant="ghost" size="sm" onclick={() => (editing = true)}>{$t('profile.edit')}</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}
