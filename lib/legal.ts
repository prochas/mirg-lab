// Legal page content (terms of sale, privacy policy, returns). Lives in
// TypeScript rather than messages/*.json for the same reason lib/faq.ts and
// lib/about.ts do: it's an ordered content list the pages iterate, not UI
// chrome — page/section titles for the surrounding banner still go through
// next-intl (see messages/*.json `termsPage` / `privacyPage` / `returnsPage`).
//
// The made-to-order/custom-goods exception to the EU 14-day withdrawal right
// (Directive 2011/83/EU art. 16(c), implemented via the Lithuanian Civil Code
// and the Mažmeninės prekybos taisyklės, Vyriausybės 2014-07-22 nutarimas
// Nr. 738) restates what lib/faq.ts already states in plain language — this is
// the authoritative wording; keep the two in step. The exact citation still
// needs checking against VVTAT guidance before launch (see CLAUDE.md).
//
// SELLER fields are placeholders — no legal entity is registered yet. Replace
// `name` and `id` with the real trading name and individual-activity
// certificate / company code before launch. Address, email and phone are the
// real ones already shown on the /contacts page.

import type { Locale } from "@/i18n/routing";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

const SELLER = {
  lt: {
    name: "[Vardas Pavardė / įmonės pavadinimas]",
    id: "[individualios veiklos pažymos Nr. / įmonės kodas]",
    address: "Aušros Vartų g. 12, Vilnius, Lietuva",
    email: "info@mirgalab.com",
    phone: "+370 600 00000",
  },
  en: {
    name: "[Full name / company name]",
    id: "[individual activity certificate No. / company code]",
    address: "Aušros Vartų g. 12, Vilnius, Lithuania",
    email: "info@mirgalab.com",
    phone: "+370 600 00000",
  },
} as const;

const UPDATED = { lt: "2026-08-02", en: "2026-08-02" } as const;

export function getUpdatedDate(locale: Locale): string {
  return UPDATED[locale];
}

const s = SELLER;

