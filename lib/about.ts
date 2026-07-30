// PLACEHOLDER COPY — written to be consistent with facts the site already
// states (since 2021, Vilnius studio, handmade, small batch, made to order).
// Swap for the real story before launch; no real person is named on purpose.
//
// Lives in TypeScript rather than messages/*.json because these are ordered
// content lists, not UI chrome — the components iterate them and rely on the
// count (the process track sizes its scroll height from steps.length).

import type { Locale } from "@/i18n/routing";

type Localized<T> = Record<Locale, T>;

export type Chapter = {
  no: string;
  year: string;
  title: string;
  body: string;
  image: string;
};

const chapterSources: {
  no: string;
  image: string;
  year: Localized<string>;
  title: Localized<string>;
  body: Localized<string>;
}[] = [
  {
    no: "01",
    image: "/bg-hero/one.jpg",
    year: { lt: "2021", en: "2021" },
    title: { lt: "Pradžia", en: "The Start" },
    body: {
      lt: "Viskas prasidėjo nuo žiedo, kurio niekur nepavyko rasti. Per storas, per blizgus, per daug panašus į visus kitus. Taigi jis buvo nukaltas pačiam sau — virtuvėje, su pasiskolintais įrankiais ir per dideliu užsispyrimu.",
      en: "It started with a ring that couldn't be found anywhere. Too thick, too shiny, too much like every other one. So it got forged at home instead — in a kitchen, with borrowed tools and more stubbornness than sense.",
    },
  },
  {
    no: "02",
    image: "/bg-hero/five.jpg",
    year: { lt: "2022", en: "2022" },
    title: { lt: "Dirbtuvė", en: "The Studio" },
    body: {
      lt: "Antras aukštas Vilniaus senamiestyje, langas į kiemą ir priekalas, kuris girdisi per tris duris. Čia nėra konvejerio — yra vienas stalas, ant kurio vienu metu gimsta ne daugiau kaip keli žiedai.",
      en: "A second floor in Vilnius old town, a window onto the courtyard, and an anvil you can hear through three doors. There is no production line here — there is one bench, and no more than a few rings on it at a time.",
    },
  },
  {
    no: "03",
    image: "/bg-hero/nine.jpg",
    year: { lt: "Šiandien", en: "Today" },
    title: { lt: "Metalas", en: "The Metal" },
    body: {
      lt: "Dirbame su perlydytu sidabru ir auksu. Metalas turi atmintį — jis įsimena kiekvieną smūgį. Būtent todėl nešlifuojame kalimo žymių: jos parodo, kad daiktas turi kilmę, o ne partijos numerį.",
      en: "We work with recycled silver and gold. Metal has a memory — it keeps every blow. That is exactly why we don't sand the hammer marks away: they show the piece has an origin, not a batch number.",
    },
  },
  {
    no: "04",
    image: "/bg-hero/three.jpg",
    year: { lt: "Toliau", en: "Next" },
    title: { lt: "Jūs", en: "You" },
    body: {
      lt: "Beveik kiekvienas žiedas turi savininką dar prieš gimdamas. Jūs pasirenkate dydį, mes — kalame. Tai lėčiau nei nusipirkti iš lentynos, bet po metų vis dar žinosite, iš kur jis atsirado.",
      en: "Almost every ring has an owner before it exists. You pick the size, we do the forging. It is slower than buying off a shelf, but a year from now you'll still know where it came from.",
    },
  },
];

export function getChapters(locale: Locale): Chapter[] {
  return chapterSources.map((c) => ({
    no: c.no,
    image: c.image,
    year: c.year[locale],
    title: c.title[locale],
    body: c.body[locale],
  }));
}

export type Step = {
  no: string;
  title: string;
  body: string;
  image: string;
};

