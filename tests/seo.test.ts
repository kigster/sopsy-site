import { describe, it, expect } from "bun:test";
import { docRoutes } from "../src/routes";
import { robotsTxt, sitemapUrls, sitemapXml } from "../src/seo";

const read = (path: string) =>
  Bun.file(new URL(`../${path}`, import.meta.url)).text();

// The configured site, read from the config so the test follows it.
const config = await read("astro.config.mjs");
const siteMatch = config.match(/^\s*site:\s*["']([^"']+)["']/m);
const site = new URL(siteMatch![1]);

const xml = sitemapXml(site);
const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);

describe("sitemap.xml", () => {
  it("targets the live domain", () => {
    expect(site.href).toBe("https://sopsy-cli.dev/");
  });

  it("is a sitemaps.org urlset", () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(
      true,
    );
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(xml.trimEnd().endsWith("</urlset>")).toBe(true);
    expect(xml.match(/<url>/g)!.length).toBe(locs.length);
    expect(xml.match(/<\/url>/g)!.length).toBe(locs.length);
  });

  it("lists the home page and every docs route exactly once", () => {
    expect(locs).toEqual([
      "https://sopsy-cli.dev/",
      ...docRoutes.map((r) => `https://sopsy-cli.dev/${r.slug}/`),
    ]);
    expect(new Set(locs).size).toBe(locs.length);
    expect(sitemapUrls(site)).toEqual(locs);
  });

  it("leaves out the noindex /print page", () => {
    expect(locs.some((l) => new URL(l).pathname.startsWith("/print"))).toBe(
      false,
    );
  });
});

describe("robots.txt", () => {
  const robots = robotsTxt(site);

  it("lets every crawler in, /print included (its noindex must be seen)", () => {
    expect(robots).toContain("User-agent: *\nAllow: /\n");
    expect(robots).not.toMatch(/^Disallow:/m);
  });

  it("points at the absolute sitemap URL", () => {
    expect(robots).toMatch(
      /^Sitemap: https:\/\/sopsy-cli\.dev\/sitemap\.xml$/m,
    );
  });
});

describe("Base layout", () => {
  it("links the sitemap", async () => {
    expect(await read("src/layouts/Base.astro")).toContain(
      '<link rel="sitemap" href={`${import.meta.env.BASE_URL}sitemap.xml`} />',
    );
  });
});
