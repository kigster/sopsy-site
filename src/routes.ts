// The one list of docs routes. The nav, every route page, /print and the
// old-anchor redirect all read it. Plain data, so tests can import it; the
// section components for each slug live in sections.ts.

export interface DocRoute {
  /** URL segment: /<slug> */
  slug: string;
  /** Nav label */
  label: string;
  /** Page heading and <title> */
  title: string;
  /** Section ids of the old one-page site that now live here */
  anchors: string[];
}

// Page order (also /print's order). The nav's own layout is navItems below.
export const docRoutes: DocRoute[] = [
  {
    slug: "start",
    label: "Start",
    title: "Quick start",
    anchors: ["quickstart"],
  },
  {
    slug: "new",
    label: "New in 2.0",
    title: "What's new in 2.0",
    anchors: ["new"],
  },
  {
    slug: "why",
    label: "Overview",
    title: "Who sopsy is for",
    anchors: ["why"],
  },
  {
    slug: "features",
    label: "Features",
    title: "Features",
    anchors: ["features", "flow", "ci", "prevent"],
  },
  {
    slug: "teams",
    label: "Teams",
    title: "Teams and onboarding",
    anchors: ["onboarding", "teams"],
  },
  {
    slug: "security",
    label: "Security",
    title: "Security model",
    anchors: ["security"],
  },
  {
    slug: "commands",
    label: "Commands",
    title: "Command reference",
    anchors: ["commands"],
  },
  {
    slug: "install",
    label: "Install",
    title: "Install",
    anchors: ["install"],
  },
];

/** A top-nav entry: a link to a route (optionally a #hash in it), or a
 *  dropdown of routes. */
export type NavItem =
  | { kind: "link"; slug: string; label: string; hash?: string }
  | { kind: "menu"; id: string; label: string; slugs: string[] };

const link = (slug: string): NavItem => ({
  kind: "link",
  slug,
  label: docRoutes.find((r) => r.slug === slug)!.label,
});

// Nav order. Every docs route appears exactly once (tested).
export const navItems: NavItem[] = [
  link("start"),
  { kind: "link", slug: "start", hash: "demo", label: "Demo" },
  link("new"),
  {
    kind: "menu",
    id: "guide",
    label: "Guide",
    slugs: ["why", "features", "teams", "commands"],
  },
  link("security"),
  link("install"),
];

/** The route a slug names. */
export const routeBySlug = (slug: string): DocRoute =>
  docRoutes.find((r) => r.slug === slug)!;

/** Site-relative URL of a route, honoring the configured base. */
export const routeHref = (slug: string) =>
  `${(import.meta.env?.BASE_URL ?? "/").replace(/\/$/, "")}/${slug}`;

/** Old `/#anchor` → new URL. The first anchor of a route is its page top. */
export const anchorRedirects: Record<string, string> = Object.fromEntries(
  docRoutes.flatMap((r) =>
    r.anchors.map((a, i) => [
      a,
      i === 0 ? routeHref(r.slug) : `${routeHref(r.slug)}#${a}`,
    ]),
  ),
);
