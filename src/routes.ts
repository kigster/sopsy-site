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

// Nav order.
export const docRoutes: DocRoute[] = [
  {
    slug: "start",
    label: "Start",
    title: "Quick start",
    anchors: ["quickstart"],
  },
  {
    slug: "new",
    label: "New",
    title: "What's new in 2.0",
    anchors: ["new"],
  },
  {
    slug: "why",
    label: "Who?",
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
