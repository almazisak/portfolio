# Color tokens

Status: **as-found**. This table is built from an audit of `src/` on 2026-10-26: every color value the code actually uses, nothing more. It replaces the earlier copy of the Paper palette. Extend it from Figma (see section 4).

The code has no token layer yet: colors are hardcoded in each component CSS file, and case pages have their own `--cs-*` variables in `src/components/case/blocks.css`. The names below are the proposed token names for these exact values.

## 1. Format
- One flat semantic layer, no primitives. Name: `--color-{role}[-{variant}]` (e.g. `--color-accent-subtle`, `--color-primary-hover`).
- Variants: `-subtle`, `-hover`, `-pressed`, `-border`, `-alt`, `-bright`. Roles describe use, not appearance.
- Defined once in `:root` in `src/styles/tokens.css` (**PROPOSED path**, create it when the first component is migrated; import it first in `src/main.jsx`). Components use only `var(--color-*)`.
- Alpha values are written as `rgb(r g b / %)`.
- No dark theme.

## 2. Tokens found in the code

"Uses" counts declarations in `src/**/*.css`, `.jsx`, `.mdx` (a `--cs-*` definition counts once; its consumers are not counted). "Figma" is to be filled when the variable is synced.

### Text
| Token | Value | Role | Uses / where | Today's name | Figma |
|---|---|---|---|---|---|
| `--color-ink` | `#080708` | Headings, titles, links on light | 10: case headings, hero bar, Balaty title/links | `--cs-heading` | — |
| `--color-ink-alt` | `#1A1A1A` | Intro-card headline, secondary button label and pressed bg, dialog tag label | 4: HomePage, ContactDialog | — | — |
| `--color-ink-soft` | `#323232` | Contact dialog text, title, labels; row hover fill; secondary button hover bg | 6: ContactDialog, HomePage | — | — |
| `--color-body` | `#383737` | Running text in cases | 4: case article, Balaty body | `--cs-text` | — |
| `--color-muted` | `#706E69` | Secondary text, captions, footer | 3: case layout | `--cs-muted` | — |

### Surfaces
| Token | Value | Role | Uses / where | Today's name | Figma |
|---|---|---|---|---|---|
| `--color-bg` | `#F9F7F3` | Page background; also the label color on the primary button in the hero bar | 6: body, hero bar, case layout, Balaty | `--cs-bg` | — |
| `--color-bg-warm` | `#F4EFEA` | Home page background; secondary button background | 2: HomePage | — | — |
| `--color-surface` | `#FFFFFF` | Cards, dialog; text on dark buttons | 6: intro card (`#FFF`), dialog, secondary button hover/pressed label, primary button label (home) | `--cs-surface` | — |
| `--color-sand` | `#F3E8D3` | Tan placeholder / cover backgrounds | 4: case blocks | — | — |

### Accent (orange)
| Token | Value | Role | Uses / where | Today's name | Figma |
|---|---|---|---|---|---|
| `--color-accent` | `#FF8811` | Brand orange: progress bar, hovered links, focus outline in case pages, CV button label, chart accent | 6 | `--cs-accent` | — |
| `--color-accent-subtle` | `#FAEAD8` | CV button bg, back-button hover | 2: HeroBar | — | — |
| `--color-accent-subtle-hover` | `#FAE5CF` | CV button hover | 1: HeroBar | — | — |
| `--color-accent-subtle-pressed` | `#FAE1C6` | CV button pressed | 1: HeroBar | — | — |
| `--color-accent-border` | `rgb(255 136 17 / 30%)` | Section dividers (prev/next, footer) | 3 | `--cs-rule` | — |
| `--color-accent-faint` | `rgb(255 136 17 / 15%)` | Faint orange fill in case blocks | 1 definition, 3 consumers | `--cs-accent-faint` | — |

### Primary (blue)
Two different blues are used for the same role. Both are listed as found.

| Token | Value | Role | Uses / where | Today's name | Figma |
|---|---|---|---|---|---|
| `--color-primary` | `#2092E9` | "Contact" button in hero bar; focus outline in hero bar and dialog | 3 | — | — |
| `--color-primary-hover` | `#1D85E0` | Hover | 1: HeroBar | — | — |
| `--color-primary-pressed` | `#1771C8` | Pressed | 1: HeroBar | — | — |
| `--color-primary-alt` | `#5D9BFF` | "Contact me" button on the home intro card | 1: HomePage | — | — |
| `--color-primary-alt-hover` | `#4377DB` | Hover | 1: HomePage | — | — |
| `--color-primary-alt-pressed` | `#2E58B7` | Pressed | 1: HomePage | — | — |

