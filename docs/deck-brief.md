# PRTFL'26 Case Deck — brief for Claude Code

Status as of 2026-11-14. The source is `prtfl26-deck.html`, a single self-contained HTML file of ~800 KB with images embedded as data:URIs. The latest version is also published as a claude.ai artifact (v109); the file and the artifact are identical.

---

## 1. Goal

A single HTML deck of Almaz Isakov's portfolio cases (Lead Product Designer, Halyk Market). It serves three purposes:

1. **A page on the portfolio site:** a scroll-driven presentation of the cases (scrollytelling).
2. **A deck for interviews:** keyboard control, one slide = one idea, minimal text; the depth is told live.
3. **The source of frames for the walkthrough video:** it replaces Figma Motion. There is a safe zone for the camera circle and a "clean frame" mode.

**Reader:** a recruiter or hiring manager in the EU/USA who doesn't know Kazakhstan or the local products. The essence must come across fast, with context explained where it's needed.

## 2. Content and structure (18 slides)

| # | Chapter | Slide | Status |
|---|---|---|---|
| 1 | intro | Hi, I’m *Almaz* + one line + round photo | done |
| 2 | intro | Three stories: chapter list (buttons) | done |
| 3 | checkout | Cover: context + metric 65.6% → 70.2% | done |
| 4 | checkout | Problem: 5 real screens in an iPhone frame, tags Our app / Payment system, arrows, footnote | done |
| 5 | checkout | Discovery: 3 evidence cards (Call center, UX audit, Benchmark) + conclusion | done |
| 6 | checkout | Decision "One page. One scroll." | **placeholders** |
| 7 | checkout | Craft "A card that looks like your card": a deck of 3 cards flies into the picker | done |
| 8 | checkout | Result: A/B, +4.6 pp, clock −20%, "5 of 6" | done |
| 9 | checkout | Reflection "Two problems, not one" | draft |
| 10–16 | pim | DCB PIM case (v1): code visuals and placeholders | draft |
| 17 | system | Design system: "Coming soon" stub | TBD |
| 18 | outro | Thank you, contacts (Copy email), Download CV (`cv.pdf` next to the file) | done |

Case texts come from Obsidian (vault Library → `1-projects/portfolio/cases`): "✅ Checkout · video script · EN · v3", "✅ PIM · video script · EN · v1". Files marked ✅ are not to be overwritten.

## 3. Requirements and constraints

**Content**
- Minimal text on slides: short points, numbers, visuals.
- Numbers come only from Almaz's notes. Don't invent or round anything; if data is missing, mark it "number needed".
- Problem and Discovery don't repeat each other. Visual accents don't duplicate text that's already on the slide.
- No regional or internal references without an explanation (Kaspi etc.).
- Don't push cases into a single template: unity comes from tokens, fonts, grid and tone.
- NDA: no YoY/GMV growth figures.
- Blur personal data in screenshots: addresses, names and phones, order and receipt numbers. **Don't blur demo amounts and balances from mockups**, because it makes the picture dirty.

**Visuals**
- Fonts: **Geist** (base), **Playfair Display** (accents only: headline words, quotes, numbers; italic allowed), **Geist Mono** (eyebrows). Loaded from Google Fonts. No other fonts.
- Colors only from `:root` tokens (from `claude/color-tokens.md`): `--color-ink #080708`, `--color-body #383737`, `--color-muted #706E69`, `--color-bg #F9F7F3`, `--color-surface #FFFFFF`, `--color-sand #F3E8D3`, `--color-accent #FF8811`, `--color-accent-subtle`, `--color-accent-border`, `--color-primary #2092E9`, `--color-on-primary`, `--color-success #2C9E5A`, `--color-overlay`, `--color-shadow-warm #7B4421`, `--color-sticky #FCC934` (**new, needs to be added to color-tokens.md**). Don't introduce new hex values; propose a token instead.
  - Exception: brand assets inside images and SVGs (bank cards, phone frame) keep their own colors.
- Accent numbers and conclusions are blue `--color-primary`. Orange remains on some slides; whether to repaint it is undecided.
- Background is dotted paper (44px grid, 3px dot).
- Secondary text (`.ctx`, `.meta`) is 27px.

**Platform**
- Desktop and tablet only: `min-width: 768px`. On phones Almaz will show his own stub that sends visitors to a computer. The old portrait `.P` styles are still in the file but unused, so they can be removed.
- Accessibility: keyboard, visible focus, `aria-label` on slides and visuals, `prefers-reduced-motion` (no in-between frames, steps switch instantly).

## 4. Technical implementation

### Stage and layout
- Stage 1920×1080 (`.stage`), scaled to fit the window in `layout()` (`MIN_W = 768`).
- `.slide` is absolute inset 0, a grid: text column `--col-text` (600px) + visual `1fr`, gap `--gap-col`, padding `--pad-top/--pad-x/--pad-bottom`.
  - `.slide.wide`: one column, heading on top.
  - `.slide.center`: centered.
  - `.slide.intro`: a special layout.
- `.txt` holds `.eyebrow` (Mono), `h2` (Geist + `<span class="serif">` for Playfair) and `.meta`/`.ctx`. `.vis` holds the visual.

### Scroll-scrub
- Each slide has `data-steps="N"`, and the global position is the sum of steps. A `#track` with height N×vh sets the scroll length.
- `render()` writes `--k` to each slide (0…steps−1, fractional values while scrolling), plus `--in`/`--out` for the transition between slides.
- Primitives:
  - `.rv` appears at `--at`;
  - `.dm` dims at `--dat`;
  - `.hl` lights up at `--hat`.
  - Each uses a ramp `--v = clamp(0, (k − at + 1) × 2, 1)`, which reaches full value at k = at − 0.5.
