// PLACEHOLDER COPY — written to be consistent with facts the site already
// states (since 2021, Vilnius studio, handmade, small batch, made to order).
// Swap for the real story before launch; no real person is named on purpose.

export type Chapter = {
  no: string;
  year: string;
  title: string;
  body: string;
  image: string;
};

export const chapters: Chapter[] = [
  {
    no: "01",
    year: "2021",
    title: "Pradžia",
    body: "Viskas prasidėjo nuo žiedo, kurio niekur nepavyko rasti. Per storas, per blizgus, per daug panašus į visus kitus. Taigi jis buvo nukaltas pačiam sau — virtuvėje, su pasiskolintais įrankiais ir per dideliu užsispyrimu.",
    image: "/bg-hero/one.jpg",
  },
  {
    no: "02",
    year: "2022",
    title: "Dirbtuvė",
    body: "Antras aukštas Vilniaus senamiestyje, langas į kiemą ir priekalas, kuris girdisi per tris duris. Čia nėra konvejerio — yra vienas stalas, ant kurio vienu metu gimsta ne daugiau kaip keli žiedai.",
    image: "/bg-hero/five.jpg",
  },
  {
    no: "03",
    year: "Šiandien",
    title: "Metalas",
    body: "Dirbame su perlydytu sidabru ir auksu. Metalas turi atmintį — jis įsimena kiekvieną smūgį. Būtent todėl nešlifuojame kalimo žymių: jos parodo, kad daiktas turi kilmę, o ne partijos numerį.",
    image: "/bg-hero/nine.jpg",
  },
  {
    no: "04",
    year: "Toliau",
    title: "Jūs",
    body: "Beveik kiekvienas žiedas turi savininką dar prieš gimdamas. Jūs pasirenkate dydį, mes — kalame. Tai lėčiau nei nusipirkti iš lentynos, bet po metų vis dar žinosite, iš kur jis atsirado.",
    image: "/bg-hero/three.jpg",
  },
];

export type Step = {
  no: string;
  title: string;
  body: string;
  image: string;
};

export const steps: Step[] = [
  {
    no: "01",
    title: "Eskizas",
    body: "Ranka, ant popieriaus. Jei idėja neveikia pieštuku — neveiks ir metale.",
    image: "/bg-hero/two.jpg",
  },
  {
    no: "02",
    title: "Forma",
    body: "Vaškas pjaustomas ir šildomas tol, kol proporcijos nustoja erzinti.",
    image: "/bg-hero/four.jpg",
  },
  {
    no: "03",
    title: "Liejimas",
    body: "Metalas kaista iki 960 °C ir užpildo formą. Atgal kelio nebėra.",
    image: "/bg-hero/six.jpg",
  },
  {
    no: "04",
    title: "Kalimas",
    body: "Plaktukas suteikia paviršių. Kiekvienas smūgis lieka matomas.",
    image: "/bg-hero/eight.jpg",
  },
  {
    no: "05",
    title: "Apdaila",
    body: "Šlifavimas, matinimas, oksidavimas. Tada — dėžutė ir jūsų adresas.",
    image: "/bg-hero/eleven.jpg",
  },
];

export type Value = {
  no: string;
  title: string;
  body: string;
};

export const values: Value[] = [
  {
    no: "01",
    title: "Rankos, ne mašinos",
    body: "Jokios serijinės gamybos. Kiekvieną žiedą nuo eskizo iki poliravimo paliečia tos pačios rankos.",
  },
  {
    no: "02",
    title: "Mažos partijos",
    body: "Geriau penki žiedai, kuriuos prisimename, nei penki šimtai, kurių neatskirtume.",
  },
  {
    no: "03",
    title: "Perdirbtas metalas",
    body: "Sidabras ir auksas — perlydyti. Naujo metalo iš žemės neprašome, jo jau užtenka paviršiuje.",
  },
  {
    no: "04",
    title: "Be skubos",
    body: "Gaminame pagal užsakymą. Tai trunka 1–2 savaites, ir mes to neslepiame už „greito pristatymo“ pažado.",
  },
];

export type Stat = { value: number; suffix: string; label: string };

export const stats: Stat[] = [
  { value: 2021, suffix: "", label: "Nuo šių metų" },
  { value: 400, suffix: "+", label: "Nukaltų žiedų" },
  { value: 1, suffix: "", label: "Dirbtuvė Vilniuje" },
  { value: 100, suffix: "%", label: "Rankų darbas" },
];
