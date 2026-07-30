import type { Locale } from "@/i18n/routing";

/**
 * FAQ content. Lives in TypeScript rather than messages/*.json for the same
 * reason lib/about.ts does: it's an ordered content list the page iterates,
 * grouped, not UI chrome.
 *
 * Answers are kept consistent with what the rest of the site already states —
 * fulfillment timings from lib/fulfillment.ts, materials from lib/rings.ts,
 * delivery and returns from the product page accordions, studio hours from the
 * contacts block. If any of those change, change them here too.
 *
 * The returns answers restate existing site policy. The made-to-order exception
 * to the EU 14-day withdrawal right still needs checking against VVTAT guidance
 * before launch (see the legal-pages item in CLAUDE.md) — this is customer-facing
 * plain language, not legal text.
 */

type Localized<T> = Record<Locale, T>;

export type FaqItem = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

type FaqGroupSource = {
  id: string;
  title: Localized<string>;
  items: { q: Localized<string>; a: Localized<string> }[];
};

const groupSources: FaqGroupSource[] = [
  {
    id: "rings",
    title: { lt: "Žiedai ir dydžiai", en: "Rings and sizing" },
    items: [
      {
        q: { lt: "Kaip išsirinkti dydį?", en: "How do I find my ring size?" },
        a: {
          lt: "Mūsų dydis — vidinis žiedo skersmuo milimetrais. Apjuoskite pirštą popieriaus lankeliu ties storiausia vieta, išmatuokite ilgį ir palyginkite su dydžių lentele, kurią rasite kiekvieno žiedo puslapyje. Matuokite vakare, kai pirštai šiek tiek patinę. Jei matavimas patenka tarp dviejų dydžių, rinkitės didesnį — platesnį žiedą užmauti sunkiau.",
          en: "Our size is the ring's inner diameter in millimetres. Wrap a strip of paper around the thickest part of your finger, measure that length, and compare it with the size chart on every product page. Measure in the evening, when fingers are slightly swollen. If your measurement falls between two sizes, take the larger one — a wider band is harder to get on.",
        },
      },
      {
        q: {
          lt: "Ką reiškia „Paruošta“ ir „Gaminama“?",
          en: "What do “Ready” and “Made to order” mean?",
        },
        a: {
          lt: "„Paruošta“ reiškia, kad vienas nukaltas vienetas jau yra dirbtuvėje — jei dydis sutampa su jūsų, išsiunčiame per 1–2 darbo dienas. „Gaminama“ reiškia, kad žiedas bus kalamas jums nuo nulio, ir tai trunka 1–2 savaites. Nė vienas žiedas niekada nebūna „išparduotas“ — skiriasi tik laikas.",
          en: "“Ready” means one finished piece is already in the studio — if its size matches yours, we ship within 1–2 business days. “Made to order” means the ring will be forged for you from scratch, which takes 1–2 weeks. Nothing is ever “sold out” here; only the waiting time differs.",
        },
      },
      {
        q: {
          lt: "Pasirinkau dydį, kurio paruošto nėra. Kas tada?",
          en: "I picked a size that isn't the ready one. What happens?",
        },
        a: {
          lt: "Jei paruoštas vienetas yra kito dydžio, perdarome jį pagal jūsų dydį — tai užtrunka 1–2 darbo dienas. Tikslų laiką pamatysite prekės puslapyje iškart, kai pasirinksite dydį, ir tas pats užrašas keliauja į krepšelį bei užsakymo patvirtinimą.",
          en: "If the finished piece is a different size, we resize it to yours — that takes 1–2 business days. The exact timing appears on the product page the moment you pick a size, and the same wording follows through to your cart and order confirmation.",
        },
      },
      {
        q: { lt: "Ar galima įgraviruoti?", en: "Can you engrave a ring?" },
        a: {
          lt: "Signeto tipo žieduose skydelis paliktas tuščias, ir galime įgraviruoti inicialus. Parašykite mums prieš užsakydami, kad sutartume dėl teksto. Atkreipkite dėmesį: graviruotas žiedas laikomas individualiai pagamintu, todėl negrąžinamas.",
          en: "On signet-style rings the face is left blank and we can engrave initials. Write to us before ordering so we can agree on the text. Note that an engraved ring counts as made to your specification, so it can't be returned.",
        },
      },
      {
        q: {
          lt: "Ar du to paties modelio žiedai būna vienodi?",
          en: "Will two rings of the same model look identical?",
        },
        a: {
          lt: "Ne. Viskas kalama ranka, o kalimo žymių nešlifuojame — būtent jos parodo, kad žiedas gimė ant priekalo, o ne staklėse. Kiekvienas vienetas šiek tiek skiriasi, ir tai nėra defektas.",
          en: "No. Everything is forged by hand, and we don't sand the hammer marks away — they're exactly what shows the ring was born on an anvil rather than in a machine. Every piece differs slightly, and that isn't a flaw.",
        },
      },
    ],
  },
  {
    id: "materials",
    title: { lt: "Medžiagos ir priežiūra", en: "Materials and care" },
    items: [
      {
        q: {
          lt: "Iš kokių metalų gaminate?",
          en: "What metals do you work with?",
        },
        a: {
          lt: "Sidabras 925, auksas 14k ir 18k bei paauksuotas sidabras su 3 mikronų aukso danga. Sidabrą ir auksą naudojame perlydytą — naujo metalo iš žemės neprašome.",
          en: "Sterling silver 925, 14k and 18k gold, and gold-plated silver with a 3 micron gold layer. Our silver and gold are recycled — we don't ask the ground for new metal.",
        },
      },
      {
        q: { lt: "Ar sidabras tamsės?", en: "Will the silver tarnish?" },
        a: {
          lt: "Su laiku — taip, tai natūrali sidabro savybė, o ne kokybės klaida. Nublizginkite minkšta šluoste ir spalva grįš. Sąmoningai oksiduoti, tamsinti paviršiai laikui bėgant tamsėja dar labiau, ir taip ir turi būti.",
          en: "Over time, yes — that's what silver does, and it isn't a defect. A soft cloth brings the colour back. Deliberately oxidised, darkened finishes go darker still as they age, which is the intention.",
        },
      },
      {
        q: { lt: "Kaip prižiūrėti žiedą?", en: "How do I care for a ring?" },
        a: {
          lt: "Valykite minkšta šluoste, be abrazyvų. Nusiimkite prieš sportą ir dušą. Su paauksuotais žiedais venkite chloruoto vandens — baseinas nudildo dangą greičiau už bet ką kitą. Matiniai paviršiai laikui bėgant įgauna įbrėžimų; jie tampa žiedo dalimi, o ne defektu.",
          en: "Clean it with a soft cloth, no abrasives. Take it off before sport and showers. With gold-plated pieces avoid chlorinated water — a swimming pool wears the layer down faster than anything else. Matte finishes pick up scratches over time; those become part of the ring rather than a flaw in it.",
        },
      },
      {
        q: {
          lt: "Ar auksavimas nusitrins?",
          en: "Will the gold plating wear off?",
        },
        a: {
          lt: "Mūsų danga — 3 mikronai, kelis kartus storesnė už įprastą plonąjį auksavimą, todėl nenusitrina po mėnesio. Bet tai vis tiek danga: kasdien nešiojant ji plonėja. Nusidildžiusį žiedą galime paauksuoti pakartotinai — parašykite mums.",
          en: "Our layer is 3 microns, several times thicker than a standard flash plating, so it won't wear through in a month. It is still a plating, though: worn daily it thins out. We can re-plate a worn ring — just write to us.",
        },
      },
      {
        q: {
          lt: "Turiu jautrią odą. Ar žiedai tiks?",
          en: "I have sensitive skin. Will these suit me?",
        },
        a: {
          lt: "Sidabras 925 ir auksas dažniausiai nekelia problemų. Bet jei žinote, kad reaguojate į kurį nors metalą, parašykite mums prieš užsakydami ir aptarsime, kas jums tiktų.",
          en: "Sterling silver 925 and gold are usually well tolerated. If you know you react to a particular metal, write to us before ordering and we'll talk through what would suit you.",
        },
      },
    ],
  },
  {
    id: "orders",
    title: { lt: "Užsakymas ir pristatymas", en: "Orders and delivery" },
    items: [
      {
        q: {
          lt: "Kiek laiko trunka užsakymo įvykdymas?",
          en: "How long will my order take?",
        },
        a: {
          lt: "Paruoštą žiedą jūsų dydžiu išsiunčiame per 1–2 darbo dienas. Dydžio keitimas — taip pat 1–2 darbo dienas. Nuo nulio kalamas žiedas trunka 1–2 savaites. Prie šio laiko dar pridėkite pristatymą.",
          en: "A ready ring in your size ships within 1–2 business days. A resize is also 1–2 business days. A ring forged from scratch takes 1–2 weeks. Add the delivery time on top of that.",
        },
      },
      {
        q: {
          lt: "Kiek kainuoja pristatymas ir kiek jis užtrunka?",
          en: "What does delivery cost and how long does it take?",
        },
        a: {
          lt: "Lietuvoje — 2–3 darbo dienos, nemokamai nuo 100 €. Kitose ES šalyse — 4–7 darbo dienos. Siunčiame registruotu paštu su sekimo numeriu, kurį atsiunčiame el. paštu.",
          en: "Lithuania — 2–3 business days, free over €100. Other EU countries — 4–7 business days. We send by registered post with a tracking number, which we email to you.",
        },
      },
      {
        q: { lt: "Į kurias šalis siunčiate?", en: "Where do you ship?" },
        a: {
          lt: "Į Lietuvą ir kitas Europos Sąjungos šalis. Dėl siuntos už ES ribų parašykite mums — sutvarkysime atskirai.",
          en: "To Lithuania and other European Union countries. For anywhere outside the EU, write to us and we'll arrange it separately.",
        },
      },
      {
        q: { lt: "Kaip galiu apmokėti?", en: "How can I pay?" },
        a: {
          lt: "Mokėjimus tvarko Stripe: atsiskaitote saugiame Stripe lange, o kortelės duomenys pas mus nepatenka. Visi galimi mokėjimo būdai matomi atsiskaitymo puslapyje. Kainos — eurais.",
          en: "Payments are handled by Stripe: you pay on a secure Stripe page, and your card details never reach us. Every available payment method is shown at checkout. Prices are in euros.",
        },
      },
      {
        q: {
          lt: "Ar galiu pakeisti arba atšaukti užsakymą?",
          en: "Can I change or cancel an order?",
        },
        a: {
          lt: "Jei dar nepradėjome kalti — taip, tik parašykite kuo greičiau. Kai darbas jau pradėtas, pakeisti nebegalime, nes žiedas gaminamas konkrečiai jums.",
          en: "If we haven't started forging yet — yes, just write as soon as you can. Once the work has begun we can't change it, because the ring is being made specifically for you.",
        },
      },
      {
        q: {
          lt: "Ar galiu užsukti į dirbtuvę?",
          en: "Can I visit the studio?",
        },
        a: {
          lt: "Galite, bet tik iš anksto sutarus: Aušros Vartų g. 12, Vilnius, ketvirtadienį–šeštadienį 11–18. Parašykite arba paskambinkite, ir suderinsime laiką.",
          en: "Yes, but by appointment only: Aušros Vartų g. 12, Vilnius, Thursday to Saturday, 11–18. Write or call and we'll find a time.",
        },
      },
    ],
  },
  {
    id: "returns",
    title: { lt: "Grąžinimas ir keitimas", en: "Returns and exchanges" },
    items: [
      {
        q: { lt: "Ar galiu grąžinti žiedą?", en: "Can I return a ring?" },
        a: {
          lt: "Paruoštą žiedą galima grąžinti per 14 dienų, jei jis nenešiotas ir nepažeistas. Pagal užsakymą pagaminti, perdaryti pagal jūsų dydį ar graviruoti žiedai negrąžinami.",
          en: "A ready-made ring can be returned within 14 days, provided it is unworn and undamaged. Rings made to order, resized for you, or engraved cannot be returned.",
        },
      },
      {
        q: {
          lt: "Kodėl pagal užsakymą gaminti žiedai negrąžinami?",
          en: "Why aren't made-to-order rings returnable?",
        },
        a: {
          lt: "Tokį žiedą kalame konkrečiai jums ir konkrečiu dydžiu, todėl jo negalime pasiūlyti kitam. ES vartotojų teisė 14 dienų atsisakymo teisei taiko išimtį prekėms, pagamintoms pagal individualų užsakymą.",
          en: "A ring like that is forged for you, in your size, so we can't offer it to anyone else. EU consumer law makes an exception to the 14-day withdrawal right for goods produced to a customer's own specification.",
        },
      },
      {
        q: { lt: "Netinka dydis. Ką daryti?", en: "The size doesn't fit. What now?" },
        a: {
          lt: "Parašykite mums. Daugumos žiedų dydį galime pakeisti per 1–2 darbo dienas, ir tai beveik visada geresnis sprendimas nei grąžinimas.",
          en: "Write to us. For most rings we can change the size within 1–2 business days, and that's almost always a better outcome than a return.",
        },
      },
      {
        q: {
          lt: "Žiedas atkeliavo pažeistas.",
          en: "My ring arrived damaged.",
        },
        a: {
          lt: "Atsiųskite nuotrauką el. paštu ir išspręsime — sutaisysime arba pakeisime. Tai ne grąžinimas, o mūsų atsakomybė.",
          en: "Email us a photo and we'll sort it out — repair or replacement. That isn't a return, it's on us.",
        },
      },
    ],
  },
];

export function getFaqGroups(locale: Locale): FaqGroup[] {
  return groupSources.map((g) => ({
    id: g.id,
    title: g.title[locale],
    items: g.items.map((i) => ({ q: i.q[locale], a: i.a[locale] })),
  }));
}