const stepSources: {
  no: string;
  image: string;
  title: Localized<string>;
  body: Localized<string>;
}[] = [
  {
    no: "01",
    image: "/bg-hero/two.jpg",
    title: { lt: "Eskizas", en: "Sketch" },
    body: {
      lt: "Ranka, ant popieriaus. Jei idėja neveikia pieštuku — neveiks ir metale.",
      en: "By hand, on paper. If the idea doesn't work in pencil, it won't work in metal.",
    },
  },
  {
    no: "02",
    image: "/bg-hero/four.jpg",
    title: { lt: "Forma", en: "Form" },
    body: {
      lt: "Vaškas pjaustomas ir šildomas tol, kol proporcijos nustoja erzinti.",
      en: "Wax gets carved and warmed until the proportions stop being annoying.",
    },
  },
  {
    no: "03",
    image: "/bg-hero/six.jpg",
    title: { lt: "Liejimas", en: "Casting" },
    body: {
      lt: "Metalas kaista iki 960 °C ir užpildo formą. Atgal kelio nebėra.",
      en: "Metal heats to 960 °C and fills the mould. There is no way back from here.",
    },
  },
  {
    no: "04",
    image: "/bg-hero/eight.jpg",
    title: { lt: "Kalimas", en: "Forging" },
    body: {
      lt: "Plaktukas suteikia paviršių. Kiekvienas smūgis lieka matomas.",
      en: "The hammer gives the surface. Every blow stays visible.",
    },
  },
  {
    no: "05",
    image: "/bg-hero/eleven.jpg",
    title: { lt: "Apdaila", en: "Finishing" },
    body: {
      lt: "Šlifavimas, matinimas, oksidavimas. Tada — dėžutė ir jūsų adresas.",
      en: "Sanding, matting, oxidising. Then a box, and your address.",
    },
  },
];

export function getSteps(locale: Locale): Step[] {
  return stepSources.map((s) => ({
    no: s.no,
    image: s.image,
    title: s.title[locale],
    body: s.body[locale],
  }));
}

export type Value = {
  no: string;
  title: string;
  body: string;
};

const valueSources: {
  no: string;
  title: Localized<string>;
  body: Localized<string>;
}[] = [
  {
    no: "01",
    title: { lt: "Rankos, ne mašinos", en: "Hands, not machines" },
    body: {
      lt: "Jokios serijinės gamybos. Kiekvieną žiedą nuo eskizo iki poliravimo paliečia tos pačios rankos.",
      en: "No series production. The same hands touch every ring from sketch to polish.",
    },
  },
  {
    no: "02",
    title: { lt: "Mažos partijos", en: "Small batches" },
    body: {
      lt: "Geriau penki žiedai, kuriuos prisimename, nei penki šimtai, kurių neatskirtume.",
      en: "Better five rings we remember than five hundred we couldn't tell apart.",
    },
  },
  {
    no: "03",
    title: { lt: "Perdirbtas metalas", en: "Recycled metal" },
    body: {
      lt: "Sidabras ir auksas — perlydyti. Naujo metalo iš žemės neprašome, jo jau užtenka paviršiuje.",
      en: "Our silver and gold are remelted. We don't ask the ground for new metal — there is already enough of it above the surface.",
    },
  },
  {
    no: "04",
    title: { lt: "Be skubos", en: "No rush" },
    body: {
      lt: "Gaminame pagal užsakymą. Tai trunka 1–2 savaites, ir mes to neslepiame už „greito pristatymo“ pažado.",
      en: "We make to order. It takes 1–2 weeks, and we don't hide that behind a promise of “fast delivery”.",
    },
  },
];

export function getValues(locale: Locale): Value[] {
  return valueSources.map((v) => ({
    no: v.no,
    title: v.title[locale],
    body: v.body[locale],
  }));
}

export type Stat = { value: number; suffix: string; label: string };

const statSources: { value: number; suffix: string; label: Localized<string> }[] =
  [
    { value: 2021, suffix: "", label: { lt: "Nuo šių metų", en: "Working since" } },
    { value: 400, suffix: "+", label: { lt: "Nukaltų žiedų", en: "Rings forged" } },
    {
      value: 1,
      suffix: "",
      label: { lt: "Dirbtuvė Vilniuje", en: "Studio in Vilnius" },
    },
    { value: 100, suffix: "%", label: { lt: "Rankų darbas", en: "Made by hand" } },
  ];

export function getStats(locale: Locale): Stat[] {
  return statSources.map((s) => ({
    value: s.value,
    suffix: s.suffix,
    label: s.label[locale],
  }));
}
