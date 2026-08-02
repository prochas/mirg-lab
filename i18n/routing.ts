import { defineRouting } from "next-intl/routing";

export const locales = ["lt", "en"] as const;
export type Locale = (typeof locales)[number];

// Exported separately so the Sanity schema can mark the default locale's fields
// required without importing the whole next-intl routing object into Studio.
export const defaultLocale: Locale = "lt";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // `as-needed` keeps Lithuanian on the bare paths (`/`, `/products/rings`) and
  // prefixes English only (`/en`, `/en/products/rings`). `/lt/...` redirects to
  // the unprefixed path, so there is exactly one canonical URL per locale.
  localePrefix: "as-needed",

  // No Accept-Language sniffing: `/` is Lithuanian for everyone, `/en` is English
  // for everyone. Two reasons — the shop is Lithuanian-first by decision, and
  // Google explicitly advises against varying a URL's language by request header,
  // since a crawler sending `Accept-Language: en` would then get bounced off the
  // Lithuanian home page and may never index it.
  localeDetection: false,
});
