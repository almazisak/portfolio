# Portfolio (PRTFL'26) – Claude Code Guide

Almaz Isakov's personal portfolio. The icon rules are kept at the bottom.

**Talk to Almaz in Russian. Code, comments, commit messages and all site copy are in English.**
Propose a solution first, then ask questions. If you disagree, say so directly and explain why. Agree the format briefly before creating new files.

## Goal and reader
The site is for a job search in EU/USA (big tech longer-term). The reader is a recruiter or hiring manager who does not know Kazakhstan or local products. The site must give the gist fast and leave depth for the interview.
- No regional or internal references (e.g. Kaspi.kz) without a short explanation of the context.
- Short text, concrete wording ("cut scenario time by ~20%", not "improved the experience").
- Numbers come only from Almaz's notes. Never invent or round them; if missing, mark "needs a number".

## Stack and commands
Vite 8 + React 19 + react-router-dom 7, MDX (`@mdx-js/rollup`), SVGR. Plain CSS files per component (BEM-like names, e.g. `intro-card__btn--primary`). No TypeScript, no CSS framework.
- `npm run dev` – dev server (`./dev.sh` also works)
- `npm run build` – production build to `dist/` (gitignored); `npm run lint` – ESLint
- Per-page OG tags for link previews are baked in `vite.config.js` (`ogPages`). A new shareable case page needs an entry there.
- Repo: almazisak/portfolio. Work in feature branches and PRs into `main`; never push to `main` directly.
- Mockups: Figma and Paper (file PRTFL'26). **Figma is the source for tokens**; new or changed colors come from Figma variables.

## Site concept (details in `@docs/architecture.md`)
- Home is an asymmetric masonry grid of cards, Pinterest-like. It is a showcase, not a list.
- In the center is the main intro card: photo, short text, two buttons: "Get CV" and "Contact me". Contacts open in a dialog.
- Background is dotted paper, like an analog notebook. Tone: warm, paper-like, analog.
- Every case is a **custom object, not a template**. A case card leads to one of: (a) a teaser dialog if the case is not ready, (b) an interactive motion presentation, (c) an external link (e.g. YouTube).
- **Do not propose unifying cases into one page template.** Unity comes from tokens, fonts, grid and tone, not from page structure.
- A case is ~5 slides with minimal text and also has to work as a live interview presentation. Do not bring back long-reads unless Almaz asks.
- Illustrations and layout are built in parallel, not sequentially.
- Current state vs target is tracked in `docs/architecture.md`. Check it before assuming a feature exists.

## Visual system
- Fonts: **Geist** (UI and body) + **Playfair Display** (the `serif` accent: headline accents, quotes, keywords, never running text; italic allowed). Do not add other fonts without asking. (Geist Mono is already used for case eyebrow labels; ask before extending it.)
- Colors: **tokens only**, see `@docs/color-tokens.md`. Never add a hex or `rgb()` value that is not in that file; propose a new token instead. The file lists what the code actually uses today (as-found), including open conflicts.
- Principles: minimalism, accessibility, simple flow.
  - Contrast, tap targets of at least 44px, visible `:focus-visible`, keyboard support for dialogs.
  - Every animation honors `@media (prefers-reduced-motion: reduce)`.
  - Never disable zoom (see the viewport note in `docs/architecture.md`).
- Mobile is built together with desktop, not later. Check every change at ~390px and at desktop width.

## Working rules
- Do not edit existing files unless asked; write new versions next to them. Files marked ✅ are final: do not overwrite.
- Work in small steps: one component or one page per PR. Do not refactor unrelated code in the same change.
- Before adding a case, a dialog, or a card type, read the "Adding things" section in `docs/architecture.md`.
- Case content (texts, numbers, structure) lives in Almaz's Obsidian vault (Library / 1-projects/portfolio / cases), read-only for you. Use it as the source; do not rewrite it.
- Do not add dependencies without asking.

## Docs
- @docs/architecture.md: routes, current vs target, case registry, how to add a case/card/dialog
- @docs/color-tokens.md: token format and every color the code uses today, with conflicts to resolve in Figma

## Icons

### UI icons (`src/assets/icons/`)
Functional icons exported from Figma live here.

**How to use in a component:**

```jsx
import IconDownload from './assets/icons/ic-download.svg?react'

<IconDownload aria-hidden="true" />
```

**When replacing icons:** drop the new SVG into `src/assets/icons/` keeping the same filename (`ic-download.svg`, `ic-mail.svg`, etc.) and the existing imports will pick them up automatically.

### Social / brand icon sprite (`public/icons.svg`)
Used via `<svg><use href="/icons.svg#icon-id" /></svg>`. To add a new social icon, append a new `<symbol>` to this file.

### Conventions
- Icon filenames use `ic-` prefix and kebab-case: `ic-arrow-right.svg`, `ic-close.svg`
- Icons in `src/assets/icons/` are imported as React components (`?react`)
- Icons in `public/icons.svg` are referenced via the SVG sprite pattern
