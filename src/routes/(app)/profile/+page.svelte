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

<svelte:head><title>{$t('profile.title')} - kpfc</title></svelte:head>

{#if $auth.user}
	<div class="flex max-w-4xl flex-col gap-6">
		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-bold tracking-[-0.04em] text-primary">{$t('profile.title')}</h1>
			<p class="text-sm text-text/58">{$t('profile.description')}</p>
		</div>

		<div class="flex flex-wrap items-center gap-2 text-sm">
			<div class="rounded-full border border-secondary/20 bg-surface px-4 py-2 text-text/72">
				<span class="text-text/45">{$t('profile.dayStreak')}:</span>
				<span class="ml-2 font-semibold text-text">{$auth.user.login_streak}</span>
			</div>
			<div class="rounded-full border border-secondary/20 bg-surface px-4 py-2 text-text/72">
				<span class="text-text/45">{$t('profile.totalPoints')}:</span>
				<span class="ml-2 font-semibold text-text">{$auth.user.total_points}</span>
			</div>
		</div>

		<div class="flex flex-col gap-5 border-t border-secondary/18 pt-6">
			<div class="flex flex-col gap-2">
				<p class="text-xs uppercase tracking-[0.24em] text-text/45">{$t('profile.email')}</p>
				<p class="break-all text-sm leading-7 text-text">{$auth.user.email}</p>
			</div>

			<div class="border-t border-secondary/18 pt-5">
				{#if editing}
					<form onsubmit={handleSave} class="flex flex-col gap-3">
						<Input
							label={$t('profile.displayName')}
							id="display-name"
							bind:value={displayName}
							placeholder={$t('profile.yourName')}
						/>
						<div class="flex flex-col gap-2 sm:flex-row">
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
					<div class="flex items-start justify-between gap-4">
						<div class="flex flex-col gap-2">
							<p class="text-xs uppercase tracking-[0.24em] text-text/45">{$t('profile.displayName')}</p>
							<p class="text-sm leading-7 text-text">{$auth.user.display_name || '-'}</p>
						</div>
						<Button variant="ghost" size="sm" onclick={() => (editing = true)}>{$t('profile.edit')}</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
