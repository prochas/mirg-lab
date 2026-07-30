import type { Locale } from "@/i18n/routing";

type Localized<T> = Record<Locale, T>;

/**
 * The stored shape: everything locale-independent inline, every piece of copy
 * keyed by locale. Slugs are shared across locales on purpose — one canonical
 * URL per product, and cart keys stay valid when the visitor switches language.
 */
type RingSource = {
  slug: string;
  price: number; // EUR
  /** Stable id for filtering — the visible material label is localised. */
  materialKey: string;
  images: string[]; // [0] = card front, [1] = card hover, rest = gallery only
  sizeOptions: string[];
  ready: boolean;
  readySize?: string;
  title: Localized<string>;
  material: Localized<string>;
  description: Localized<string>;
  details: Localized<string[]>;
};

/** What components consume: one locale already resolved. */
export type RingProduct = {
  slug: string;
  price: number;
  materialKey: string;
  images: string[];
  sizeOptions: string[];
  ready: boolean;
  readySize?: string;
  title: string;
  material: string;
  description: string;
  details: string[];
};

const MATERIALS = {
  silver925: {
    key: "silver-925",
    label: { lt: "Sidabras 925", en: "Sterling silver 925" },
  },
  gold14k: { key: "gold-14k", label: { lt: "Auksas 14k", en: "14k gold" } },
  gold18k: { key: "gold-18k", label: { lt: "Auksas 18k", en: "18k gold" } },
  goldPlated: {
    key: "gold-plated-silver",
    label: { lt: "Paauksuotas sidabras", en: "Gold-plated silver" },
  },
} satisfies Record<string, { key: string; label: Localized<string> }>;