const TERMS_LT: LegalSection[] = [
  {
    heading: "1. Bendrosios nuostatos",
    paragraphs: [
      `Šios pirkimo–pardavimo taisyklės (toliau — Taisyklės) reglamentuoja prekių įsigijimą internetinėje parduotuvėje mirga.lab (toliau — Parduotuvė) ir taikomos kiekvieną kartą perkant Parduotuvėje.`,
      `Pardavėjas: ${s.lt.name}, ${s.lt.id}, adresas ${s.lt.address}, el. paštas ${s.lt.email}, tel. ${s.lt.phone} (toliau — Pardavėjas).`,
      `Pirkėju gali būti veiksnus fizinis asmuo. Užsakymą patvirtindamas, Pirkėjas patvirtina, kad su šiomis Taisyklėmis susipažino ir su jomis sutinka.`,
    ],
  },
  {
    heading: "2. Sutarties sudarymas",
    paragraphs: [
      `Sutartis tarp Pardavėjo ir Pirkėjo laikoma sudaryta nuo to momento, kai Stripe patvirtina apmokėjimą už užsakymą. Užsakymo patvirtinimas su pasirinktų prekių, dydžių ir kainų suvestine siunčiamas Pirkėjo nurodytu el. paštu.`,
      `Kol užsakymo gamyba nepradėta, Pirkėjas gali jį pakeisti arba atšaukti parašęs Pardavėjui. Pradėjus gamybą (kalimą, dydžio keitimą ar graviravimą), užsakymo pakeisti nebegalima, nes prekė gaminama konkrečiai Pirkėjui.`,
    ],
  },
  {
    heading: "3. Prekės ir kainos",
    paragraphs: [
      `Visos kainos Parduotuvėje nurodomos eurais (EUR) ir yra galutinės. Prekės kaina fiksuojama užsakymo pateikimo metu, remiantis tuo metu Parduotuvėje galiojančia kaina.`,
      `Kiekvienas žiedas kalamas ranka, todėl to paties modelio vienetai gali nežymiai skirtis kalimo žymėmis, faktūra ar atspalviu — tai natūrali rankų darbo savybė, o ne prekės trūkumas.`,
    ],
  },
  {
    heading: "4. Apmokėjimas",
    paragraphs: [
      `Apmokėjimą tvarko Stripe: Pirkėjas atsiskaito saugiame Stripe atsiskaitymo lange, o mokėjimo kortelės duomenys Pardavėjui nepatenka ir jo sistemose nesaugomi. Visi Pirkėjui pasiūlyti mokėjimo būdai matomi atsiskaitymo puslapyje.`,
    ],
  },
  {
    heading: "5. Gaminimas ir pristatymas",
    paragraphs: [
      `Jei Pirkėjo pasirinkto dydžio žiedas jau paruoštas — išsiunčiamas per 1–2 darbo dienas. Jei paruoštas vienetas yra kito dydžio, jis perdaromas per 1–2 darbo dienas. Jei žiedo nėra — jis kalamas nuo pradžių, ir tai trunka 1–2 savaites. Tiksli būsena Pirkėjui rodoma prekės puslapyje pasirinkus dydį ir kartojama krepšelyje bei užsakymo patvirtinime.`,
      `Prekės siunčiamos registruotu paštu su siuntos sekimo numeriu: Lietuvoje pristatymas trunka 2–3 darbo dienas, kitose Europos Sąjungos šalyse — 4–7 darbo dienas. Nuo 100 € užsakymo sumos pristatymas nemokamas. Už Europos Sąjungos ribų prekės nesiunčiamos, nebent dėl to atskirai susitariama su Pardavėju.`,
    ],
  },
  {
    heading: "6. Teisė atsisakyti sutarties",
    paragraphs: [
      `Pirkėjas, kuris yra vartotojas, turi teisę, nenurodydamas priežasties ir nepatirdamas kitų, negu numatyta įstatymuose, išlaidų, per 14 dienų nuo prekės gavimo atsisakyti nuotolinės pirkimo–pardavimo sutarties, grąžindamas nenešiotą ir nepažeistą prekę.`,
      `Vadovaujantis 2011 m. spalio 25 d. Europos Parlamento ir Tarybos direktyvos 2011/83/ES 16 straipsnio c punktu bei jį įgyvendinančiais Lietuvos Respublikos teisės aktais (Lietuvos Respublikos civilinis kodeksas ir Mažmeninės prekybos taisyklės, patvirtintos Lietuvos Respublikos Vyriausybės 2014 m. liepos 22 d. nutarimu Nr. 738), ši teisė netaikoma prekėms, pagamintoms pagal Pirkėjo nurodytas specifikacijas arba aiškiai jam pritaikytoms — tai yra pagal užsakymą nuo pradžių nukaltiems, Pirkėjo dydžiu perdarytiems ir graviruotiems žiedams.`,
      `Detali grąžinimo tvarka ir sąlygos aprašytos Grąžinimo taisyklėse.`,
    ],
  },
  {
    heading: "7. Kokybės garantija ir pretenzijos",
    paragraphs: [
      `Pardavėjas atsako už parduodamos prekės kokybę teisės aktų nustatyta tvarka. Jei prekė atkeliauja pažeista arba turi gamybos trūkumą, Pirkėjas per protingą terminą apie tai informuoja Pardavėją el. paštu ${s.lt.email}, pridėdamas nuotrauką. Pardavėjas savo sąskaita prekę sutaiso, pakeičia arba grąžina sumokėtus pinigus.`,
    ],
  },
  {
    heading: "8. Atsakomybės ribojimas",
    paragraphs: [
      `Šalys atsako už šių Taisyklių nesilaikymą Lietuvos Respublikos teisės aktų nustatyta tvarka. Pardavėjas neatsako už vėlavimus ar prievolių nevykdymą, kilusius dėl aplinkybių, kurių Pardavėjas negalėjo kontroliuoti ir protingai numatyti (nenugalimos jėgos aplinkybės).`,
    ],
  },
  {
    heading: "9. Asmens duomenys",
    paragraphs: [
      `Asmens duomenų tvarkymo tvarka aprašyta Privatumo politikoje, kuri yra neatskiriama šių Taisyklių dalis.`,
    ],
  },
  {
    heading: "10. Ginčų sprendimas",
    paragraphs: [
      `Nesutarimus Šalys pirmiausia sprendžia derybomis. Jei susitarti nepavyksta, vartotojas turi teisę kreiptis į Valstybinę vartotojų teisių apsaugos tarnybą (VVTAT, www.vvtat.lt) arba pasinaudoti Europos Sąjungos elektroninio ginčų sprendimo platforma (ec.europa.eu/consumers/odr). Ginčai taip pat gali būti sprendžiami teisme Lietuvos Respublikos teisės aktų nustatyta tvarka.`,
    ],
  },
  {
    heading: "11. Baigiamosios nuostatos",
    paragraphs: [
      `Šioms Taisyklėms taikoma Lietuvos Respublikos teisė. Pardavėjas turi teisę Taisykles keisti; užsakymui taikoma jo pateikimo momentu galiojusi Taisyklių redakcija.`,
    ],
  },
];

