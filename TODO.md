# kpfc Front - TODO

Each phase is self-contained and results in a working, testable state.
Update this file after completing each task: replace `[ ]` with `[x]`.

---

## Phase 1 - Scaffold + Theming
> **Status: [x] Complete**

- [x] Bootstrap SvelteKit project with `npx sv create` (`minimal` template, TypeScript, `adapter-static`, TailwindCSS)
- [x] Configure CSS custom properties for light/dark palette in `src/routes/layout.css` using Tailwind v4 `@theme` block
- [x] Add anti-flash inline script in `src/app.html` that reads `localStorage` before first paint and applies `.dark` to `<html>`
- [x] Create `src/lib/stores/theme.ts` - writable store, reads `prefers-color-scheme` as fallback, persists to `localStorage`, toggles `.dark` class on `<html>`
- [x] Create `src/lib/components/layout/Navbar.svelte` - sticky header with logo, nav links (conditional on auth), theme toggle button
- [x] Create `src/lib/components/layout/Footer.svelte` - minimal footer with API repo link
- [x] Update `src/routes/+layout.svelte` - compose Navbar, Footer, ToastContainer in a `min-h-screen flex flex-col` wrapper
- [x] Add `src/routes/+layout.ts` with `export const ssr = false` and `export const prerender = false`

**Verification:** Run `pnpm dev`. App loads. Theme toggle switches palette instantly with no flash on reload. Navbar and Footer render correctly.

---

## Phase 2 - UI Primitives + Toasts
> **Status: [x] Complete**

- [x] Create `src/lib/types/index.ts` - TypeScript interfaces: `User`, `Deck`, `Card`, `ApiError`, `Toast`, `StudyMode`
- [x] Create `src/lib/stores/toast.ts` - queue store with `success()`, `error()` (6s), `info()` methods and auto-dismiss timers
- [x] Create `src/lib/components/ui/ToastContainer.svelte` - fixed bottom-right, `role="alert"`, `aria-live="assertive"`, Svelte `fly` transitions, dismiss button
- [x] Create `src/lib/components/ui/Button.svelte` - variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`; `loading` prop with spinner
- [x] Create `src/lib/components/ui/Input.svelte` - label, error message (`aria-describedby`), `aria-invalid`, focus ring
- [x] Create `src/lib/components/ui/Modal.svelte` - backdrop + panel, `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape key closes, `fly` transition
- [x] Create `src/lib/components/ui/EmptyState.svelte` - centered icon, title, optional description and CTA slot

**Verification:** Import and render each component in isolation. Toast appears and dismisses. Modal opens/closes with Escape. Button loading state shows spinner.

---

## Phase 3 - API Client + Authentication
> **Status: [x] Complete**

- [x] Create `src/lib/api/client.ts` - `api.get/post/put/del` typed generics; reads JWT from `localStorage`; injects `Authorization: Bearer`; on 401 clears auth store and redirects to `/login`; reads base URL from `PUBLIC_API_URL` env var
- [x] Create `src/lib/stores/auth.ts` - stores `token` + `user` in `localStorage`; exposes `login()`, `logout()`, `updateUser()`
- [x] Create `src/lib/api/auth.ts` - `login()`, `register()`
- [x] Create `src/routes/login/+page.svelte` - email + password form; on success calls `auth.login()` and redirects to `/dashboard`; shows inline error on failure
- [x] Create `src/routes/register/+page.svelte` - email + optional display name + password; auto-login after register; redirects to `/dashboard`
- [x] Update `src/routes/+page.svelte` - landing page; redirects to `/dashboard` if already logged in

**Verification:** Register a new account → lands on `/dashboard`. Log out → redirected to `/login`. Log in → lands on `/dashboard`. Wrong password shows error toast.

---

## Phase 4 - Dashboard + Deck CRUD
> **Status: [x] Complete**

- [x] Create `src/lib/api/decks.ts` - `list()`, `get()`, `create()`, `update()`, `delete()`, `upvote()`, `listPublic()`
- [x] Create `src/lib/components/deck/DeckCard.svelte` - title, description (truncated), public badge, upvote count, hover-reveal edit/delete buttons
- [x] Create `src/lib/components/deck/DeckForm.svelte` - title (required), description textarea, `is_public` checkbox; used for both create and edit
- [x] Create `src/routes/dashboard/+page.svelte` - authenticated guard; loads decks on mount; responsive grid; skeleton loading state; modals for create/edit/delete; streak and points in header

**Verification:** Create a deck → appears in grid. Edit title → updates in place. Delete → removed with toast. Skeleton shows during load.

---

