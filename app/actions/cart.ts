"use server";

import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { MAX_QTY, resolveCart, type CartItem, type CartLine } from "@/lib/cart";

/** Hard cap on distinct lines per request — this is a public endpoint. */
const MAX_LINES = 50;

/**
 * Turns the client's `{ id, size, qty }` lines into displayable items.
 *
 * A server action rather than embedding the catalog in every page: only the ids
 * actually in the cart are resolved, so this stays flat as the catalog grows.
 *
 * Every server action is a public POST endpoint, so the input is treated as
 * untrusted — shape-checked and capped. It only ever reads public catalog data
 * and returns no secrets, and prices here are for *display*; the checkout route
 * re-reads them from Sanity and never trusts a client amount.
 */
export async function resolveCartAction(
  lines: unknown,
  locale: string,
): Promise<CartItem[]> {
  if (!hasLocale(routing.locales, locale)) return [];
  if (!Array.isArray(lines) || lines.length === 0) return [];

  const clean: CartLine[] = [];
  for (const line of lines.slice(0, MAX_LINES)) {
    if (typeof line !== "object" || line === null) continue;
    const { id, size, qty } = line as Record<string, unknown>;
    if (typeof id !== "string" || typeof size !== "string") continue;
    if (!id || id.length > 200 || size.length > 20) continue;
    const n = typeof qty === "number" && Number.isFinite(qty) ? Math.floor(qty) : 1;
    clean.push({ id, size, qty: Math.min(Math.max(1, n), MAX_QTY) });
  }
  if (clean.length === 0) return [];

  const t = await getTranslations({ locale, namespace: "fulfillment" });
  return resolveCart(clean, locale, t);
}
