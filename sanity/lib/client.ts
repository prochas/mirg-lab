import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Read-only client for the shop. Safe in any context — no token, so nothing it
 * can reach is private.
 *
 * `useCdn: true` serves from Sanity's edge cache, which pairs with the 60s
 * `revalidate` in `sanityFetch` below: both layers go stale on roughly the same
 * clock, so a published edit shows up within about a minute without a redeploy.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * Server-only client with write access — used by the Stripe webhook to flip
 * `ready -> false` once an on-hand unit is sold, and by the seed script.
 *
 * The token is read lazily so importing this module never throws in the browser
 * bundle or in environments that legitimately have no write token (the read
 * path). Calling it without `SANITY_WRITE_TOKEN` set is the error case.
 */
export function getWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    throw new Error(
      'Missing environment variable: SANITY_WRITE_TOKEN (needs Editor permissions)',
    )
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    // Never the CDN for writes — it would serve a stale document to read-then-write.
    useCdn: false,
  })
}

/** Cache tag for every product/material read. The planned Sanity webhook
 *  revalidates this one tag to push content live instantly. */
export const PRODUCTS_TAG = 'products'

/**
 * The one place product reads go through, so caching is consistent.
 * Revalidates on a 60s clock and is tagged for `revalidateTag(PRODUCTS_TAG)`.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: 60, tags: [PRODUCTS_TAG] },
  })
}

/**
 * Uncached read — for money.
 *
 * The checkout route prices the order from this, so it must not come from the
 * 60s cache above or from the Sanity CDN: right after a price change either
 * would still hand out the old amount and the customer would be charged it.
 * Correctness beats saving a round-trip at the point of sale.
 */
export async function sanityFetchFresh<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return client
    .withConfig({ useCdn: false })
    .fetch<T>(query, params, { cache: 'no-store' })
}