- `tick()` gives smooth following. `settle()` runs ~140ms after the scroll stops and finishes the motion to the nearest step in the direction of scrolling (`animateSeq`, cubic ease).
- Complex visuals compute positions directly from `--k` with `calc()`. Example: Craft, where smoothstep is computed in CSS as `q*q*(3-2q)`.

### Controls
- →/↓/PageDown/Space/Enter: next slide; `playSlide()` plays all its steps to the final state.
- ←/↑/PageUp/Shift+Space: previous slide, already in its final state.
- Home/End; **1–5** jump to chapters (intro, checkout, pim, system, outro).
- **H** hides the chrome (`body.clean`); **R** toggles the camera-circle safe zone (`.stage.rec`, right padding 420px); **F** fullscreen; **T** opens the Design controls panel.
- `?record` in the URL gives a clean frame for recording.
- Hash routing by chapter (`#checkout`, `#pim`…), updated with `history.replaceState`.
- Chapter nav at the top (`data-go`), slide counter "7 / 18", progress bar at the bottom.

### Design controls (T)
- The `CONTROLS` array holds groups of `[cssVar, label, min, max, step]` entries, rendered as sliders and number fields that write to `:root`.
- Values are stored in `localStorage['prtfl-design']`.
- "Copy changes" puts a list of the changed values in the clipboard as `--var: value;`. Almaz sends it, and the values are hard-coded into `:root`.
- "Reset all" resets everything. The panel is hidden by default (`.tune[hidden]{display:none}`).

### Notable slides
- **Problem:** arrows between tags are drawn in JS by `placeArrows()`, 6px short of each tag. Variables: `--inset`, `--tag-gap`, `--note-gap`, `--gap-problem`.
- **Discovery / Call center:** the scroll-driven speech bubble is a CSS animation of the `--k` variable.
- **Craft** (`.s-craft`, `data-steps="4"`):
  - `.vis` is static; `.craft` is absolute over the whole slide, so coordinates are in stage px.
  - Phone: the Figma mock PHONE (1280×2642) with the placeholder screen baked into one webp. It is displayed at 488.5×1008, left 922.4, top 46.
  - The final screen (cards, names, amounts) is the CSS variable `--full`. It is revealed by three `.crow` layers with `clip-path` rows, each fading in when its card lands.
  - Cards are 3 SVGs (Halyk Bonus / Black / Digital), width 380px. Each card `i`:
    - depth `--d = clamp(0, i − k, 3)`: the deck runs bottom-up, offset 30px, scale −8% per level;
    - flight `--f = smoothstep((k − i)/.85)` from `(x0 519, y0 670)` to the list row (`x2 1040.5`, `y2` 544.1 / 621.3 / 698.5), with scaleX .1793 and scaleY .2033 at the end;
    - crossfade at k ∈ [i+.75, i+1].
  - `.clabel` under the deck shows the name of the card on top.
- **Result:** trend SVG `preserveAspectRatio="xMidYMax slice"`. Clock: the full dial is the old 1:15 (grey), the blue arc is 80%. Variables `--r-*`, `--fs-hero`, `--fs-donut`, `--clock-w`.

### Exporting from Figma
- File `WB6HOVOX5FkQlkzAkiz8Ia` (Portfolio). Nodes:
  - PHONE `929:4479`;
  - card selection screen `925:2790`;
  - same screen with placeholders `929:4079`;
  - cards `925:4025` / `925:4043` / `925:4061`.
- High-res workaround: clone the PHONE mock, hide `ui` and the contents of `2-SCREEN`, put inside it a clone of the screen with `rescale(1170/393)`, take a screenshot at 1280×2642, **delete the clones** (`TMP_craft_export_*`).
- Vectors come out via `exportAsync({format:'SVG_STRING'})`.
- Images are converted to webp (q≈88, width ~1100 for phones, 600 for Problem screens).

## 5. Work rules
- After every change, check the result with a screenshot (Playwright, viewport 1920×1080 and 1440×810). For a scrub, set `--k` on the slide manually and capture intermediate frames.
- Agree on file formats briefly before creating them. Record design decisions in project docs.
- Write new versions of Obsidian files alongside the originals. Don't touch files marked ✅ or `.obsidian/`.

## 6. Open questions (waiting on Almaz)
1. Checkout time: script v3 says −20% (≈1:15 → 1:00), but Almaz recalls 2–2.5 min.
2. Exact wording of the follow-up question to the 6 users (Result).
3. Can the review table (internal data) on Call center be shown?
4. Kaspi / Ozon / WB logos in Benchmark (regional references).
5. Add `--color-sticky` to color-tokens.md; repaint the remaining orange to blue; keep the rollout line on Result.
6. Craft: replace the meta text "Saved‑card selection".
7. Placeholders: Decision, all of PIM; Design system and Outro are TBD.
8. A separate HTML with only the Result slide (was requested, not done).

## 7. Suggestions for the move to the repo (optional)
- Put the deck in the repo `almazisak/portfolio`, for example as `public/deck/index.html`, or as a separate Vite route.
- To make diffs readable, move the base64 images out to `public/deck/img/*.webp` and the CSS/JS into separate files, then build back into a single file for distribution if needed.
- Delete the unused `.P` (portrait) styles and old classes (`.bankcard`, `.cardrow`, `.screen`, `.vbars` if no longer used).
