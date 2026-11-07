import { describe, it, expect } from "bun:test";
import { docRoutes, navItems, anchorRedirects } from "../src/routes";

const read = (path: string) =>
  Bun.file(new URL(`../${path}`, import.meta.url)).text();

const base = await read("src/layouts/Base.astro");
const nav = await read("src/components/Nav.astro");
const home = await read("src/pages/index.astro");
const print = await read("src/pages/print.astro");
const footer = await read("src/components/Footer.astro");

describe("docs routes", () => {
  it("are listed in page order with unique slugs", () => {
    expect(docRoutes.map((r) => r.label)).toEqual([
      "Start",
      "New in 2.0",
      "Overview",
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
    expect(nav).toContain("navItems.map");
    expect(nav).toContain('transition:persist="site-nav"');
    expect(nav).not.toMatch(/href="#/);
  });
});

describe("nav layout", () => {
  it("is Start, Demo, New in 2.0, a Guide menu, Security, Install", () => {
    expect(navItems.map((i) => i.label)).toEqual([
      "Start",
      "Demo",
      "New in 2.0",
      "Guide",
      "Security",
      "Install",
    ]);
    const guide = navItems.find((i) => i.kind === "menu");
    expect(guide?.kind === "menu" && guide.slugs).toEqual([
      "why",
      "features",
      "teams",
      "commands",
    ]);
  });

  it("reaches every docs route exactly once", () => {
    const slugs = navItems.flatMap((i) =>
      i.kind === "menu" ? i.slugs : i.hash ? [] : [i.slug],
    );
    expect(slugs.sort()).toEqual(docRoutes.map((r) => r.slug).sort());
  });

  it("points Demo at the recording tabs on /start", async () => {
    const demo = navItems.find((i) => i.label === "Demo");
    expect(demo).toMatchObject({ kind: "link", slug: "start", hash: "demo" });
    const qs = await read("src/components/QuickStart.astro");
    expect(qs).toMatch(/<div id="demo"[^>]*>[\s\S]*class="qs__tabs"/);
  });

  it("gives each recording tab a link that can be forwarded", async () => {
    const qs = await read("src/components/QuickStart.astro");
    expect(qs).toContain('id: "enclave"');
    expect(qs).toContain('id: "yubikey"');
    expect(qs).toContain("id={`demo-${c.id}`}"); // → /start#demo-yubikey
    expect(qs).toContain("history.replaceState(history.state");
    expect(qs).toContain('window.addEventListener("hashchange"');
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
