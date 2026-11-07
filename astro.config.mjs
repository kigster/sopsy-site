// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
//
// Deployment target.
//
// Now: GitHub Pages project site at https://kigster.github.io/sopsy-site/ — this
// needs `base: '/sopsy-site'` so every asset resolves under the subpath.
//
// Later (custom domain sopsy-cli.dev served at the root): set
//   site: 'https://sopsy-cli.dev'
//   base: '/'
// add `public/CNAME` containing `sopsy-cli.dev`, and point DNS at GitHub Pages.
//
// `base` keeps a trailing slash so `import.meta.env.BASE_URL` is '/sopsy-site/'
// (or '/' for the root domain); asset refs concatenate cleanly in both cases.
export default defineConfig({
  // The live domain. Social previews (og:image) need absolute URLs from it.
  site: "https://sopsy-cli.dev",
  base: "/",
  // Pages build to <slug>/index.html and the host 301s /new → /new/, so every
  // URL we emit (links, sitemap, og:url) uses the slash form. routeHref matches.
  trailingSlash: "always",
  // Static, zero-JS-by-default marketing site. Sprinkle of vanilla JS only
  // where it earns its keep (copy buttons, scroll reveal).
  build: {
    inlineStylesheets: "auto",
  },
});