const TERMS_EN: LegalSection[] = [
  {
    heading: "1. General provisions",
    paragraphs: [
      `These terms of sale (the "Terms") govern the purchase of goods through the mirga.lab online shop (the "Shop") and apply to every purchase made there.`,
      `Seller: ${s.en.name}, ${s.en.id}, address ${s.en.address}, email ${s.en.email}, phone ${s.en.phone} (the "Seller").`,
      `The Buyer must be a natural person with legal capacity to enter into a contract. By confirming an order, the Buyer confirms having read and agreed to these Terms.`,
    ],
  },
  {
    heading: "2. Formation of the contract",
    paragraphs: [
      `The contract between the Seller and the Buyer is concluded the moment Stripe confirms payment for the order. An order confirmation listing the items, sizes and prices is sent to the Buyer's email address.`,
      `Until production has started, the Buyer may change or cancel the order by writing to the Seller. Once production has begun (forging, resizing or engraving), the order can no longer be changed, since the item is made specifically for the Buyer.`,
    ],
  },
  {
    heading: "3. Goods and prices",
    paragraphs: [
      `All prices in the Shop are shown in euros (EUR) and are final. The price is fixed at the time the order is placed, based on the price then displayed in the Shop.`,
      `Every ring is forged by hand, so units of the same model may differ slightly in hammer marks, texture or tone — that is a natural feature of handmade work, not a defect.`,
    ],
  },
  {
    heading: "4. Payment",
    paragraphs: [
      `Payment is handled by Stripe: the Buyer pays on a secure Stripe checkout page, and card details never reach the Seller or are stored in the Seller's systems. Every payment method offered to the Buyer is shown at checkout.`,
    ],
  },
  {
    heading: "5. Production and delivery",
    paragraphs: [
      `If a ring in the Buyer's chosen size is already finished, it ships within 1–2 business days. If the finished piece is a different size, it is resized within 1–2 business days. If no piece exists yet, it is forged from scratch, which takes 1–2 weeks. The exact status is shown on the product page once a size is chosen, and repeats in the cart and order confirmation.`,
      `Orders are sent by registered post with a tracking number: delivery within Lithuania takes 2–3 business days, and to other European Union countries 4–7 business days. Delivery is free from an order value of €100. Goods are not shipped outside the European Union unless separately agreed with the Seller.`,
    ],
  },
  {
    heading: "6. Right of withdrawal",
    paragraphs: [
      `A Buyer who is a consumer has the right to withdraw from a distance contract within 14 days of receiving the goods, without giving a reason and without costs other than those set out in law, by returning the item unworn and undamaged.`,
      `Under Article 16(c) of Directive 2011/83/EU of 25 October 2011 and the Lithuanian legislation implementing it (the Lithuanian Civil Code and the Retail Trade Rules approved by Resolution No. 738 of the Government of the Republic of Lithuania of 22 July 2014), this right does not apply to goods made to the Buyer's specifications or clearly personalised — that is, rings forged from scratch to order, resized to the Buyer's size, or engraved.`,
      `Full return conditions and procedure are set out in the Returns Policy.`,
    ],
  },
  {
    heading: "7. Quality guarantee and complaints",
    paragraphs: [
      `The Seller is responsible for the quality of goods sold as required by law. If an item arrives damaged or has a manufacturing defect, the Buyer notifies the Seller within a reasonable time by email at ${s.en.email}, attaching a photo. The Seller will repair, replace, or refund the item at its own expense.`,
    ],
  },
  {
    heading: "8. Limitation of liability",
    paragraphs: [
      `Each party is liable for a breach of these Terms as provided by Lithuanian law. The Seller is not liable for delays or failure to perform caused by circumstances beyond the Seller's reasonable control (force majeure).`,
    ],
  },
  {
    heading: "9. Personal data",
    paragraphs: [
      `Personal data is processed as described in the Privacy Policy, which forms an integral part of these Terms.`,
    ],
  },
  {
    heading: "10. Dispute resolution",
    paragraphs: [
      `The parties first attempt to resolve any disagreement through negotiation. If that fails, a consumer may contact the State Consumer Rights Protection Authority (VVTAT, www.vvtat.lt) or use the EU Online Dispute Resolution platform (ec.europa.eu/consumers/odr). Disputes may also be brought before a Lithuanian court as provided by law.`,
    ],
  },
  {
    heading: "11. Final provisions",
    paragraphs: [
      `These Terms are governed by the law of the Republic of Lithuania. The Seller may amend these Terms; each order is governed by the version of the Terms in effect when it was placed.`,
    ],
  },
];

