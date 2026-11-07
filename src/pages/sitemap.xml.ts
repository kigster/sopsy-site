import type { APIRoute } from "astro";
import { sitemapXml } from "../seo";

// Absolute URLs need `site` from astro.config.mjs.
export const GET: APIRoute = ({ site }) => {
  if (!site)
    throw new Error("sitemap.xml needs `site` set in astro.config.mjs");
  return new Response(sitemapXml(site), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
