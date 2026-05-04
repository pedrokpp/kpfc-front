<script lang="ts">
  import { onMount } from "svelte";
  import { authSession as auth } from "$lib/modules/auth-session";
  import Meta from "$lib/components/Meta.svelte";
  import { toasts } from "$lib/stores/toast";
  import { createPublicDecksModule } from "$lib/modules/public-decks";
  import { t } from "$lib/i18n";
  import type { Deck } from "$lib/types";
  import DeckCard from "$lib/components/deck/DeckCard.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  const publicDecks = createPublicDecksModule();

  onMount(async () => {
    try {
      await publicDecks.initialize();
    } catch {
      toasts.error($t("explore.failedToLoad"));
    }
  });

  async function toggleSort(value: "upvotes" | "") {
    try {
      await publicDecks.setSort(value);
    } catch {
      toasts.error($t("explore.failedToLoad"));
    }
  }

  async function handleUpvote(deck: Deck) {
    if (!$auth.token) {
      toasts.info($t("explore.loginToUpvote"));
      return;
    }
    try {
      await publicDecks.toggleUpvote(deck.id);
    } catch (err) {
      toasts.error(
        err instanceof Error ? err.message : $t("explore.failedToUpvote"),
      );
    }
  }
</script>

<Meta
  title={$t("explore.title")}
  description={$t("explore.metaDescription")}
  path="/explore"
/>

<div class="flex flex-col gap-6">
  {#if !$auth.token}
    <section
      class="rounded-[1.8rem] border border-secondary/18 bg-surface px-6 py-7 shadow-[0_18px_50px_rgba(18,32,51,0.05)] sm:px-7"
    >
      <div
        class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
      >
        <div class="flex max-w-3xl flex-col gap-3">
          <h1
            class="text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl"
          >
            {$t("explore.title")}
          </h1>
          <p class="text-sm leading-7 text-text/68">
            {$t("explore.guestDescription")}
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            href="/register"
            class="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            {$t("home.getStarted")}
          </a>
          <a
            href="/login"
            class="inline-flex items-center justify-center rounded-full border border-secondary/24 bg-background px-5 py-3 text-sm font-medium text-text transition-colors hover:bg-secondary/12"
          >
            {$t("nav.login")}
          </a>
        </div>
      </div>
    </section>
  {:else}
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-[-0.04em] text-primary">
          {$t("explore.title")}
        </h1>
        <p class="text-sm text-text/58">{$t("explore.authDescription")}</p>
      </div>
      <a
        href="/dashboard"
        class="inline-flex items-center justify-center rounded-full border border-secondary/20 bg-surface px-4 py-2 text-sm font-medium text-text/75 transition-colors hover:bg-secondary/12 hover:text-text"
      >
        {$t("explore.goToMyDecks")}
      </a>
    </div>
  {/if}

  <div class="flex items-center justify-between flex-wrap gap-3">
    <div class="text-xs uppercase tracking-[0.24em] text-text/45">
      {$publicDecks.loading
        ? $t("explore.loadingDecks")
        : $t("explore.publicDeckCount", { count: $publicDecks.decks.length })}
    </div>
    <div class="flex items-center gap-1 text-sm">
      <button
        onclick={() => toggleSort("upvotes")}
        class="rounded-full px-3 py-1.5 transition-colors {$publicDecks.sort ===
        'upvotes'
          ? 'bg-primary text-background'
          : 'text-text/60 hover:bg-secondary/14 hover:text-text'}"
      >
        {$t("explore.top")}
      </button>
      <button
        onclick={() => toggleSort("")}
        class="rounded-full px-3 py-1.5 transition-colors {$publicDecks.sort ===
        ''
          ? 'bg-primary text-background'
          : 'text-text/60 hover:bg-secondary/14 hover:text-text'}"
      >
        {$t("explore.newest")}
      </button>
    </div>
  </div>

  {#if $publicDecks.loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each Array(6) as _}
        <div class="h-28 rounded-xl bg-secondary/10 animate-pulse"></div>
      {/each}
    </div>
  {:else if $publicDecks.decks.length === 0}
    <EmptyState
      title={$t("explore.noDecksTitle")}
      description={$t("explore.noDecksDesc")}
    />
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each $publicDecks.decks as deck (deck.id)}
        <DeckCard
          {deck}
          clickable={true}
          surface="surface"
          showCreatedAt={true}
          showUpvoteCount={true}
          onupvote={() => handleUpvote(deck)}
          upvoting={$publicDecks.upvotingId === deck.id}
        />
      {/each}
    </div>
  {/if}
</div>
