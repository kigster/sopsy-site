import { describe, it, expect } from "bun:test";

const read = (path: string) =>
  Bun.file(new URL(`../${path}`, import.meta.url)).text();

const css = await read("src/styles/print.css");
const base = await read("src/layouts/Base.astro");

describe("print stylesheet", () => {
  it("is loaded by the shared layout", () => {
    expect(base).toContain('import "../styles/print.css";');
  });

  it("only applies to print", () => {
    expect(css.trim()).toMatch(/^\/\*[\s\S]*?\*\/\s*@media print \{[\s\S]*\}$/);
  });

  it("forces black text on white", () => {
    expect(css).toContain("color: #000 !important;");
    expect(css).toContain("background: #fff !important;");
  });

  it("hides the nav, theme toggle and copy buttons", () => {
    for (const sel of [".nav,", ".theme-toggle,", ".copyfield button,"]) {
      expect(css).toContain(sel);
    }
  });

  it("prints external URLs but not in-page anchors", () => {
    expect(css).toContain('a[href^="http"]::after');
    expect(css).toMatch(/a\[href\^="#"\]::after[\s\S]*?content: none/);
  });
});
