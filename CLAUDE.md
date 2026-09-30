# Portfolio – Claude Code Guide

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

## Conventions
- Icon filenames use `ic-` prefix and kebab-case: `ic-arrow-right.svg`, `ic-close.svg`
- Icons in `src/assets/icons/` are imported as React components (`?react`)
- Icons in `public/icons.svg` are referenced via the SVG sprite pattern
