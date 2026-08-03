/**
 * Parcel locker locations — the two carriers this shop offers a real
 * pick-a-locker map for (see CLAUDE.md "Parcel locker delivery"). LP Express
 * and DPD customers are still served, just without a map: they write their
 * chosen pickup point into the shipping address at checkout instead.
 *
 * Both feeds below are the carriers' own public, unauthenticated data — no
 * business account or API key involved. Ids are prefixed per carrier
 * (`omniva-…` / `venipak-…`) since the two feeds' raw ids aren't drawn from
 * the same namespace and could otherwise collide.
 *
 * Caching is deliberately NOT done via `fetch`'s own `next: { revalidate }` —
 * Venipak's raw feed alone is ~2.3MB, and Next's fetch Data Cache hard-caps
 * individual entries at 2MB ("items over 2MB can not be cached"), so that
 * option was failing on every request with no caching benefit at all (the
 * fetch itself still succeeded, just uncached — every request re-hit
 * Venipak's server). Both raw fetches use `cache: "no-store"` instead, and
 * `unstable_cache` wraps each carrier's *filtered* result independently —
 * a few hundred KB at most — which is what we actually want cached for a
 * day anyway. Independently, not merged into one cache entry: see the
 * comment above `getLithuanianLockers` for why that distinction matters.
 */
import { unstable_cache } from "next/cache";

export type Carrier = "omniva" | "venipak";

