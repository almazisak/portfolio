# PRTFL'26

Personal portfolio of Almaz Isakov, product designer.

Live: https://portfolio-ruddy-omega-58.vercel.app

## Stack

- [Astro](https://astro.build) 7, static output
- React 19 islands for interactive parts
- Plain CSS per component, design tokens in `src/styles/tokens.css`
- SVGR for UI icons, deployed on Vercel

## Getting started

```sh
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the build locally
npm run lint     # ESLint
```

`dev` and `build` first run `scripts/fetch-notes.mjs`, which pulls project notes from
[almazisak/portfolio-notes](https://github.com/almazisak/portfolio-notes).
To use a local checkout instead: `NOTES_SRC=../portfolio-notes npm run dev`.

## Structure

```
src/pages/       routes: home, /work/*, /notes/*
src/views/       page views (home, case deck, Balaty, notes)
src/components/  shared components (contact dialog, hero bar)
src/styles/      tokens and global styles
public/          static assets, OG images, icon sprite
docs/            architecture and color tokens
```

More detail in [`docs/architecture.md`](docs/architecture.md) and [`docs/color-tokens.md`](docs/color-tokens.md).