const PRIVACY_LT: LegalSection[] = [
  {
    heading: "1. Duomenų valdytojas",
    paragraphs: [
      `Jūsų asmens duomenų valdytojas yra ${s.lt.name}, ${s.lt.id}, adresas ${s.lt.address}, el. paštas ${s.lt.email}, tel. ${s.lt.phone}.`,
    ],
  },
  {
    heading: "2. Kokius duomenis renkame",
    paragraphs: [
      `Užsakant prekes: vardas, el. paštas, pristatymo ir sąskaitos adresas bei telefono numeris, kuriuos Stripe atsiskaitymo lange pateikiate tiesiogiai Stripe. Prie užsakymo taip pat priskiriami pasirinktos prekės, dydis ir kaina.`,
      `Susisiekiant per kontaktų formą: vardas, el. paštas ir žinutės tekstas.`,
      `Naršant Parduotuvę: krepšelio turinys (prekės id, dydis, kiekis) saugomas jūsų naršyklės atmintinėje (localStorage) ir nesiunčiamas į jokį serverį, kol nepradedate atsiskaitymo.`,
    ],
  },
  {
    heading: "3. Tikslai ir teisinis pagrindas",
    paragraphs: [
      `Užsakymo įvykdymui ir pristatymui — sutarties su Jumis vykdymui (BDAR 6 straipsnio 1 dalies b punktas).`,
      `Buhalterinei apskaitai — teisinės prievolės vykdymui (BDAR 6 straipsnio 1 dalies c punktas).`,
      `Atsakymui į Jūsų užklausas per kontaktų formą — teisėtam interesui atsakyti į gautą paklausimą (BDAR 6 straipsnio 1 dalies f punktas).`,
    ],
  },
  {
    heading: "4. Kam perduodame duomenis",
    paragraphs: [
      `Jūsų duomenis tvarko šie paslaugų teikėjai, veikiantys kaip duomenų tvarkytojai:`,
    ],
    list: [
      "Stripe — mokėjimų priėmimas; kortelės duomenys pasiekiami tik Stripe, ne Pardavėjui.",
      "Resend — užsakymo patvirtinimo el. laiško išsiuntimas.",
      "Sanity — prekių katalogo turinys; užsakant į Sanity Jūsų asmens duomenys nepatenka.",
      "Vercel — svetainės talpinimas bei Vercel Web Analytics, teikiantis apibendrintą, anoniminę lankomumo statistiką be slapukų ir be asmens duomenų.",
    ],
  },
  {
    heading: "5. Saugojimo terminai",
    paragraphs: [
      `Su užsakymu susiję duomenys, kuriuos matome Stripe suvestinėse, saugomi buhalterinę apskaitą reglamentuojančių teisės aktų nustatytą laikotarpį. Kontaktų formos žinutės saugomos tiek, kiek reikia paklausimui išnagrinėti, ir protingą laiką po to.`,
    ],
  },
  {
    heading: "6. Jūsų teisės",
    paragraphs: [
      `Turite teisę susipažinti su savo asmens duomenimis, prašyti juos ištaisyti ar ištrinti, apriboti jų tvarkymą, prieštarauti tvarkymui bei prašyti duomenų perkeliamumo. Šias teises galite įgyvendinti parašę ${s.lt.email}.`,
      `Jei manote, kad Jūsų duomenys tvarkomi neteisėtai, turite teisę pateikti skundą Valstybinei duomenų apsaugos inspekcijai (vdai.lrv.lt).`,
    ],
  },
  {
    heading: "7. Slapukai, analitika ir naršyklės atmintis",
    paragraphs: [
      `Parduotuvė nenaudoja rinkodaros ar sekimo slapukų. Lankomumo statistikai renkame apibendrintus, anoniminius duomenis per Vercel Web Analytics — šis įrankis nenaudoja slapukų ir netapatina Jūsų kaip asmens.`,
      `Krepšelio turinys saugomas Jūsų naršyklės localStorage atmintinėje — tai būtina Parduotuvės veikimui (kad krepšelis išliktų perkrovus puslapį) ir jokiems tretiesiems asmenims neperduodama.`,
    ],
  },
  {
    heading: "8. Duomenų sauga",
    paragraphs: [
      `Duomenys perduodami užšifruotu ryšiu (HTTPS). Mokėjimo kortelių duomenis tvarko tik Stripe, atitinkantis PCI DSS reikalavimus — jie niekada nepasiekia Pardavėjo sistemų.`,
    ],
  },
  {
    heading: "9. Šios politikos pakeitimai",
    paragraphs: [
      `Pardavėjas gali šią Privatumo politiką atnaujinti. Aktuali redakcija visada skelbiama šiame puslapyje kartu su atnaujinimo data.`,
    ],
  },
  {
    heading: "10. Kontaktai",
    paragraphs: [
      `Dėl klausimų apie savo asmens duomenis rašykite ${s.lt.email} arba skambinkite ${s.lt.phone}.`,
    ],
  },
];

