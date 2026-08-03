"use client";

import { useEffect, useRef, useState } from "react";
import type { DivIcon, Map as LeafletMap, Marker } from "leaflet";
import Modal from "react-modal";
import { useTranslations } from "next-intl";
import "leaflet/dist/leaflet.css";
import {
  CARRIER_META,
  distanceKm,
  type Carrier,
  type Locker,
} from "@/lib/lockers";
import { lockScroll, unlockScroll } from "./LenisProvider";

type Coords = { lat: number; lng: number };

// Vilnius — the default view before geolocation resolves (or if it's denied).
const DEFAULT_CENTER: Coords = { lat: 54.6872, lng: 25.2797 };
/** Caps both the markers drawn and the rows listed — plenty for "nearest",
 *  and thousands of pins would be slow and pointless zoomed this far out. */
const VISIBLE_LIMIT = 60;
/** Matches the fade transition defined in globals.css (`.locker-modal-*`). */
const CLOSE_TIMEOUT_MS = 400;

// Neutralizes react-modal's own default inline styles (a translucent-white
// overlay, an absolutely-positioned, padded, bordered content box) so the
// Tailwind classes below are the only thing actually drawing this modal.
// Crucially, `background` and `borderRadius` are left OUT of `content` here
// — an inline style always wins over a class, so setting either to anything
// (even "transparent" / 0) would silently override the `bg-[#fdfdfd]` and
// `rounded-t-[22px] sm:rounded-[22px]` in `className` below (the latter is
// exactly what happened before this comment existed — the card rendered
// with square corners no matter what the className said).
const MODAL_STYLE = {
  overlay: { backgroundColor: "transparent" },
  content: {
    position: "static" as const,
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    border: "none",
    overflow: "visible",
    outline: "none",
    padding: 0,
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function LockerPickerModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (locker: Locker) => void;
}) {
  const t = useTranslations("locker");

  // A state-backed (callback) ref, not a plain useRef: react-modal doesn't
  // guarantee the content's children attach to the DOM on the very same
  // render where `open` flips true, and the map-creation effect below only
  // re-runs when its dependencies change. With a plain ref, if the div
  // wasn't attached yet at that moment, `open` would never change again and
  // the effect would never retry — the map would just silently never
  // appear. Tracking the node as state means the effect re-fires the
  // instant it actually attaches, whichever render that happens on.
  const [mapEl, setMapEl] = useState<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  // Also tracked as state, alongside the ref: `leafletMod` is deliberately
  // never reset across a close/reopen (see handleAfterClose), so on reopen
  // it's the SAME value it was before — an effect keyed on `leafletMod`
  // alone has no reason to re-run just because a brand-new map replaced the
  // torn-down one. Depending on `map` (state) instead means "a fresh map
  // instance exists" is itself a change other effects can react to.
  const [map, setMap] = useState<LeafletMap | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [leafletMod, setLeafletMod] = useState<typeof import("leaflet") | null>(
    null,
  );

  const [lockers, setLockers] = useState<Locker[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch the locker list once per time the modal is opened.
  useEffect(() => {
    if (!open || lockers) return;
    let active = true;
    fetch("/api/lockers")
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<{ lockers: Locker[] }>;
      })
      .then((data) => {
        if (active) setLockers(data.lockers);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [open, lockers]);

  // Best-effort geolocation. Denial or absence just leaves the list
  // unsorted-by-distance and the map centred on Vilnius — never blocking.
  // `locating` (below) is derived rather than set here, so nothing calls
  // setState synchronously in the effect body — only from inside the
  // browser's own async callbacks.
  const [geoFailed, setGeoFailed] = useState(false);
  // Guards against React Strict Mode's double effect-invocation firing two
  // concurrent getCurrentPosition calls on the same mount — the effect's own
  // state guard (userLocation/geoFailed) can't catch that, since both calls
  // fire before either state update lands.
  const geoRequestedRef = useRef(false);

  useEffect(() => {
    if (
      !open ||
      userLocation ||
      geoFailed ||
      geoRequestedRef.current ||
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      return;
    }
    geoRequestedRef.current = true;
    // No `timeout` option: it would start counting the instant this call is
    // made, before the browser's permission prompt is even answered. A user
    // who takes more than a few seconds to click "Allow" would hit the
    // timeout mid-decision and get treated as denied — clicking Allow right
    // after does nothing, since geoFailed is already true and this effect
    // never runs again. Leaving it unset lets the browser wait as long as
    // the permission decision + location fix actually take.
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setGeoFailed(true),
    );
  }, [open, userLocation, geoFailed]);

  // Suppressed once the user has manually picked a locker — at that point
  // they've already found what they came for, so the overlay would just be
  // a stale "still working" message layered over their own choice.
  const locating =
    open &&
    !userLocation &&
    !geoFailed &&
    !selectedId &&
    typeof navigator !== "undefined" &&
    !!navigator.geolocation;

  // Create the map once, on open. Never re-created while the modal stays open.
  useEffect(() => {
    if (!open || !mapEl || mapRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapEl || mapRef.current) return;
      const map = L.map(mapEl).setView(
        [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        7,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      setMap(map);
      setLeafletMod(L);
      // Leaflet measures its container once at creation. A single deferred
      // invalidateSize() isn't reliable here — this sits in a flex layout
      // whose height depends on a sibling column, and it can still be
      // settling when Leaflet takes that first measurement, leaving it
      // permanently convinced the map is smaller than it actually is (only
      // ever fetching tiles for that undersized guess). A ResizeObserver
      // that watches for as long as the map lives catches that late
      // settling — and any later resize — reliably.
      const observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(mapEl);
      resizeObserverRef.current = observer;
    });

    return () => {
      cancelled = true;
    };
  }, [open, mapEl]);

  // Recenter (only) once geolocation resolves — not on every list update.
  // Also keyed on `map`: on reopen, `userLocation` is often already set from
  // before (it isn't reset), so this needs `map` in the deps too, or a fresh
  // map instance would sit at the default Vilnius view instead of jumping to
  // an already-known location.
  useEffect(() => {
    if (!userLocation || !map) return;
    map.setView([userLocation.lat, userLocation.lng], 13);
  }, [userLocation, map]);

  /**
   * Tears the map down once the close *transition* has actually finished —
   * not the instant `open` flips false, or the map would vanish mid-fade
   * while the modal is still visibly on screen. `leafletMod` is deliberately
   * left as-is: the dynamic import is cached by the browser, so there's
   * nothing stale for a future reopen to feed.
   */
  function handleAfterClose() {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
    mapRef.current?.remove();
    mapRef.current = null;
    setMap(null);
    markersRef.current = [];
    unlockScroll();
  }

  const filtered = (lockers ?? [])
    .filter((l) => {
      if (!query) return true;
      const haystack = `${l.name} ${l.address}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .map((l) => ({
      ...l,
      distance: userLocation ? distanceKm(userLocation, l) : null,
    }))
    .sort((a, b) => {
      // Before geolocation resolves, every entry's distance is null —
      // `Infinity - Infinity` is NaN, and a NaN-returning comparator doesn't
      // reorder anything, so the list silently stays in insertion order:
      // every Omniva entry (pushed first server-side) ahead of every Venipak
      // one. `slice(0, VISIBLE_LIMIT)` below then grabbed only Omniva,
      // regardless of which carrier is actually closer. Sorting
      // alphabetically as the no-location fallback keeps the two carriers
      // mixed instead of carrier-clustered until a real distance exists.
      if (a.distance == null && b.distance == null) {
        return a.name.localeCompare(b.name);
      }
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    });

  const visible = filtered.slice(0, VISIBLE_LIMIT);
  const truncated = filtered.length > visible.length;
  const selected = filtered.find((l) => l.id === selectedId) ?? null;

  // Redraw markers whenever the visible set, the selection, or the map
  // instance itself changes — that last one matters on reopen: `leafletMod`
  // is deliberately never reset, so without `map` in the deps this effect
  // would have no reason to re-run just because a fresh map replaced the
  // torn-down one, and the new map would sit there with no pins on it.
  useEffect(() => {
    if (!leafletMod || !map) return;
    const L = leafletMod;

    // A small white badge holding the carrier's real logo (not a colour
    // dot) — sized off each SVG's own aspect ratio so the wordmark doesn't
    // stretch. Anchored at bottom-centre so the badge "points" at the pin's
    // actual coordinate the way a classic teardrop marker would.
    const logoPin = (carrier: Carrier, selected: boolean) => {
      const meta = CARRIER_META[carrier];
      const logoHeight = selected ? 24 : 16;
      const logoWidth = Math.round(logoHeight * meta.logoRatio);
      const pad = selected ? 6 : 5;
      const w = logoWidth + pad * 2;
      const h = logoHeight + pad * 2;
      // Selected used to be a red border — reads as a cheap "sale sticker"
      // on a small map badge. Black (matching the rest of the site's UI)
      // plus a small checkmark badge reads as deliberate "chosen" instead.
      const checkmark = selected
        ? `<div style="
             position:absolute;top:-7px;right:-7px;width:16px;height:16px;
             border-radius:50%;background:#111;border:2px solid #fff;
             display:flex;align-items:center;justify-content:center;
           ">
             <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
               <path d="M20 6L9 17l-5-5" />
             </svg>
           </div>`
        : "";
      return L.divIcon({
        className: "",
        html: `
          <div style="
            position:relative;width:${w}px;height:${h}px;
            display:flex;align-items:center;justify-content:center;
            background:#fff;border-radius:6px;
            border:${selected ? "2px solid #111" : "1px solid rgba(17,17,17,0.15)"};
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
          ">
            <img src="${meta.logo}" alt="${meta.label}" style="width:${logoWidth}px;height:${logoHeight}px;object-fit:contain;display:block;" />
            ${checkmark}
          </div>`,
        iconSize: [w, h],
        iconAnchor: [w / 2, h],
      });
    };
    const icons: Record<Carrier, { normal: DivIcon; selected: DivIcon }> = {
      omniva: {
        normal: logoPin("omniva", false),
        selected: logoPin("omniva", true),
      },
      venipak: {
        normal: logoPin("venipak", false),
        selected: logoPin("venipak", true),
      },
    };

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = visible.map((locker) => {
      const set = icons[locker.carrier];
      const marker = L.marker([locker.lat, locker.lng], {
        icon: locker.id === selectedId ? set.selected : set.normal,
        // The logo badge is wider than a dot marker — keep it above
        // neighbouring pins instead of z-fighting in visual order.
        zIndexOffset: locker.id === selectedId ? 1000 : 0,
      }).addTo(map);
      marker.bindPopup(
        `<img src="${CARRIER_META[locker.carrier].logo}" alt="${CARRIER_META[locker.carrier].label}" style="height:16px;object-fit:contain;margin-bottom:4px;" /><br/><strong>${escapeHtml(locker.name)}</strong><br/>${escapeHtml(locker.address)}`,
      );
      marker.on("click", () => setSelectedId(locker.id));
      return marker;
    });
  }, [leafletMod, map, visible, selectedId]);

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      onAfterOpen={() => lockScroll()}
      onAfterClose={handleAfterClose}
      closeTimeoutMS={CLOSE_TIMEOUT_MS}
      contentLabel={t("dialogLabel")}
      // This app has no single wrapping root div around <body>'s children
      // (Navbar/main/Footer/CartDrawer are siblings) — react-modal's
      // aria-hide-the-background feature needs one to hide *around*. Pointing
      // it at `document.body` itself doesn't work: Chrome blocks aria-hidden
      // on <body> outright (it would hide the modal too), so that setup was
      // producing a console warning for zero actual accessibility benefit.
      // Disabling it here is honest about that rather than pretending it
      // works; `role="dialog"` + `aria-modal` (which react-modal sets
      // regardless) still tells assistive tech this is a modal.
      ariaHideApp={false}
      style={MODAL_STYLE}
      overlayClassName={{
        base: "locker-modal-overlay fixed inset-0 z-[2000] flex items-end justify-center backdrop-blur-sm sm:items-center",
        afterOpen: "locker-modal-overlay--after-open",
        beforeClose: "locker-modal-overlay--before-close",
      }}
      className={{
        // min-h matters most at sm:+, where the map switches to `h-auto
        // sm:flex-1` (stretches to match its sibling list column) instead of
        // a fixed height — with 0-1 filtered lockers, that list column has
        // almost no natural content height, and without a floor the whole
        // card (map included) collapses down to fit it.
        base: "locker-modal-content flex max-h-[90dvh] min-h-[420px] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[22px] bg-[#fdfdfd] sm:min-h-[560px] sm:rounded-[22px]",
        afterOpen: "locker-modal-content--after-open",
        beforeClose: "locker-modal-content--before-close",
      }}
    >
      {/* Header */}
      <div className="flex flex-none items-start justify-between gap-4 p-[clamp(20px,4vw,28px)] pb-4">
        <div>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ff4d3d]">
            {t("eyebrow")}
          </div>
          <h2 className="m-0 font-[family-name:var(--font-anton)] text-[clamp(1.3rem,3vw,1.8rem)] font-normal uppercase leading-none tracking-[-0.01em] text-[#111]">
            {t("title")}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[#111]/20 text-[#111] transition-colors duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="flex-none px-[clamp(20px,4vw,28px)] pb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-[10px] border border-[#111]/15 bg-white px-4 py-2.5 text-[14px] text-[#111] outline-none focus:border-[#111]"
        />
      </div>

      {loadError ? (
        <div className="flex-1 px-[clamp(20px,4vw,28px)] pb-8 text-[14px] text-[#b3271a]">
          {t("loadError")}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          {/* Map */}
          <div className="relative h-[260px] w-full flex-none sm:h-auto sm:flex-1">
            <div ref={setMapEl} className="absolute inset-0" />
            {locating && (
              <div className="pointer-events-none absolute inset-0 z-[1200] flex items-center justify-center bg-white/30">
                <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[12px] font-medium text-[#111] shadow-md">
                  <span className="h-3.5 w-3.5 flex-none animate-spin rounded-full border-2 border-[#111]/20 border-t-[#111]" />
                  {t("locating")}
                </div>
              </div>
            )}
          </div>

          {/* List */}
          <div
            data-lenis-prevent
            className="min-h-0 flex-1 overflow-y-auto border-t border-[#111]/10 sm:w-[280px] sm:flex-none sm:border-t-0 sm:border-l"
          >
            {lockers === null ? (
              // Skeleton rows while the initial fetch is in flight.
              // Without this, a slow cold fetch (Venipak's feed is bigger,
              // has no CORS, sits behind no CDN — the flakier of the two
              // to fetch fresh) just looked like an empty, finished list.
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="border-b border-[#111]/[0.06] px-4 py-3"
                >
                  <div className="mb-1.5 h-5 w-15 animate-pulse rounded bg-[#111]/[0.07]" />
                  <div className="h-[13px] w-3/4 animate-pulse rounded bg-[#111]/[0.07]" />
                  <div className="mt-1.5 h-[11px] w-1/2 animate-pulse rounded bg-[#111]/[0.07]" />
                </div>
              ))
            ) : (
              <>
                {filtered.length === 0 && (
                  <p className="p-4 text-[13px] text-[#7a7a76]">
                    {t("noResults")}
                  </p>
                )}
                {visible.map((locker) => (
                  <button
                    key={locker.id}
                    type="button"
                    onClick={() => setSelectedId(locker.id)}
                    className={`block w-full border-b border-[#111]/[0.06] px-4 py-3 text-left text-[13px] transition-colors duration-200 ${
                      selectedId === locker.id
                        ? "bg-[#111] text-white"
                        : "text-[#111] hover:bg-[#111]/[0.05]"
                    }`}
                  >
                    {/* Logo on its own row, top-left — fixed box (not just
                          fixed height) so Omniva and Venipak occupy identical
                          space regardless of their own wordmark's proportions. */}
                    <div className="mb-1.5 flex h-5 w-15 items-center justify-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={CARRIER_META[locker.carrier].logo}
                        alt={CARRIER_META[locker.carrier].label}
                        className={`h-full w-full object-contain object-left ${
                          selectedId === locker.id ? "brightness-0 invert" : ""
                        }`}
                      />
                    </div>
                    <div className="font-semibold">{locker.name}</div>
                    <div
                      className={`mt-0.5 text-[12px] ${
                        selectedId === locker.id
                          ? "text-white/70"
                          : "text-[#7a7a76]"
                      }`}
                    >
                      {locker.address}
                      {locker.distance != null &&
                        ` · ${locker.distance.toFixed(1)} km`}
                    </div>
                  </button>
                ))}
                {truncated && (
                  <p className="p-4 text-[11px] text-[#7a7a76]">
                    {t("truncatedNote", {
                      shown: visible.length,
                      total: filtered.length,
                    })}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex-none border-t border-[#111]/10 p-[clamp(16px,3vw,22px)]">
        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="w-full rounded-[10px] bg-[#111] py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 enabled:hover:bg-[#ff4d3d] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {selected
            ? t("selectButton", { name: selected.name })
            : t("selectPrompt")}
        </button>
      </div>
    </Modal>
  );
}
