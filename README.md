# sopsy-site

The marketing site for [**sopsy**](https://github.com/kigster/sopsy) — *the missing
developer experience for [SOPS](https://github.com/getsops/sops)*.

Built with [Astro 7](https://astro.build): a static, zero-JS-by-default site with a
sprinkle of vanilla JavaScript only where it earns its keep (clipboard copy buttons,
scroll-reveal). The design is a bold-maximal "cryptographic terminal" aesthetic —
near-black canvas, rust-orange and acid-lime accents, set in Syne / Hanken Grotesk /
JetBrains Mono.

This project uses [**Bun**](https://bun.com) as its package manager and task runner.

## Prerequisites

- [Bun](https://bun.com) ≥ 1.3 (`curl -fsSL https://bun.sh/install | bash`)
- That's it — Astro and all other dependencies are installed by `bun install`.

## Development

```bash
bun install          # install dependencies
bun run dev          # start the dev server with hot-module reloading
```

The dev server runs at **http://localhost:4321**. Edits to any `.astro`, `.css`, or
asset file reload the browser automatically.

## Build & run in production

The site compiles to a folder of static HTML/CSS/JS — no Node server required at
runtime. Host it on any static host (Netlify, Cloudflare Pages, GitHub Pages, S3, an
`nginx` root, etc.).

```bash
bun run build        # generate the static site into ./dist
bun run preview      # serve ./dist locally to verify the production build
```

`bun run build` writes everything to **`dist/`** (gitignored). To deploy, upload the
contents of `dist/` to your host, or point your host's build command at
`bun run build` with a publish directory of `dist`.

The canonical site URL is configured in [`astro.config.mjs`](astro.config.mjs) via
`site:` (currently `https://sopsy.dev`); update it if the domain changes, as it
affects generated absolute URLs.

## Project structure

```
src/
  pages/index.astro      # the single page — imports and orders every section
  layouts/Base.astro     # <head>, Google Fonts, and the scroll-reveal + copy JS
  components/*.astro      # one component per page section (Hero, Features, …)
  styles/global.css       # design system: tokens, type scale, all section styles
public/                   # static assets served as-is (favicon.svg, etc.)
astro.config.mjs          # site URL + build options
```

The page is assembled in `src/pages/index.astro`, which imports each section
component and renders them in order inside `Base.astro`.

## Adding or editing content

Most sections are **data-driven**: the component defines a small array in its
frontmatter (the `---` block at the top) and maps over it to render cards/rows. To
change copy, edit that array — you rarely touch markup.

- **Edit text in an existing section** — open the matching component in
  `src/components/`. For example, the command cards live in `Commands.astro`'s `cmds`
  array; features in `Features.astro`'s `features` array; the key-flow diagram in
  `Statement.astro`'s `steps` array. Edit the strings and save.
- **Add a new section** — create `src/components/MySection.astro`, then import it in
  `src/pages/index.astro` and place `<MySection />` where you want it in the order.
- **Restyle** — design tokens (colors, fonts, the fluid type scale) and every section's
  classes live in `src/styles/global.css`. Prefer the existing CSS variables
  (`--rust`, `--lime`, `--step-*`, etc.) over hard-coded values.
- **Static assets** — drop files in `public/`; reference them with a root-absolute
  path (e.g. `/favicon.svg`).

> Note: the product copy mirrors the upstream docs in the sibling `sopsy` repository
> (`README.md`, `docs/guide-member.md`, `docs/guide-owner.md`). When sopsy's workflow
> changes, update the relevant component arrays here to match.

## License

MIT / Apache-2.0, matching the sopsy project.