const PRIVACY_EN: LegalSection[] = [
  {
    heading: "1. Data controller",
    paragraphs: [
      `The controller of your personal data is ${s.en.name}, ${s.en.id}, address ${s.en.address}, email ${s.en.email}, phone ${s.en.phone}.`,
    ],
  },
  {
    heading: "2. What data we collect",
    paragraphs: [
      `When ordering: name, email, shipping and billing address, and phone number, which you provide directly to Stripe on the checkout page. Your order is also associated with the items, size and price chosen.`,
      `When contacting us via the contact form: name, email and the message text.`,
      `While browsing the Shop: your cart contents (item id, size, quantity) are stored in your browser's local storage and are not sent to any server until you start checkout.`,
    ],
  },
  {
    heading: "3. Purposes and legal basis",
    paragraphs: [
      `To fulfil and deliver your order — performance of a contract with you (GDPR Art. 6(1)(b)).`,
      `For accounting — compliance with a legal obligation (GDPR Art. 6(1)(c)).`,
      `To respond to enquiries sent via the contact form — legitimate interest in answering a request you sent us (GDPR Art. 6(1)(f)).`,
    ],
  },
  {
    heading: "4. Who we share data with",
    paragraphs: [
      `Your data is processed by the following service providers, acting as data processors:`,
    ],
    list: [
      "Stripe — payment processing; card details are seen only by Stripe, never by the Seller.",
      "Resend — sending the order confirmation email.",
      "Sanity — product catalog content; your personal data is not sent to Sanity when you order.",
      "Vercel — website hosting, plus Vercel Web Analytics, which provides aggregated, anonymous visit statistics without cookies or personal data.",
    ],
  },
  {
    heading: "5. Retention periods",
    paragraphs: [
      `Order-related data visible in Stripe is kept for the period required by accounting legislation. Contact form messages are kept for as long as needed to handle the enquiry, plus a reasonable period afterwards.`,
    ],
  },
  {
    heading: "6. Your rights",
    paragraphs: [
      `You have the right to access your personal data, request its correction or erasure, restrict its processing, object to processing, and request data portability. You can exercise these rights by writing to ${s.en.email}.`,
      `If you believe your data is being processed unlawfully, you have the right to lodge a complaint with the State Data Protection Inspectorate (vdai.lrv.lt).`,
    ],
  },
  {
    heading: "7. Cookies, analytics and browser storage",
    paragraphs: [
      `The Shop does not use marketing or tracking cookies. For visit statistics we collect aggregated, anonymous data through Vercel Web Analytics — this tool does not use cookies and does not identify you personally.`,
      `Cart contents are stored in your browser's local storage — this is necessary for the Shop to work (so the cart survives a page reload) and is never shared with third parties.`,
    ],
  },
  {
    heading: "8. Data security",
    paragraphs: [
      `Data is transmitted over an encrypted connection (HTTPS). Payment card details are handled solely by Stripe, which is PCI DSS compliant — they never reach the Seller's systems.`,
    ],
  },
  {
    heading: "9. Changes to this policy",
    paragraphs: [
      `The Seller may update this Privacy Policy. The current version is always published on this page together with its update date.`,
    ],
  },
  {
    heading: "10. Contact",
    paragraphs: [
      `For questions about your personal data, write to ${s.en.email} or call ${s.en.phone}.`,
    ],
  },
];

