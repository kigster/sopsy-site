// robots.txt and sitemap.xml bodies. Plain functions of the site URL, so
// tests can call them; src/pages/{robots.txt,sitemap.xml}.ts serve them.
// /print is deliberately absent: it duplicates every route and is noindex.

import { docRoutes, routeHref } from "./routes";

const xmlEscape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Absolute URLs of every indexable page: home, then each docs route.
 *  routeHref ends in a slash: the form the host serves without a 301. */
export const sitemapUrls = (site: URL): string[] => [
  new URL(import.meta.env?.BASE_URL ?? "/", site).href,
  ...docRoutes.map((r) => new URL(routeHref(r.slug), site).href),
];

export const sitemapXml = (site: URL): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapUrls(site).map(
      (loc) => `  <url><loc>${xmlEscape(loc)}</loc></url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");

export const robotsTxt = (site: URL): string =>
  [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("sitemap.xml", new URL(import.meta.env?.BASE_URL ?? "/", site)).href}`,
    "",
  ].join("\n");
