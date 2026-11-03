import { describe, it, expect } from "bun:test";

const read = (path: string) =>
  Bun.file(new URL(`../${path}`, import.meta.url)).text();

const nav = await read("src/components/Nav.astro");
const css = await read("src/styles/global.css");

describe("nav", () => {
  it("links to GitHub with an icon that has an accessible name", () => {
    const gh = nav.match(/<a\s+class="nav__gh"[\s\S]*?<\/a>/)?.[0] ?? "";
    expect(gh).toContain('aria-label="sopsy on GitHub"');
    expect(gh).toContain("href={repo}");
    expect(gh).toContain('aria-hidden="true"'); // the SVG itself is decorative
    expect(nav).toContain('const repo = "https://github.com/kigster/sopsy"');
  });

  it("no longer shows a GitHub text button", () => {
    expect(nav).not.toContain("GitHub ↗");
  });

  it("gives the GitHub icon a visible focus style", () => {
    expect(css).toMatch(/\.nav__gh:focus-visible\s*\{[^}]*outline:/);
  });

  it("has a hamburger that exposes its state", () => {
    expect(nav).toContain('id="nav-burger"');
    expect(nav).toContain('aria-expanded="false"');
    expect(nav).toContain('aria-controls="nav-menu"');
  });

  it("collapses at the measured breakpoint", () => {
    // 1152px is the narrowest viewport where the full bar fits (see global.css).
    expect(css).toContain("@media (max-width: 1199px) {\n  .nav__burger");
  });
});

describe("layout", () => {
  it("uses the 10% wider content width", () => {
    expect(css).toContain("--container: 1298px;");
  });
});