const RETURNS_LT: LegalSection[] = [
  {
    heading: "1. Bendra 14 dienų teisė",
    paragraphs: [
      `Paruoštą (jau nukaltą) žiedą galite grąžinti per 14 dienų nuo jo gavimo, jei jis nenešiotas, nepažeistas ir yra originalioje pakuotėje.`,
    ],
  },
  {
    heading: "2. Kas negrąžinama",
    paragraphs: [
      `Vadovaujantis Direktyvos 2011/83/ES 16 straipsnio c punktu, žiedai, pagaminti pagal Jūsų individualų užsakymą arba aiškiai Jums pritaikyti, negrąžinami — nes tokios prekės Pardavėjas negali pasiūlyti kitam pirkėjui.`,
    ],
    list: [
      "Nuo pradžių pagal užsakymą nukalti žiedai (gaminimo statusas „Gaminama“)",
      "Į Jūsų dydį perdaryti žiedai (dydžio keitimas)",
      "Graviruoti žiedai",
    ],
  },
  {
    heading: "3. Kaip grąžinti",
    paragraphs: [
      `Per 14 dienų nuo prekės gavimo parašykite ${s.lt.email}, nurodydami užsakymo numerį ir grąžinimo priežastį. Atsakysime su grąžinimo adresu ir tolesniais žingsniais. Prekę išsiųskite per 14 dienų nuo pranešimo apie grąžinimą pateikimo.`,
    ],
  },
  {
    heading: "4. Grąžinimo išlaidos",
    paragraphs: [
      `Kai grąžinama dėl Pirkėjo apsisprendimo (teisės atsisakyti sutarties), grąžinimo siuntimo išlaidas padengia Pirkėjas. Kai prekė pažeista, netinkama arba atsiųsta klaidingai, grąžinimo išlaidas padengia Pardavėjas.`,
    ],
  },
  {
    heading: "5. Pinigų grąžinimas",
    paragraphs: [
      `Gavę grąžintą prekę (arba jos išsiuntimo įrodymą — priklausomai nuo to, kas įvyksta anksčiau), sumokėtus pinigus grąžiname per 14 dienų tuo pačiu būdu, kuriuo buvo atsiskaityta per Stripe.`,
    ],
  },
  {
    heading: "6. Netinka dydis? Pirmiau apsvarstykite dydžio keitimą",
    paragraphs: [
      `Prieš grąžindami, parašykite mums — daugumos žiedų dydį galime pakeisti per 1–2 darbo dienas. Tai dažniausiai greitesnis ir patogesnis sprendimas nei grąžinimas ir naujas užsakymas.`,
    ],
  },
  {
    heading: "7. Pažeista ar netinkama prekė",
    paragraphs: [
      `Jei žiedas atkeliavo pažeistas ar su gamybos trūkumu, atsiųskite nuotrauką el. paštu ${s.lt.email}. Tai nelaikoma grąžinimu — prekę sutaisysime, pakeisime arba grąžinsime pinigus Pardavėjo sąskaita.`,
    ],
  },
  {
    heading: "8. Kontaktai",
    paragraphs: [
      `Dėl grąžinimo ar keitimo rašykite ${s.lt.email} arba skambinkite ${s.lt.phone}.`,
    ],
  },
];

