// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sopsy.dev',
  // Static, zero-JS-by-default marketing site. Sprinkle of vanilla JS only
  // where it earns its keep (copy buttons, scroll reveal).
  build: {
    inlineStylesheets: 'auto',
  },
});
