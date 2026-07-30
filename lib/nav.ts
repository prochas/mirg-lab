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
