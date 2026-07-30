import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { routing, type Locale } from "./routing";

/**
 * `rel=canonical` + `rel=alternate hreflang` for one page, in every locale.
 *
 * This — not the language switcher — is how Google learns that `/products/rings`
 * and `/en/products/rings` are the same page in two languages, and stops treating
 * them as duplicates competing with each other.
 *
 * `href` is the locale-independent path (`/`, `/about`, `/products/bangele`);
 * `getPathname` turns it into the real URL per locale, so the unprefixed
 * Lithuanian paths stay correct. Resolved against `metadataBase`, set in
 * `app/[locale]/layout.tsx`.
 */
export function alternatesFor(
  href: string,
  locale: Locale,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const l of routing.locales) {
    languages[l] = getPathname({ href, locale: l });
  }
  // Where to send a visitor whose language we don't publish.
  languages["x-default"] = getPathname({
    href,
    locale: routing.defaultLocale,
  });

  return {
    canonical: getPathname({ href, locale }),
    languages,
  };
}
