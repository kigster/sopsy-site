import { describe, it, expect } from "bun:test";
import { docRoutes, anchorRedirects } from "../src/routes";

const read = (path: string) =>
  Bun.file(new URL(`../${path}`, import.meta.url)).text();

const base = await read("src/layouts/Base.astro");
const nav = await read("src/components/Nav.astro");
const home = await read("src/pages/index.astro");
const print = await read("src/pages/print.astro");
const footer = await read("src/components/Footer.astro");

describe("docs routes", () => {
  it("are listed in nav order with unique slugs", () => {
    expect(docRoutes.map((r) => r.label)).toEqual([
      "Start",
      "New",
      "Who?",
      "Features",
      "Teams",
      "Security",
      "Commands",
      "Install",
    ]);
    expect(new Set(docRoutes.map((r) => r.slug)).size).toBe(docRoutes.length);
  });

  it("send every old one-page anchor to its new route", () => {
    expect(anchorRedirects).toMatchObject({
      quickstart: "/start",
      new: "/new",
      why: "/why",
      features: "/features",
      flow: "/features#flow",
      ci: "/features#ci",
      prevent: "/features#prevent",
      onboarding: "/teams",
      teams: "/teams#teams",
      security: "/security",
      commands: "/commands",
      install: "/install",
    });
    expect(home).toContain("anchorRedirects");
  });

  it("drive the nav, which persists across transitions", () => {
    expect(nav).toContain("docRoutes.map");
    expect(nav).toContain('transition:persist="site-nav"');
    expect(nav).not.toMatch(/href="#/);
  });
});

describe("page transitions", () => {
  it("use Astro's client router with a short fade", () => {
    expect(base).toContain("<ClientRouter />");
    expect(base).toContain('fade({ duration: "0.25s" })');
  });

  it("re-run page scripts on astro:page-load, not DOMContentLoaded", () => {
    expect(base).toContain('"astro:page-load"');
    expect(base).not.toContain("DOMContentLoaded");
  });
});

describe("/print", () => {
  it("renders every route from the same registry, kept out of search", () => {
    expect(print).toContain("docRoutes.map");
    expect(print).toContain("sections[r.slug]");
    expect(print).toContain("noindex");
    expect(base).toContain('<meta name="robots" content="noindex" />');
  });

  it("is linked from the footer", () => {
    expect(footer).toContain("Print all docs");
  });
});

describe("sections", () => {
  it("cover every route", async () => {
    const src = await read("src/sections.ts");
    for (const r of docRoutes)
      expect(src).toMatch(new RegExp(`\\n  ${r.slug}: \\[`));
  });
});
