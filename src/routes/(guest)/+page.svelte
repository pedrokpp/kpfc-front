<script lang="ts">
  import { t } from "$lib/i18n";
  import Meta from "$lib/components/Meta.svelte";
  import { siteConfig, welcomeSignals, welcomeStudyModes } from "$lib/content/site";
</script>

<Meta
  title="kpfc - Flashcards"
  description={$t("welcome.metaDescription")}
  path="/"
/>

<section class="relative overflow-hidden">
  <div
    class="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20"
  >
    <div class="flex flex-col gap-8">
      <div
        class="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-text/48"
      >
        <span
          class="rounded-full border border-secondary/25 bg-surface px-4 py-2"
          >{$t("welcome.badgeAnkiInspired")}</span
        >
        <span
          class="rounded-full border border-secondary/25 bg-surface px-4 py-2"
          >SM-2</span
        >
        <span
          class="rounded-full border border-secondary/25 bg-surface px-4 py-2"
          >{$t("welcome.badgeStack")}</span
        >
      </div>

      <div class="flex flex-col gap-5">
        <h1
          class="max-w-4xl text-5xl font-bold leading-[1.03] tracking-[-0.05em] text-primary sm:text-6xl lg:text-7xl"
        >
          {$t("welcome.headline")}
        </h1>
        <p class="max-w-2xl text-base leading-7 text-text/70 sm:text-lg">
          {$t("welcome.introPre")}
          <a
            href="https://www.supermemo.com/en/articles/twenty-rules"
            target="_blank"
            rel="noopener noreferrer"
            class="text-accent underline decoration-accent/35 underline-offset-4"
          >
            SM-2
          </a>
          {$t("welcome.introPost")}
          {" "}
          {$t("welcome.description")}
        </p>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row">
        <a
          href="/register"
          class="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          {$t("welcome.primaryCta")}
        </a>
        <a
          href="/explore"
          class="inline-flex items-center justify-center rounded-full border border-secondary/24 bg-surface px-6 py-3 text-sm font-medium text-text transition-colors hover:bg-secondary/12"
        >
          {$t("welcome.secondaryCta")}
        </a>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        {#each welcomeSignals as signal}
          <div
            class="rounded-[1.6rem] border border-secondary/18 bg-surface px-4 py-4 shadow-[0_18px_45px_rgba(18,32,51,0.06)]"
          >
            <p class="text-xs uppercase tracking-[0.22em] text-text/45">
              {$t(signal.labelKey)}
            </p>
            <p class="mt-3 text-sm leading-6 text-text/72">
              {$t(signal.descriptionKey)}
            </p>
          </div>
        {/each}
      </div>
    </div>

    <div class="relative">
      <div
        class="absolute inset-x-8 inset-y-10 rounded-[2rem] bg-secondary/18 blur-3xl"
      ></div>
      <div
        class="relative overflow-hidden rounded-[2rem] border border-secondary/18 bg-surface p-6 text-text shadow-[0_30px_80px_rgba(18,32,51,0.12)] sm:p-8"
      >
        <div
          class="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-text/45"
        >
          <span>{$t("welcome.studySessionHeading")}</span>
          <span>{$t("welcome.onlineDeck")}</span>
        </div>

        <div class="mt-7 flex flex-col gap-6">
          <div class="rounded-[1.6rem] bg-background p-5">
            <p class="text-xs uppercase tracking-[0.2em] text-text/45">
              {$t("cardForm.front")}
            </p>
            <p class="mt-3 text-xl font-bold leading-8">
              {$t("welcome.flashcardPrompt")}
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            {#each welcomeStudyModes as mode}
              <div
                class="rounded-[1.4rem] border border-secondary/18 bg-background p-4"
              >
                <span
                  class={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${mode.accent}`}
                >
                  {$t(mode.nameKey)}
                </span>
                <p class="mt-3 text-sm leading-6 text-text/72">
                  {$t(mode.descriptionKey)}
                </p>
              </div>
            {/each}
          </div>

          <div
            class="rounded-[1.6rem] border border-secondary/18 bg-background p-5"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-text/45">
                  {$t("welcome.reviewSyncLabel")}
                </p>
                <p class="mt-2 text-sm leading-6 text-text/72">
                  {$t("welcome.reviewSyncDescription")}
                </p>
              </div>
              <div
                class="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-background"
              >
                {$t("welcome.reviewSyncState")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="study-session" class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
  <div
    class="grid gap-6 rounded-[2rem] border border-secondary/18 bg-surface p-6 shadow-[0_24px_65px_rgba(18,32,51,0.07)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8"
  >
    <div class="flex flex-col gap-4">
      <p class="text-xs uppercase tracking-[0.24em] text-text/45">
        {$t("welcome.studySessionHeading")}
      </p>
      <h2 class="text-3xl font-bold tracking-[-0.04em] text-primary">
        {$t("welcome.studySectionTitle")}
      </h2>
      <p class="text-sm leading-7 text-text/72">
        {$t("welcome.studySectionDescription")}
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div
        class="rounded-[1.5rem] border border-secondary/18 bg-background px-5 py-5"
      >
        <p class="text-xs uppercase tracking-[0.22em] text-text/45">
          {$t("welcome.deckLabel")}
        </p>
        <p class="mt-3 text-sm leading-6 text-text/72">
          {$t("welcome.deckDescription")}
        </p>
      </div>
      <div
        class="rounded-[1.5rem] border border-secondary/18 bg-background px-5 py-5"
      >
        <p class="text-xs uppercase tracking-[0.22em] text-text/45">
          {$t("welcome.reviewLabel")}
        </p>
        <p class="mt-3 text-sm leading-6 text-text/72">
          {$t("welcome.reviewDescription")}
        </p>
      </div>
      <div
        class="rounded-[1.5rem] border border-secondary/18 bg-background px-5 py-5"
      >
        <p class="text-xs uppercase tracking-[0.22em] text-text/45">
          {$t("welcome.authSessionLabel")}
        </p>
        <p class="mt-3 text-sm leading-6 text-text/72">
          {$t("welcome.authSessionDescription")}
        </p>
      </div>
      <div
        class="rounded-[1.5rem] border border-secondary/18 bg-background px-5 py-5"
      >
        <p class="text-xs uppercase tracking-[0.22em] text-text/45">
          {$t("welcome.publicDecksLabel")}
        </p>
        <p class="mt-3 text-sm leading-6 text-text/72">
          {$t("welcome.publicDecksDescription")}
        </p>
      </div>
    </div>
  </div>
</section>

<section id="comunidade" class="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
  <div
    class="rounded-[2rem] bg-primary px-6 py-8 text-background shadow-[0_32px_90px_rgba(18,32,51,0.18)] sm:px-8 sm:py-10"
  >
    <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
      <div class="flex flex-col gap-4">
        <p class="text-xs uppercase tracking-[0.24em] text-background/50">
          {$t("welcome.communityLabel")}
        </p>
        <h2 class="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          {$t("welcome.communityTitle")}
        </h2>
        <p class="max-w-2xl text-sm leading-7 text-background/74">
          {$t("welcome.communityDescriptionPre")}
          <code
            class="rounded bg-white/10 px-1.5 py-0.5 text-[0.95em] text-background"
            >kpfc</code
          >
          {$t("welcome.communityDescriptionPost")}
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <a
          href="/register"
          class="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-medium text-primary transition-transform hover:-translate-y-0.5"
        >
          {$t("welcome.primaryCta")}
        </a>
        <a
          href={siteConfig.repository}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-medium text-background/86 transition-colors hover:bg-white/7 hover:text-background"
        >
          {$t("welcome.viewSource")}
        </a>
        <div
          class="flex items-center justify-center gap-3 rounded-[1.6rem] border border-white/12 bg-white/6 px-5 py-4 text-background/78"
        >
          <span
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
          <span
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M16 18 22 12 16 6" />
              <path d="M8 6 2 12l6 6" />
            </svg>
          </span>
          <span
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