// Mock data only — real products live in Sanity once the catalog is wired up.
// Galleries recycle the same handful of photos until real per-product
// photography exists.
const ringSources: RingSource[] = [
  {
    slug: "bangele",
    price: 145,
    materialKey: MATERIALS.silver925.key,
    material: MATERIALS.silver925.label,
    title: { lt: "Bangelė", en: "Ripple" },
    description: {
      lt: "Banguotas profilis, nulietas ir nukaltas ranka. Paviršius paliktas matinis, todėl įbrėžimai laikui bėgant tampa dalimi žiedo — o ne defektu.",
      en: "A wave-cut profile, cast and then hammered by hand. The surface is left matte, so over time scratches become part of the ring rather than a flaw in it.",
    },
    details: {
      lt: [
        "Sidabras 925, be dangos",
        "Plotis 4 mm, storis 2 mm",
        "Matinis, šepečiu apdirbtas paviršius",
        "Kiekvienas vienetas šiek tiek skiriasi",
      ],
      en: [
        "Sterling silver 925, uncoated",
        "4 mm wide, 2 mm thick",
        "Matte, brushed finish",
        "Every piece differs slightly",
      ],
    },
    images: [
      "/new-offers/ring_one.avif",
      "/new-offers/ring_one_hover.avif",
      "/new-offers/ring_two.avif",
      "/new-offers/ring_three.avif",
    ],
    sizeOptions: ["16", "17", "18", "19", "20"],
    ready: true,
    readySize: "18",
  },
  {
    slug: "uola",
    price: 210,
    materialKey: MATERIALS.gold14k.key,
    material: MATERIALS.gold14k.label,
    title: { lt: "Uola", en: "Boulder" },
    description: {
      lt: "Netaisyklingas, tarsi nuskeltas paviršius — forma auga iš liejimo, o ne iš brėžinio. Sunkus, bet neužkliūva už rankovės.",
      en: "An irregular, chipped-looking surface — the shape grows out of the casting, not out of a drawing. Heavy, yet it never snags on a sleeve.",
    },
    details: {
      lt: [
        "Auksas 14k",
        "Plotis 6 mm ties plačiausia vieta",
        "Netaisyklinga, lieta faktūra",
        "Gaminama pagal užsakymą",
      ],
      en: [
        "14k gold",
        "6 mm at its widest point",
        "Irregular, as-cast texture",
        "Made to order",
      ],
    },
    images: [
      "/new-offers/ring_two.avif",
      "/new-offers/ring_two_hover.avif",
      "/new-offers/ring_four.avif",
      "/new-offers/ring_one.avif",
    ],
    sizeOptions: ["15", "16", "17", "18", "19"],
    ready: false,
  },
  {
    slug: "signetas-minimal",
    price: 165,
    materialKey: MATERIALS.silver925.key,
    material: MATERIALS.silver925.label,
    title: { lt: "Signetas Minimal", en: "Minimal Signet" },
    description: {
      lt: "Klasikinis signetas, nuimtas iki esmės. Plokščias skydelis paliktas tuščias — galime įgraviruoti inicialus arba palikti švarų.",
      en: "A classic signet stripped back to the essentials. The flat face is left blank — we can engrave initials or leave it clean.",
    },
    details: {
      lt: [
        "Sidabras 925",
        "Skydelis 12 × 10 mm",
        "Galima gravūra (rašykite prieš užsakant)",
        "Poliruotas paviršius",
      ],
      en: [
        "Sterling silver 925",
        "Face 12 × 10 mm",
        "Engraving available (write to us before ordering)",
        "Polished finish",
      ],
    },
    images: [
      "/new-offers/ring_three.avif",
      "/new-offers/ring_three_hover.avif",
      "/new-offers/ring_one.avif",
      "/new-offers/ring_four.avif",
    ],
    sizeOptions: ["17", "18", "19", "20", "21"],
    ready: true,
    readySize: "19",
  },
  {
    slug: "pyne",
    price: 180,
    materialKey: MATERIALS.goldPlated.key,
    material: MATERIALS.goldPlated.label,
    title: { lt: "Pynė", en: "Braid" },
    description: {
      lt: "Trys atskiros vielos, supintos ranka ir sulituotos į vientisą žiedą. Auksavimas storas, 3 mikronų, todėl nenusitrina po mėnesio.",
      en: "Three separate wires, braided by hand and soldered into one band. The gold layer is a thick 3 microns, so it won't wear through in a month.",
    },
    details: {
      lt: [
        "Sidabras 925 su 3 µm aukso danga",
        "Trijų vielų pynė, plotis 5 mm",
        "Pinama ranka",
        "Venkite chloruoto vandens",
      ],
      en: [
        "Sterling silver 925 with a 3 µm gold layer",
        "Three-wire braid, 5 mm wide",
        "Braided by hand",
        "Avoid chlorinated water",
      ],
    },
    images: [
      "/new-offers/ring_four.avif",
      "/new-offers/ring_four_hover.avif",
      "/new-offers/ring_two.avif",
      "/new-offers/ring_three.avif",
    ],
    sizeOptions: ["16", "17", "18", "19"],
    ready: false,
  },
  {
    slug: "akmenukas",
    price: 260,
    materialKey: MATERIALS.gold18k.key,
    material: MATERIALS.gold18k.label,
    title: { lt: "Akmenukas", en: "Pebble" },
    description: {
      lt: "Vienas akmuo, įsodintas žemai ir tvirtai — nekliūva, netraukia dėmesio iš toli, bet iš arti aišku, kad tai ne masinė gamyba.",
      en: "A single stone, set low and tight — it doesn't catch, it doesn't shout across a room, but up close it's obvious this wasn't mass-produced.",
    },
    details: {
      lt: [
        "Auksas 18k",
        "Žemas rėmelio sodinimas",
        "Akmuo 4 mm",
        "Gaminama pagal užsakymą",
      ],
      en: [
        "18k gold",
        "Low bezel setting",
        "4 mm stone",
        "Made to order",
      ],
    },
    images: [
      "/new-offers/ring_one_hover.avif",
      "/new-offers/ring_one.avif",
      "/new-offers/ring_three_hover.avif",
      "/new-offers/ring_two.avif",
    ],
    sizeOptions: ["15", "16", "17", "18"],
    ready: true,
    readySize: "16",
  },
  {
    slug: "grubus",
    price: 195,
    materialKey: MATERIALS.silver925.key,
    material: MATERIALS.silver925.label,
    title: { lt: "Grubus", en: "Rough" },
    description: {
      lt: "Kalimo žymės paliktos matomos. Nešlifuojame jų — būtent jos parodo, kad žiedas gimė ant priekalo, o ne staklėse.",
      en: "The hammer marks are left visible. We don't sand them away — they're exactly what shows this ring was born on an anvil, not in a machine.",
    },
    details: {
      lt: [
        "Sidabras 925",
        "Plotis 8 mm — masyvus",
        "Matomos plaktuko žymės",
        "Oksiduotas, tamsintas paviršius",
      ],
      en: [
        "Sterling silver 925",
        "8 mm wide — chunky",
        "Visible hammer marks",
        "Oxidised, darkened finish",
      ],
    },
    images: [
      "/new-offers/ring_two_hover.avif",
      "/new-offers/ring_two.avif",
      "/new-offers/ring_four_hover.avif",
      "/new-offers/ring_one.avif",
    ],
    sizeOptions: ["18", "19", "20", "21", "22"],
    ready: false,
  },
  {
    slug: "lasas",
    price: 150,
    materialKey: MATERIALS.silver925.key,
    material: MATERIALS.silver925.label,
    title: { lt: "Lašas", en: "Droplet" },
    description: {
      lt: "Sustingęs metalo lašas ant plonos apyrankės. Lengviausias kolekcijos žiedas — tinka nešioti kasdien ir pamiršti, kad jį turi.",
      en: "A frozen drop of metal on a thin band. The lightest ring in the collection — made to wear daily and forget you have it on.",
    },
    details: {
      lt: [
        "Sidabras 925",
        "Apyrankė 2 mm, lašas 6 mm",
        "Poliruota iki veidrodinio blizgesio",
        "Tinka kasdieniam nešiojimui",
      ],
      en: [
        "Sterling silver 925",
        "2 mm band, 6 mm drop",
        "Polished to a mirror shine",
        "Made for everyday wear",
      ],
    },
    images: [
      "/new-offers/ring_three_hover.avif",
      "/new-offers/ring_three.avif",
      "/new-offers/ring_one_hover.avif",
      "/new-offers/ring_four.avif",
    ],
    sizeOptions: ["16", "17", "18", "19", "20"],
    ready: true,
    readySize: "17",
  },
  {
    slug: "masyvus",
    price: 230,
    materialKey: MATERIALS.gold14k.key,
    material: MATERIALS.gold14k.label,
    title: { lt: "Masyvus", en: "Heavyweight" },
    description: {
      lt: "Pilnai užpildytas, be tuštumų viduje. Sveria tiek, kiek atrodo — ir būtent dėl to nešiojasi taip, kaip turėtų nešiotis auksas.",
      en: "Solid all the way through, no hollow core. It weighs what it looks like it weighs — which is exactly why it wears the way gold should.",
    },
    details: {
      lt: [
        "Auksas 14k, vientisas",
        "Plotis 9 mm",
        "Apvalinti kraštai",
        "Gaminama pagal užsakymą, 1–2 sav.",
      ],
      en: [
        "14k gold, solid",
        "9 mm wide",
        "Rounded edges",
        "Made to order, 1–2 weeks",
      ],
    },
    images: [
      "/new-offers/ring_four_hover.avif",
      "/new-offers/ring_four.avif",
      "/new-offers/ring_two_hover.avif",
      "/new-offers/ring_three.avif",
    ],
    sizeOptions: ["19", "20", "21", "22", "23"],
    ready: false,
  },
];