## Phase 5 - Deck Detail + Card CRUD
> **Status: [x] Complete**

- [x] Create `src/lib/api/cards.ts` - `list()`, `get()`, `create()`, `update()`, `delete()`
- [x] Create `src/lib/components/card/CardForm.svelte` - front and back textareas (both required)
- [x] Create `src/lib/components/card/CardItem.svelte` - shows front/back preview, due date, interval, repetitions; hover-reveal edit/delete
- [x] Create `src/routes/decks/[id]/+page.svelte` - breadcrumb; deck header with edit and Study button; card count + due count; full card list; modals for add/edit/delete card and edit deck

**Verification:** Open a deck → cards listed. Add card → appears immediately. Edit card → updates in place. Due cards show "Due for review" badge.

---

## Phase 6 - Study Session
> **Status: [x] Complete**

- [x] Create `src/lib/api/study.ts` - `start(deckId, mode)`, `review(cardId, quality)`
- [x] Create `src/lib/components/study/Flashcard.svelte` - shows front; click reveals back; no flip animation (accessibility)
- [x] Create `src/lib/components/study/QualityRating.svelte` - 6 buttons (0–5) with label and description; color-coded by quality range
- [x] Create `src/lib/components/study/SessionSummary.svelte` - total, correct (≥3), avg quality; links to study again or back to deck
- [x] Create `src/routes/decks/[id]/study/+page.svelte` - three phases: mode selection → studying (progress bar, flashcard, rating) → summary; handles empty session (no cards due)

**Verification:** Start spaced session → only due cards. Start random → all cards shuffled. Rate each card → summary shows at end. "No cards due" toast when nothing due in spaced mode.

---

## Phase 7 - Public Decks + Upvote
> **Status: [x] Complete**

- [x] Create `src/routes/explore/+page.svelte` - public deck grid; Top/Newest sort toggle; upvote button per deck; optimistic upvote count update; unauthenticated users get info toast on upvote attempt

**Verification:** `/explore` loads without auth. Sort toggle reloads list. Upvote button increments count. Logged-out upvote shows info toast.

---

## Phase 8 - User Profile
> **Status: [x] Complete**

- [x] Create `src/lib/api/users.ts` - `me()`, `update(display_name)`
- [x] Create `src/routes/profile/+page.svelte` - streak and points stats; display name edit form (inline, not modal); email shown read-only

**Verification:** Profile shows correct streak and points. Edit display name → saves and updates navbar (next login). Cancel restores previous value.

---

## Phase 9 - Cloze Cards + Media Support
> **Status: [x] Complete**

- [x] Add `CardType`, `MediaObject` types and extend `Card` interface in `src/lib/types/index.ts`
- [x] Add `upload` method to API client in `src/lib/api/client.ts`
- [x] Extend `CardInput` with cloze fields in `src/lib/api/cards.ts`
- [x] Create `src/lib/api/media.ts` - upload, url, delete
- [x] Create `src/lib/components/card/CardContent.svelte` - renders card text with media and cloze
- [x] Update `src/lib/components/card/CardForm.svelte` - card type toggle, cloze fields, media upload
- [x] Update `src/lib/components/card/CardItem.svelte` - cloze badge, conditional back/extra display
- [x] Update `src/lib/components/study/Flashcard.svelte` - use CardContent, cloze reveal/hide
- [x] Update `src/routes/decks/[id]/study/+page.svelte` - pass cardType + extra to Flashcard
- [x] Update `src/routes/decks/[id]/+page.svelte` - update handler type signatures

---

## Phase 10 - Polish + Accessibility
> **Status: [ ] Pending**

### Accessibility audit
- [ ] Verify all interactive elements have visible focus indicators
- [ ] Confirm all icon-only buttons have `aria-label`
- [ ] Ensure color contrast meets WCAG AA for both themes
- [ ] Test keyboard navigation: Tab order is logical, modals trap focus, Escape closes modals

### Responsive audit
- [ ] Test all pages at 320px, 768px, 1280px widths
- [ ] Ensure navigation is usable on mobile (consider hamburger menu if needed)
- [ ] Verify study session layout works on small screens

### UX improvements
- [ ] Add `loading` skeleton states to Deck detail page card list
- [ ] Show card count per deck on DeckCard
- [ ] Add `<meta name="description">` to all pages for SEO
- [ ] Ensure 404 page exists (`src/routes/+error.svelte`)

### Error page
- [ ] Create `src/routes/+error.svelte` - friendly error message with link back to dashboard

**Verification:** Navigate with keyboard only through the full study flow. Resize to 375px - no horizontal scroll. Run Lighthouse accessibility audit (score ≥ 90).
