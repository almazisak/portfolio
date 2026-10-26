# Architecture and how to add things

Status: draft, 2026-10-26. Sections marked **PROPOSED** are not agreed yet: confirm with Almaz before building.

## 1. Where the code is today

| Area | Today | File |
|---|---|---|
| Routes | `/` home, `/work/balaty` custom page, `/work/:slug` MDX long-read | `src/App.jsx` |
| Home | One centered intro card (photo, headline, "Get CV", "Contact me") + contact dialog. **No masonry, no dotted paper yet** | `src/pages/HomePage/` |
| Case: Balaty | Fully custom page (sticker honeycomb, own CSS) | `src/pages/BalatyPage/` |
| Case: DCB PIM | MDX long-read built from blocks (Hero, TLDR, Facts, Figure…), rendered by one layout | `src/cases/dcb-pim/`, `src/layouts/CaseLayout.jsx`, `src/components/case/` |
| Case registry | `import.meta.glob('/src/cases/*/meta.js')`, sorted by `order`. Balaty is **not** in it | `src/lib/cases.js` |
| Dialog | Native `<dialog>` + `showModal()`: focus trap, Esc and focus restore come for free | `src/components/ContactDialog/` |
| Shared bar | Sticky `HeroBar` on case pages | `src/components/HeroBar/` |
| Styles | Plain CSS per component; **no token layer**, colors hardcoded; case blocks use local `--cs-*` variables | see `docs/color-tokens.md` |
| Fonts | Google Fonts link in `index.html` (Geist, Geist Mono, Playfair Display). `public/fonts` (Inter, Literata) are leftovers used as fallbacks | `index.html`, `src/index.css` |

### Target vs today
The concept (masonry home, motion-presentation cases) is ahead of the code. Reconcile like this:
- **MDX long-read blocks and `CaseLayout` stay working.** DCB PIM is live and shareable. Do not delete or rewrite them unless Almaz asks. New cases do not have to use them. Almaz plans to rethink each case into a ~5-slide motion presentation.
- Home becomes a masonry grid with the intro card in the center. Today's intro card is the seed of that central card, keep its content and behavior.
- Balaty already shows the intended approach: a case as its own object with its own layout.

### Known issues to be aware of (do not fix silently, ask first)
- `index.html` viewport has `maximum-scale=1.0, user-scalable=no`, which disables pinch zoom. Conflicts with the accessibility goal.
- `src/App.css` and `src/assets/{react,vite}.svg`, `hero.png` look like leftovers from the Vite template (the `.counter`/`.hero` rules and `--accent*` vars are not part of the design).
- Overlapping colors exist in code (two blues, three near-identical darks, two warm backgrounds): see section 3 of `docs/color-tokens.md`.
- Mixed type fallbacks (`'Geist', 'Inter'`, `'Playfair Display', 'Literata'`): Inter and Literata are not in the approved pair.

## 2. Home layout

**Concept (agreed):** masonry of cards; intro card in the center; dotted-paper background; warm, analog tone; works equally well on mobile.

**Not decided yet (ask, do not guess):**
- Masonry implementation (CSS columns vs grid with row spans vs a small JS layout) and how the centered intro card holds its position as columns reflow.
- Breakpoints. Existing CSS uses 600px and 1024px. An older layout note (since replaced by the masonry concept) named Figma frames at 393 / 834 / 1440; use them only as design-frame sizes after confirming.
- Dotted paper: implement as a CSS background (radial-gradient dots) on the page wrapper. It needs a new dot color token, **PROPOSED** `--color-paper-dot`, value to be picked in Figma. Do not hardcode.
- Card sizes: a small set of sizes (e.g. S/M/L) driven by data, not per-card CSS. **PROPOSED**
- Mobile behavior of the grid (1 column? 2?) and tap targets.

## 3. Case cards and the registry (PROPOSED)

Goal: adding a case = adding a folder and one metadata file. The home grid, routing and prev/next are driven by data, but **case contents stay custom**.

Extend the existing `meta.js` convention (keep `import.meta.glob`) with:

```js
// src/cases/<slug>/meta.js
export default {
  title: 'Balaty',
  subtitle: 'One line, plain English, no local references',
  year: 2016,
  tags: ['Illustration', 'Branding'],
  order: 1,
  kind: 'motion',        // 'teaser' | 'motion' | 'external'
  status: 'ready',       // 'ready' | 'soon'
  size: 'M',             // masonry card size
  cover: './cover.webp', // card visual (illustration, not a screenshot dump)
  href: undefined,       // only for kind: 'external' (e.g. YouTube)
}
```

How each `kind` behaves:
- **teaser**: the card opens a native `<dialog>` (reuse the ContactDialog pattern) with a short teaser: what it is, role, one number if it exists. Used while the case is not ready (`status: 'soon'` shows the "Soon" badge, `--color-accent-subtle`).
- **motion**: the card goes to `/work/<slug>`. The case is its own React component (`src/cases/<slug>/index.jsx`): ~5 slides, minimal text, usable on the site **and** as a live presentation (keyboard ←/→, visible focus, reduced-motion fallback).
- **external**: the card opens `href` in a new tab (`rel="noopener noreferrer"`). The site teaser is content; the full story lives elsewhere.

Open points: how `/work/:slug` resolves `index.mdx` (today) vs `index.jsx` (motion), and moving Balaty into the registry instead of the hardcoded route in `App.jsx`. Propose the smallest change and confirm.

## 4. Adding things

### A new case
1. Agree the format with Almaz (kind, number of slides, what is on the card). Read his notes in Obsidian first.
2. Create `src/cases/<slug>/` with `meta.js` and the case component or content. Keep assets inside the folder.
3. Do **not** copy another case's layout. Reuse only tokens, fonts, the grid and the tone. Shared pieces (HeroBar, dialog) are fine.
4. Use tokens for every color; the Playfair accent only for emphasis.
5. If the page should preview well when shared, add it to `ogPages` in `vite.config.js` and add `public/og/<slug>.jpg` (1200×630).
6. Check at ~390px and at desktop width; check keyboard navigation and `prefers-reduced-motion`.

### A new dialog
Use the native `<dialog>` like `ContactDialog`: `showModal()`, `aria-labelledby`, `Esc`, backdrop click, close button with `aria-label`, focus returns to the trigger. Backdrop is `--color-overlay`.

### A new shared component
Put it in `src/components/<Name>/` with `<Name>.jsx` + `<Name>.css`. Class names follow `block__element--modifier`. Case-only blocks stay in `src/components/case/`.

### A new color, font or token
Never inline it. Propose the token name and role to Almaz first; he adds it as a Figma variable, then it goes into `docs/color-tokens.md` and the tokens file.

## 5. Accessibility checklist (every change)
- Text contrast meets WCAG AA; do not rely on color alone.
- Interactive elements are real `button`/`a`; visible `:focus-visible`; tap targets ≥ 44px.
- Dialogs: focus trap, Esc, focus restore, labelled.
- Motion has a `prefers-reduced-motion: reduce` fallback (existing pattern in `CaseLayout.css`, `HeroBar.css`, `ContactDialog.css`).
- Images have meaningful `alt` or `alt=""` with `aria-hidden` for decoration; icons are `aria-hidden`.