export type Locker = {
  id: string;
  carrier: Carrier;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

/**
 * Per-carrier picker styling. `logo` points at the real brand SVGs in
 * `public/` (provided by the shop owner); `logoRatio` is each file's actual
 * `viewBox` width/height, needed to size the wordmark without stretching it.
 *
 * `omniva.svg`'s original viewBox (`0 0 2173.0974 869.4645`) had a lot of
 * dead vertical padding around the mark — rasterizing it and measuring the
 * actual non-transparent pixels showed the artwork only filled ~59% of that
 * height (vs. ~87% for `venipak.svg`), which is why it rendered visibly
 * smaller than Venipak's at the same nominal size. The SVG's viewBox was
 * cropped to `115 136 1942 597` to match its real content — this ratio is
 * that cropped box, not the original file's numbers.
 *
 * `color` is each brand's own accent, sampled from the SVG itself.
 * `letter`/`label` stay as an accessible fallback and for anywhere a compact
 * badge (rather than the full wordmark) makes more sense, e.g. `CartDrawer`'s
 * selected-locker summary. Shared between `CartDrawer` and
 * `LockerPickerModal` so the two never disagree on carrier styling.
 */
export const CARRIER_META: Record<
  Carrier,
  { color: string; letter: string; label: string; logo: string; logoRatio: number }
> = {
  omniva: {
    color: "#ff6600",
    letter: "O",
    label: "Omniva",
    logo: "/omniva.svg",
    logoRatio: 1942 / 597,
  },
  venipak: {
    color: "#9339f2",
    letter: "V",
    label: "Venipak",
    logo: "/venipak.svg",
    logoRatio: 423.294 / 90.15,
  },
};

const OMNIVA_LOCATIONS_URL = "https://www.omniva.ee/locations.json";
const VENIPAK_LOCATIONS_URL = "https://go.venipak.lt/ws/get_pickup_points";

/** Only the fields this shop actually reads out of Omniva's raw feed. */
type OmnivaRawLocation = {
  ZIP?: string;
  NAME?: string;
  /** "0" = parcel terminal, "1" = post office — only terminals are lockers. */
  TYPE?: string;
  A0_NAME?: string;
  A2_NAME?: string;
  A3_NAME?: string;
  A5_NAME?: string;
  A7_NAME?: string;
  /** Longitude. */
  X_COORDINATE?: string;
  /** Latitude. */
  Y_COORDINATE?: string;
};

function formatOmnivaAddress(raw: OmnivaRawLocation): string {
  const street = [raw.A5_NAME, raw.A7_NAME].filter(Boolean).join(" ");
  const city = raw.A3_NAME || raw.A2_NAME || "";
  return [street, city].filter(Boolean).join(", ");
}

async function fetchOmnivaLockers(): Promise<Locker[]> {
  const res = await fetch(OMNIVA_LOCATIONS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Omniva locations fetch failed: ${res.status}`);

  const raw = (await res.json()) as OmnivaRawLocation[];

  return raw
    .filter((loc) => loc.A0_NAME === "LT" && loc.TYPE === "0")
    .map((loc) => ({
      id: `omniva-${loc.ZIP ?? ""}`,
      carrier: "omniva" as const,
      name: loc.NAME ?? "",
      address: formatOmnivaAddress(loc),
      lat: Number(loc.Y_COORDINATE),
      lng: Number(loc.X_COORDINATE),
    }))
    .filter(
      (l) => l.id !== "omniva-" && l.name && Number.isFinite(l.lat) && Number.isFinite(l.lng),
    );
}

/** Only the fields this shop actually reads out of Venipak's raw feed. */
type VenipakRawLocation = {
  id?: number;
  display_name?: string;
  address?: string;
  city?: string;
  country?: string;
  /** 3 = self-service parcel locker, 1 = staffed pickup point — only lockers. */
  type?: number;
  lat?: string;
  lng?: string;
};

async function fetchVenipakLockers(): Promise<Locker[]> {
  const res = await fetch(VENIPAK_LOCATIONS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Venipak locations fetch failed: ${res.status}`);

  const raw = (await res.json()) as VenipakRawLocation[];

  return raw
    .filter((loc) => loc.country === "LT" && loc.type === 3)
    .map((loc) => ({
      id: `venipak-${loc.id ?? ""}`,
      carrier: "venipak" as const,
      name: loc.display_name ?? "",
      address: [loc.address, loc.city].filter(Boolean).join(", "),
      lat: Number(loc.lat),
      lng: Number(loc.lng),
    }))
    .filter(
      (l) => l.id !== "venipak-" && l.name && Number.isFinite(l.lat) && Number.isFinite(l.lng),
    );
}

/**
 * Cached independently *per carrier*, not as one merged result — this
 * matters. `unstable_cache` only ever caches a *successful* resolution,
 * never a throw. Venipak's feed is the slower, flakier of the two (no CORS,
 * ~2.3MB raw, no CDN in front of it) — on a cold request with nothing
 * warmed up yet (a fresh incognito session is exactly that), its fetch can
 * reject. Caching both carriers together as one unit would mean that single
 * rejection produces an Omniva-only result which then gets locked in as
 * "the answer" for a full day. Caching them separately means a Venipak
 * failure is simply never cached — the very next request just retries
 * Venipak fresh, and Omniva's already-cached entry is untouched either way.
 */
const CACHE_REVALIDATE_SECONDS = 60 * 60 * 24;
const getCachedOmnivaLockers = unstable_cache(
  fetchOmnivaLockers,
  ["omniva-lockers"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
const getCachedVenipakLockers = unstable_cache(
  fetchVenipakLockers,
  ["venipak-lockers"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);

/**
 * Fetches and filters both carriers' public feeds down to usable Lithuanian
 * lockers, merged into one list. Neither feed sends CORS headers, which is
 * why both are read server-side rather than straight from the browser.
 *
 * If one carrier's feed fails, the other's lockers are still returned rather
 * than failing the whole picker — only throws if both fail.
 */
export async function getLithuanianLockers(): Promise<Locker[]> {
  const results = await Promise.allSettled([
    getCachedOmnivaLockers(),
    getCachedVenipakLockers(),
  ]);

  const lockers: Locker[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      lockers.push(...result.value);
    } else {
      console.error("lockers: a carrier feed failed", result.reason);
    }
  }

  if (lockers.length === 0) {
    throw new Error("Both locker feeds failed");
  }
  return lockers;
}

/** Haversine distance in kilometres — good enough for "nearest locker" sorting. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
