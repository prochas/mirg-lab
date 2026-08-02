import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { PRODUCTS_TAG } from "@/sanity/lib/client";

// parseBody validates the HMAC signature via Node's crypto; it does not run
// on the edge runtime.
export const runtime = "nodejs";
// This is a side effect (cache revalidation), never a cached response.
export const dynamic = "force-dynamic";

type SanityWebhookPayload = { _type?: string };

/**
 * Configure this URL as a Sanity webhook (Studio → API → Webhooks) filtered
 * to the `product` and `material` document types, with this same value set
 * as the webhook's secret and as `SANITY_REVALIDATE_SECRET` here. On publish,
 * Sanity POSTs the changed document and this route revalidates `PRODUCTS_TAG`
 * so the 60s cache in `sanityFetch` (sanity/lib/client.ts) doesn't have to
 * expire on its own for the edit to show up.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("revalidate: SANITY_REVALIDATE_SECRET is not set");
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
    req,
    secret,
    false,
  );

  if (!isValidSignature) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }
  if (!body?._type) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // "max" is what Next 16 tells you to pass here (the deprecation warning for
  // the old single-arg form suggests it): our reads use a plain numeric
  // `next: { revalidate: 60 }`, not a named cacheLife profile, so there is no
  // matching profile to reference — this just means "purge unconditionally".
  revalidateTag(PRODUCTS_TAG, "max");
  return NextResponse.json({ revalidated: true, tag: PRODUCTS_TAG });
}
