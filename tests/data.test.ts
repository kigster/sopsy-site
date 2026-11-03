import { describe, it, expect } from "bun:test";
import { whatsNew } from "../src/data/whatsnew";
import { team, dennisPolicy, cachingTips } from "../src/data/teams";

// Subcommands sopsy 2.0 ships, from the sopsy README "Command Reference".
// A command on the site that is not in this list does not exist.
const SUBCOMMANDS = new Set([
  "init",
  "doctor",
  "edit",
  "join",
  "request-access",
  "approve",
  "recipient",
  "encrypt",
  "decrypt",
  "types",
  "check",
  "deps",
  "completion",
  "run",
  "set",
  "unset",
  "rotate-data-key",
  "yubikey",
  "enclave",
]);

// Flags the site's new sections use, each checked against the sopsy README.
const FLAGS = new Set([
  "-A",
  "--allow-stores",
  "-s",
  "-c",
  "-b",
  "-t",
  "--skip-deps",
  "--new-data-key",
  "--list",
  "--help",
]);

// Placeholder people must be fictional or historical. These are real.
const FORBIDDEN = [/konstantin/i, /gredeskoul/i, /elena/i, /bondarchuk/i];
const ALLOWED_PEOPLE = new Set([
  "Ada",
  "Alan Turing",
  "Grace Hopper",
  "Dennis Ritchie",
]);

const sopsyCommands = [
  ...whatsNew.flatMap((n) => n.cmds),
  ...team.map((m) => m.cmd),
  ...dennisPolicy.map((r) => r.cmd),
  ...cachingTips.map((t) => t.cmd),
].map((c) => c.split("|").pop()!.trim()); // `op read … | sopsy set KEY`

describe("sopsy commands shown in the 2.0 sections", () => {
  it("all call sopsy", () => {
    for (const cmd of sopsyCommands) expect(cmd).toStartWith("sopsy ");
  });

  it("use only subcommands that exist", () => {
    for (const cmd of sopsyCommands) {
      expect(SUBCOMMANDS.has(cmd.split(/\s+/)[1])).toBe(true);
    }
  });

  it("use only flags documented in the sopsy README", () => {
    for (const cmd of sopsyCommands) {
      // Everything after a bare `--` belongs to the wrapped command.
      const own = cmd.split(" -- ")[0];
      for (const flag of own.match(/(?<=\s)--?[A-Za-z][\w-]*/g) ?? []) {
        expect(FLAGS.has(flag)).toBe(true);
      }
    }
  });
});

describe("What's new in 2.0", () => {
  it("has a title, body and at least one command per card", () => {
    expect(whatsNew.length).toBeGreaterThan(0);
    for (const n of whatsNew) {
      expect(n.title.length).toBeGreaterThan(0);
      expect(n.body.length).toBeGreaterThan(0);
      expect(n.cmds.length).toBeGreaterThan(0);
    }
  });

  it("has unique tags", () => {
    const tags = whatsNew.map((n) => n.tag);
    expect(new Set(tags).size).toBe(tags.length);
  });

  it("covers the headline 2.0 commands", () => {
    const all = whatsNew.flatMap((n) => n.cmds).join("\n");
    for (const needle of [
      "--allow-stores",
      "sopsy run",
      "sopsy set",
      "sopsy recipient rotate",
      "sopsy rotate-data-key",
      "sopsy deps",
      "sopsy yubikey",
      "sopsy enclave",
    ]) {
      expect(all).toContain(needle);
    }
  });

  it("does not overclaim what rotating a key does", () => {
    // Rotating or removing a recipient keeps the data key; the copy must say
    // so and point at the commands that actually replace it.
    const rotate = whatsNew.find((n) => n.tag === "rotate")!;
    expect(rotate.body).toContain("not the data key itself");
    expect(rotate.body).toContain("--new-data-key");
    expect(rotate.body).toContain("change the secret values");
  });
});

describe("Team scenarios", () => {
  it("has one card per store story, in README order", () => {
    expect(team.map((m) => m.accent)).toEqual([
      "policy",
      "yubikey",
      "enclave",
      "linux",
    ]);
  });

  it("uses only the README's historical placeholder people", () => {
    for (const m of team) expect(ALLOWED_PEOPLE.has(m.name)).toBe(true);
  });

  it("shows every policy outcome for Dennis", () => {
    expect(dennisPolicy.map((r) => r.tone)).toEqual(["refused", "ok", "warn"]);
    for (const r of dennisPolicy) expect(r.cmd).toContain("Dennis Ritchie");
  });
});

describe("site copy", () => {
  it("never uses forbidden real names as placeholders", async () => {
    const glob = new Bun.Glob("src/{data,components,pages}/**/*.{ts,astro}");
    const root = new URL("..", import.meta.url).pathname;
    for await (const path of glob.scan(root)) {
      // The footer's copyright line names the real author, by design.
      if (path.endsWith("Footer.astro")) continue;
      const text = await Bun.file(root + path).text();
      for (const re of FORBIDDEN) expect(text).not.toMatch(re);
    }
  });

  it("never shows sopsy commands that do not exist", async () => {
    // `sopsy setup …` and `init --require` were never shipped.
    const glob = new Bun.Glob("src/components/**/*.astro");
    const root = new URL("..", import.meta.url).pathname;
    for await (const path of glob.scan(root)) {
      const text = await Bun.file(root + path).text();
      expect(text).not.toContain("sopsy setup");
      expect(text).not.toContain("--require");
      expect(text).not.toContain("brew trust kigster/tap");
    }
  });
});
