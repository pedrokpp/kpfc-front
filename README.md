# kpfc Front

Frontend for [kpfc](https://github.com/pedrokpp/kpfc) — an [Anki](https://apps.ankiweb.net)-inspired spaced repetition flashcard platform.

Built with [SvelteKit](https://svelte.dev/docs/kit) and [TailwindCSS](https://tailwindcss.com). Licensed under the [MIT License](LICENSE).

---

## Overview

kpfc Front is a single-page application that consumes the kpfc REST API. It lets users:

- Create and manage flashcard decks and cards
- Study with two modes: **Spaced Repetition** ([SM-2](https://www.supermemo.com/en/articles/twenty-rules)) and **Random Practice**
- Track login streaks and points
- Browse and upvote public decks from the community
- Toggle between **dark and light themes**

The color palette was generated with [Realtime Colors](https://www.realtimecolors.com).

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [SvelteKit](https://svelte.dev/docs/kit) | Frontend framework (SPA mode, `adapter-static`) |
| [TailwindCSS v4](https://tailwindcss.com) | Utility-first CSS via `@tailwindcss/vite` |

> No runtime dependencies beyond SvelteKit and TailwindCSS.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- kpfc API running at `http://localhost:8080` (see [API repo](https://github.com/pedrokpp/kpfc))

### Setup

```bash
pnpm install
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Environment

By default, the API base URL is `http://localhost:8080/api/v1`.
To override, set `PUBLIC_API_URL` in a `.env` file:

```env
PUBLIC_API_URL=https://your-api-host/api/v1
```

### Build

```bash
pnpm build
```

Output goes to `build/`. Serve as a static site with any HTTP server.

---

## Usage

1. **Register** or **log in** at `/login`
2. Go to **My Decks** (`/dashboard`) to create and manage your decks
3. Open a deck to **add, edit, or delete cards**
4. Click **Study** to start a session — choose *Spaced Repetition* (cards due today) or *Random Practice* (all cards, shuffled)
5. After revealing each card, rate your recall from 0 to 5 — the SM-2 algorithm schedules the next review
6. Check your **streak and points** at `/profile`
7. Browse community decks at `/explore` and upvote your favorites

---

## Project Structure

```
src/
├── lib/
│   ├── api/           # Fetch wrappers per domain (auth, decks, cards, study, users)
│   ├── components/    # UI components (layout, ui, deck, card, study)
│   ├── stores/        # Svelte writable stores (auth, theme, toast)
│   └── types/         # TypeScript interfaces
└── routes/
    ├── login/
    ├── register/
    ├── dashboard/
    ├── decks/[id]/
    │   └── study/
    ├── explore/
    └── profile/
```

---

## Contributing

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org):

```
feat:     new feature
fix:      bug fix
docs:     documentation changes
refactor: code refactoring (no behavior change)
chore:    maintenance, tooling, dependencies
```

### Guidelines

- Do not add runtime dependencies without discussion
- Keep components focused — one responsibility per file
- All code, comments, and documentation in English
- Credit third-party tools with markdown links on first mention

---

## License

[MIT](LICENSE)
