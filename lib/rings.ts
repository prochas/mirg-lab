export type RingProduct = {
  slug: string;
  title: string;
  price: number; // EUR
  material: string;
  description: string;
  details: string[];
  images: string[]; // [0] = card front, [1] = card hover, rest = gallery only
  sizeOptions: string[];
  ready: boolean;
  readySize?: string;
};

// Mock data only — real products live in Sanity once the catalog is wired up.
// Galleries recycle the same handful of photos until real per-product
// photography exists.
export const rings: RingProduct[] = [
  {
    slug: "bangele",
    title: "Bangelė",
    price: 145,
    material: "Sidabras 925",
    description:
      "Banguotas profilis, nulietas ir nukaltas ranka. Paviršius paliktas matinis, todėl įbrėžimai laikui bėgant tampa dalimi žiedo — o ne defektu.",
    details: [
      "Sidabras 925, be dangos",
      "Plotis 4 mm, storis 2 mm",
      "Matinis, šepečiu apdirbtas paviršius",
      "Kiekvienas vienetas šiek tiek skiriasi",
    ],
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
    title: "Uola",
    price: 210,
    material: "Auksas 14k",
    description:
      "Netaisyklingas, tarsi nuskeltas paviršius — forma auga iš liejimo, o ne iš brėžinio. Sunkus, bet neužkliūva už rankovės.",
    details: [
      "Auksas 14k",
      "Plotis 6 mm ties plačiausia vieta",
      "Netaisyklinga, lieta faktūra",
      "Gaminama pagal užsakymą",
    ],
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
    title: "Signetas Minimal",
    price: 165,
    material: "Sidabras 925",
    description:
      "Klasikinis signetas, nuimtas iki esmės. Plokščias skydelis paliktas tuščias — galime įgraviruoti inicialus arba palikti švarų.",
    details: [
      "Sidabras 925",
      "Skydelis 12 × 10 mm",
      "Galima gravūra (rašykite prieš užsakant)",
      "Poliruotas paviršius",
    ],
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
    title: "Pynė",
    price: 180,
    material: "Paauksuotas sidabras",
    description:
      "Trys atskiros vielos, supintos ranka ir sulituotos į vientisą žiedą. Auksavimas storas, 3 mikronų, todėl nenusitrina po mėnesio.",
    details: [
      "Sidabras 925 su 3 µm aukso danga",
      "Trijų vielų pynė, plotis 5 mm",
      "Pinama ranka",
      "Venkite chloruoto vandens",
    ],
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
    title: "Akmenukas",
    price: 260,
    material: "Auksas 18k",
    description:
      "Vienas akmuo, įsodintas žemai ir tvirtai — nekliūva, netraukia dėmesio iš toli, bet iš arti aišku, kad tai ne masinė gamyba.",
    details: [
      "Auksas 18k",
      "Žemas rėmelio sodinimas",
      "Akmuo 4 mm",
      "Gaminama pagal užsakymą",
    ],
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
    title: "Grubus",
    price: 195,
    material: "Sidabras 925",
    description:
      "Kalimo žymės paliktos matomos. Nešlifuojame jų — būtent jos parodo, kad žiedas gimė ant priekalo, o ne staklėse.",
    details: [
      "Sidabras 925",
      "Plotis 8 mm — masyvus",
      "Matomos plaktuko žymės",
      "Oksiduotas, tamsintas paviršius",
    ],
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
    title: "Lašas",
    price: 150,
    material: "Sidabras 925",
    description:
      "Sustingęs metalo lašas ant plonos apyrankės. Lengviausias kolekcijos žiedas — tinka nešioti kasdien ir pamiršti, kad jį turi.",
    details: [
      "Sidabras 925",
      "Apyrankė 2 mm, lašas 6 mm",
      "Poliruota iki veidrodinio blizgesio",
      "Tinka kasdieniam nešiojimui",
    ],
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
    title: "Masyvus",
    price: 230,
    material: "Auksas 14k",
    description:
      "Pilnai užpildytas, be tuštumų viduje. Sveria tiek, kiek atrodo — ir būtent dėl to nešiojasi taip, kaip turėtų nešiotis auksas.",
    details: [
      "Auksas 14k, vientisas",
      "Plotis 9 mm",
      "Apvalinti kraštai",
      "Gaminama pagal užsakymą, 1–2 sav.",
    ],
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

export const RING_MATERIALS = Array.from(
  new Set(rings.map((r) => r.material)),
);

export const RING_SIZES = Array.from(
  new Set(rings.flatMap((r) => r.sizeOptions)),
).sort((a, b) => Number(a) - Number(b));

export function getRingBySlug(slug: string) {
  return rings.find((r) => r.slug === slug);
}

// Same material first, then anything else — never the ring itself.
export function getRelatedRings(slug: string, limit = 4) {
  const current = getRingBySlug(slug);
  const others = rings.filter((r) => r.slug !== slug);
  if (!current) return others.slice(0, limit);

  const sameMaterial = others.filter((r) => r.material === current.material);
  const rest = others.filter((r) => r.material !== current.material);
  return [...sameMaterial, ...rest].slice(0, limit);
}
