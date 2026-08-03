import { NextResponse } from "next/server";
import { getLithuanianLockers } from "@/lib/lockers";

/**
 * Proxies Omniva's public terminal feed to the browser. Not strictly
 * required (the feed itself is public), but it lets the client fetch from
 * same-origin — Omniva's endpoint sends no CORS headers, so a direct browser
 * fetch would fail — and it means the raw feed's shape can change without
 * touching the picker component.
 */
export async function GET() {
  try {
    const lockers = await getLithuanianLockers();
    return NextResponse.json({ lockers });
  } catch (error) {
    console.error("lockers: failed to fetch Omniva locations", error);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
