import type { Locale } from "@/i18n/routing";

/**
 * EUR prices, formatted per locale convention: `145 €` in Lithuanian,
 * `€145` in English.
 *
 * Deliberately a template string rather than `Intl.NumberFormat` — the catalog
 * only ever shows whole euros, and a plain string can't drift between the
 * server and the browser build of ICU data and trigger a hydration mismatch.
 */
export function formatPrice(amount: number, locale: Locale) {
  return locale === "en" ? `€${amount}` : `${amount} €`;
}
