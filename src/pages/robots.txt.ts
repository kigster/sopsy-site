import type { APIRoute } from "astro";
import { robotsTxt } from "../seo";

// Absolute URLs need `site` from astro.config.mjs.
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("robots.txt needs `site` set in astro.config.mjs");
  return new Response(robotsTxt(site), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