### Status
| Token | Value | Role | Uses / where | Today's name | Figma |
|---|---|---|---|---|---|
| `--color-success` | `#2C9E5A` | Positive metric delta (text) | 1: case blocks | — | — |
| `--color-success-bright` | `#48F08B` | "fastest" tag background in contact dialog | 1: ContactDialog | — | — |

### Lines, overlay, shadows
| Token | Value | Role | Uses / where | Today's name | Figma |
|---|---|---|---|---|---|
| `--color-border` | `#DCD3C7` | Row dividers in contact dialog | 1 | — | — |
| `--color-border-subtle` | `rgb(8 7 8 / 12%)` | Left rule on version-compare items | 1: case blocks | — | — |
| `--color-overlay` | `rgb(8 7 8 / 42%)` | Dialog backdrop | 1: ContactDialog | — | — |
| `--color-shadow-dialog` | `rgb(8 7 8 / 28%)` | Dialog drop shadow | 1: ContactDialog | — | — |
| `--color-shadow-bar` | `rgb(26 25 24 / 4%)` | Hero bar shadow when scrolled | 1: HeroBar (note: different base color than the other shadow) | — | — |

### On dark (TL;DR dial block)
Used on top of the `--color-ink` panel. All three are `--color-bg` (`#F9F7F3`) at different opacity.

| Token | Value | Role | Uses / where | Today's name | Figma |
|---|---|---|---|---|---|
| `--color-on-dark-muted` | `rgb(249 247 243 / 55%)` | Legend text | 1: blocks.css | — | — |
| `--color-on-dark-faint` | `rgb(249 247 243 / 40%)` | Muted legend dot | 1: blocks.css | — | — |
| `--color-on-dark-line` | `rgb(249 247 243 / 14%)` | Unfilled part of the dial | 1: inline style in `TLDR.jsx` | — | — |

## 3. Overlaps and conflicts found (decide in Figma)
- **Two blues** for primary buttons: `#2092E9` family (hero bar) vs `#5D9BFF` family (home). Pick one, then drop `-alt`.
- **Three near-identical darks**: `#080708`, `#1A1A1A`, `#323232`. Probably collapse to `--color-ink` plus one soft variant.
- **Two warm backgrounds**: `#F9F7F3` (everywhere else) vs `#F4EFEA` (home only).
- **Label on primary button**: `#F9F7F3` in the hero bar, `#FFFFFF` on the home button.
- **Focus outline color** is inconsistent: orange in case pages, blue in hero bar and dialog. Needs a single `--color-focus`.
- **Hover/pressed for dark and orange-subtle buttons** use one-off values (`#FAE5CF`, `#FAE1C6`, `#323232`, `#1A1A1A`). Decide the state system once.
- **Shadows** use different base colors (`8 7 8` vs `26 25 24`).
- `--cs-accent-faint` and `--cs-rule` are alphas of the accent; keep them as accent variants.

## 4. Extending the table (Figma is the source)
1. Create or change the color as a **Figma variable**; the CSS token name follows the role: `--color-{role}[-{variant}]`.
2. Add a row here: token, value, role, and the Figma variable name in the last column.
3. Add the token to `tokens.css`; replace the hardcoded value in the component you are touching, not everywhere at once.
4. A value that exists in code but not here is a bug in this file: add it, do not ignore it.

## 5. Not tokens
- Icon fills in `src/assets/icons/*.svg`: `#3D3D3A` (`ic-collapse`, `ic-expand`), `#323232` (`ic-arrow-up-right-sm`, `ic-close-circle`), `#F29559` (`ic-download`), `#FF8811` (`ic-arrow`). Should become `currentColor` or tokens; only `ic-chevron-left` uses `currentColor` today.
- Blue glyph/brand fills: `#1789FC` (`ic-linkedin`, `ic-mail`, `ic-telegram`), `#29A9EB` (`ic-telegram-circle`), and in the sprite `public/icons.svg`: `#0A66C2` (LinkedIn), `#2AABEE` (Telegram), `#3B82F6`. Brand colors of third-party logos can stay hardcoded; the generic blue `#1789FC` on mail/links is a candidate for `--color-primary`.
- `src/App.css`, `src/assets/vite.svg`: Vite-template leftovers (unused).

## 6. Rules for Claude Code
- Do not add a hex or `rgb()` value that is not in section 2. Need a new color: propose a token name and role, wait for Figma.
- Until `tokens.css` exists, write the value from this table and add `/* token: --color-xxx */` next to it so migration is mechanical.
- Do not silently merge or snap values listed in section 3: they are visible design decisions.
