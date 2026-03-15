# Portfolio – Claude Code Guide

## Project structure

This is a React + Vite portfolio site.

```
src/
  assets/
    icons/      ← SVG icons exported from Figma (used in components)
    hero.png    ← hero image
  components/   ← shared UI components
  pages/        ← page-level components
public/
  icons.svg     ← SVG sprite for social/brand icons (referenced via <use>)
  fonts/
  avatar.jpg
  cv.pdf
```

## Icons

### UI icons (`src/assets/icons/`)
Functional icons exported from Figma live here. Current icons:
- `ic-download.svg` – download / CV button
- `ic-mail.svg` – email button

**How to use in a component:**

```jsx
import { ReactComponent as IconDownload } from '@/assets/icons/ic-download.svg'
// or with Vite's ?react suffix:
import IconDownload from './assets/icons/ic-download.svg?react'

<IconDownload aria-hidden="true" />
```

**When replacing icons:** drop the new SVG into `src/assets/icons/` keeping the same filename (`ic-download.svg`, `ic-mail.svg`, etc.) and the existing imports will pick them up automatically.

### Social / brand icon sprite (`public/icons.svg`)
Used via `<svg><use href="/icons.svg#icon-id" /></svg>`. To add a new social icon, append a new `<symbol>` to this file.

## Conventions
- Icon filenames use `ic-` prefix and kebab-case: `ic-arrow-right.svg`, `ic-close.svg`
- Icons in `src/assets/icons/` are imported as React components (`?react`)
- Icons in `public/icons.svg` are referenced via the SVG sprite pattern