function localize(source: RingSource, locale: Locale): RingProduct {
  return {
    slug: source.slug,
    price: source.price,
    materialKey: source.materialKey,
    images: source.images,
    sizeOptions: source.sizeOptions,
    ready: source.ready,
    readySize: source.readySize,
    title: source.title[locale],
    material: source.material[locale],
    description: source.description[locale],
    details: source.details[locale],
  };
}

export function getRings(locale: Locale): RingProduct[] {
  return ringSources.map((r) => localize(r, locale));
}

/** Slugs alone — for generateStaticParams, which needs no copy. */
export const RING_SLUGS = ringSources.map((r) => r.slug);

export const RING_SIZES = Array.from(
  new Set(ringSources.flatMap((r) => r.sizeOptions)),
).sort((a, b) => Number(a) - Number(b));

export function getRingBySlug(slug: string, locale: Locale) {
  const source = ringSources.find((r) => r.slug === slug);
  return source ? localize(source, locale) : undefined;
}

// Same material first, then anything else — never the ring itself.
export function getRelatedRings(slug: string, locale: Locale, limit = 4) {
  const current = ringSources.find((r) => r.slug === slug);
  const others = ringSources.filter((r) => r.slug !== slug);
  const ordered = current
    ? [
        ...others.filter((r) => r.materialKey === current.materialKey),
        ...others.filter((r) => r.materialKey !== current.materialKey),
      ]
    : others;

  return ordered.slice(0, limit).map((r) => localize(r, locale));
}