const RETURNS_EN: LegalSection[] = [
  {
    heading: "1. The general 14-day right",
    paragraphs: [
      `A ready-made (already forged) ring can be returned within 14 days of receiving it, provided it is unworn, undamaged and in its original packaging.`,
    ],
  },
  {
    heading: "2. What can't be returned",
    paragraphs: [
      `Under Article 16(c) of Directive 2011/83/EU, rings made to your individual order or clearly personalised for you cannot be returned — the Seller cannot offer such an item to another buyer.`,
    ],
    list: [
      "Rings forged from scratch to order (\"made to order\" status)",
      "Rings resized to fit you",
      "Engraved rings",
    ],
  },
  {
    heading: "3. How to return an item",
    paragraphs: [
      `Within 14 days of receiving the item, write to ${s.en.email} with your order number and the reason for the return. We'll reply with a return address and the next steps. Ship the item back within 14 days of notifying us of the return.`,
    ],
  },
  {
    heading: "4. Return shipping costs",
    paragraphs: [
      `When returning by choice (exercising the right of withdrawal), the Buyer covers the return shipping cost. When an item is damaged, faulty, or sent by mistake, the Seller covers the return shipping cost.`,
    ],
  },
  {
    heading: "5. Refunds",
    paragraphs: [
      `Once we receive the returned item (or proof that it has been shipped back, whichever comes first), we refund the amount paid within 14 days, using the same method you paid with through Stripe.`,
    ],
  },
  {
    heading: "6. Wrong size? Consider a resize first",
    paragraphs: [
      `Before returning an item, write to us — we can resize most rings within 1–2 business days. That's usually faster and simpler than a return followed by a new order.`,
    ],
  },
  {
    heading: "7. Damaged or faulty item",
    paragraphs: [
      `If your ring arrives damaged or with a manufacturing defect, email us a photo at ${s.en.email}. This isn't treated as a return — we'll repair it, replace it, or refund you, at the Seller's expense.`,
    ],
  },
  {
    heading: "8. Contact",
    paragraphs: [
      `For returns or exchanges, write to ${s.en.email} or call ${s.en.phone}.`,
    ],
  },
];

export function getTermsSections(locale: Locale): LegalSection[] {
  return locale === "lt" ? TERMS_LT : TERMS_EN;
}

export function getPrivacySections(locale: Locale): LegalSection[] {
  return locale === "lt" ? PRIVACY_LT : PRIVACY_EN;
}

export function getReturnsSections(locale: Locale): LegalSection[] {
  return locale === "lt" ? RETURNS_LT : RETURNS_EN;
}
