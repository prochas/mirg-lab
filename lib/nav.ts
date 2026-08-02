/**
 * Navigation structure, shared by the desktop nav in `Navbar` and the mobile
 * burger panel in `MobileMenu` so the two can't drift apart.
 *
 * `key` indexes the `nav` message namespace; hrefs are absolute so they still
 * resolve from `/products/*` pages.
 *
 * Real routes only — the old "Shop"/"New In" entries pointed at `/#categories`
 * and `/#featured`, which only meant anything on the home page.
 */
export const NAV_LINKS = [
  { key: "story", href: "/about" },
  { key: "faq", href: "/faq" },
  { key: "contacts", href: "/contacts" },
] as const;

/** `soon` items render as inert labels — there is no catalog behind them yet. */
export const JEWELRY_CATEGORIES = [
  { key: "rings", href: "/products/rings", soon: false },
  { key: "chains", href: "#", soon: true },
  { key: "bracelets", href: "#", soon: true },
  { key: "earrings", href: "#", soon: true },
] as const;

/**
 * Footer link groups, consumed by `Footer`. Each column's `title` key indexes
 * `footer.columns.<key>.title` and each link's `key` indexes
 * `footer.links.<key>` — same flat-lookup shape as `NAV_LINKS`.
 *
 * Real routes only, same rule as `NAV_LINKS` — no placeholder columns for
 * pages that don't exist yet (Pendants, Stacks, Newsletter, Stockists, ...).
 */
export const FOOTER_COLUMNS = [
  {
    key: "shop",
    links: [{ key: "rings", href: "/products/rings" }],
  },
  {
    key: "studio",
    links: [
      { key: "about", href: "/about" },
      { key: "faq", href: "/faq" },
    ],
  },
  {
    key: "contact",
    links: [{ key: "contacts", href: "/contacts" }],
  },
  {
    key: "legal",
    links: [
      { key: "terms", href: "/terms" },
      { key: "privacy", href: "/privacy" },
      { key: "returns", href: "/returns" },
    ],
  },
] as const;
