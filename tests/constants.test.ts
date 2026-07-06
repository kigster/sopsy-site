import { describe, it, expect } from "bun:test";
import { SOPSY_VERSION } from "../src/constants";

// package.json is the second place the version lives; the constant's own
// comment promises they stay in lockstep, so guard exactly that invariant.
const pkg = (await Bun.file(
  new URL("../package.json", import.meta.url),
).json()) as { version: string };

// SemVer core (major.minor.patch) with an optional pre-release/build suffix.
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

describe("SOPSY_VERSION", () => {
  it("is a non-empty string", () => {
    expect(typeof SOPSY_VERSION).toBe("string");
    expect(SOPSY_VERSION.length).toBeGreaterThan(0);
  });

  it("is a valid semantic version", () => {
    expect(SOPSY_VERSION).toMatch(SEMVER);
  });

  it("has no surrounding whitespace", () => {
    expect(SOPSY_VERSION).toBe(SOPSY_VERSION.trim());
  });

  it("matches the package.json version", () => {
    // Catches the classic half-bump: releasing sopsy and forgetting one file.
    expect(SOPSY_VERSION).toBe(pkg.version);
  });
});
