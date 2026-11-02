# Nightzuku Web

[![Deploy](https://github.com/kerneldroid/Nightzuku-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/kerneldroid/Nightzuku-web/actions/workflows/deploy.yml)

Landing page for [Nightzuku](https://github.com/kerneldroid/Nightzuku) — a Shizuku fork with a dual-wire IPC protocol, ADB modules and a Material 3 Expressive UI.

**Live:** https://kerneldroid.github.io/nightzuku/

## Stack

- React 19 + TypeScript
- Vite 7 with [`vite-plugin-singlefile`](https://github.com/richardtallent/vite-plugin-singlefile) — the build is one self-contained `index.html`
- Tailwind CSS 4
- Motion (spring-based M3 Expressive motion tokens)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) — the palette is generated from the screenshot currently shown in the gallery

## Dynamic theme

There are no hard-coded accent colours at runtime. `src/theme/theme.ts`:

1. Loads the active screenshot from `raw.githubusercontent.com` (CORS enabled).
2. Quantizes it to one source colour with `sourceColorFromImage`.
3. Builds an M3 `SchemeTonalSpot` dark scheme.
4. Writes `--color-*` tokens on `:root` and updates `<meta name="theme-color">`.

Clicking another screenshot — or switching Phone / Wear OS / Android TV — re-derives the palette. The values in `src/index.css` are fallbacks only, used until the first image is quantized or if it fails to load.

## Performance notes

- Theme quantization runs in a `requestIdleCallback`, off the first paint; the static palette is used until it lands.
- ASCII decoding is capped at 30fps, uses precomputed per-cell noise and reuses colour strings; the canvas releases its backing store once the screenshot resolves.
- `MorphShape` stops its spring loop when it leaves the viewport.
- Only Doto 900 and Space Mono 400/700 are fetched; the hero screenshot is preconnected and preloaded.
- The ambient layers avoid `filter: blur()` so scrolling stays on the compositor.

## Local development

```bash
npm install
npm run dev
```

`npm run build` writes a single-file bundle to `dist/index.html`; `npm run preview` serves it locally.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`:

1. `npm ci`
2. `npm run build`
3. Clones `kerneldroid/kerneldroid.github.io` over SSH using the `PAGES_DEPLOY_KEY` secret.
4. Copies `dist/index.html` to `nightzuku/index.html`, commits and pushes.

GitHub Pages for `kerneldroid.github.io` is configured to serve `main` from the repository root, so the push publishes https://kerneldroid.github.io/nightzuku/ directly.

### Required secret

| Secret | Purpose |
| --- | --- |
| `PAGES_DEPLOY_KEY` | Private half of an SSH **deploy key** with write access to `kerneldroid/kerneldroid.github.io` |

The matching public key is registered under the Pages repository's *Settings → Deploy keys* with **Allow write access** enabled. It grants access to that one repository only.

## Project layout

```
src/
  components/       AsciiImage, AsciiCurtain, AsciiText, MorphShape, Scramble, Button
  sections/         Nav, Hero, Facts, Gallery, How, Install, Footer
  theme/            Material Color Utilities extraction + React provider
  data.ts           repository links, screenshots, copy
  index.css         Tailwind theme, fallback tokens, motion keyframes
```

## Content

Copy, version strings and screenshot URLs live in `src/data.ts`. The gallery reads the project's own PNGs from the Nightzuku repository at runtime — no mockups are bundled.

## License

Apache-2.0. Nightzuku is not affiliated with RikkaApps.
