/**
 * One-off migration: moves the eight hand-written rings that used to live in
 * `lib/rings.ts` into Sanity, uploading their photos as real image assets.
 *
 *   npm run seed:rings          # create missing docs, leave existing ones alone
 *   npm run seed:rings -- --replace   # overwrite the eight seeded docs
 *
 * Plain .mjs on purpose — it runs under bare `node` with no build step and no
 * extra dependency, and it is a throwaway artifact rather than app code.
 *
 * Idempotent: documents use deterministic ids (`material-silver-925`,
 * `product-bangele`), and images are keyed by filename so re-running does not
 * upload a second copy of the same photo.
 *
 * Those ids use dashes, never dots, and that is load-bearing: Sanity treats any
 * document id containing a `.` as private, so a tokenless request — which is
 * exactly what the shop's read client makes — gets zero rows back. Dotted ids
 * seed and validate perfectly and then render an empty catalog in production.
 */

import { createClient } from '@sanity/client'
import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const IMAGE_DIR = join(ROOT, 'public', 'new-offers')
const REPLACE = process.argv.includes('--replace')

/* ── env ─────────────────────────────────────────────────────────────────── */

// Next loads .env.local itself; a bare node process does not, and pulling in
// dotenv for one script isn't worth it.
async function loadEnvLocal() {
  let raw
  try {
    raw = await readFile(join(ROOT, '.env.local'), 'utf8')
  } catch {
    return
  }
  for (const line of raw.split('\n')) {
    const match = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/.exec(line)
    if (!match) continue
    const [, key, value = ''] = match
    if (process.env[key] !== undefined) continue
    process.env[key] = value.trim().replace(/^(['"])([\s\S]*)\1$/, '$2')
  }
}

await loadEnvLocal()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

const missing = [
  !projectId && 'NEXT_PUBLIC_SANITY_PROJECT_ID',
  !dataset && 'NEXT_PUBLIC_SANITY_DATASET',
  !token && 'SANITY_WRITE_TOKEN',
].filter(Boolean)

if (missing.length) {
  console.error(`\n  Missing env: ${missing.join(', ')}\n`)
  if (missing.includes('SANITY_WRITE_TOKEN')) {
    console.error(
      '  Create a token with Editor permissions at\n' +
        `  https://www.sanity.io/manage/project/${projectId ?? '<project>'}/api#tokens\n` +
        '  then add it to .env.local as SANITY_WRITE_TOKEN=...\n',
    )
  }
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-27',
  token,
  useCdn: false,
})

/* ── content ─────────────────────────────────────────────────────────────── */

const MATERIALS = {
  silver925: { key: 'silver-925', title: { lt: 'Sidabras 925', en: 'Sterling silver 925' } },
  gold14k: { key: 'gold-14k', title: { lt: 'Auksas 14k', en: '14k gold' } },
  gold18k: { key: 'gold-18k', title: { lt: 'Auksas 18k', en: '18k gold' } },
  goldPlated: {
    key: 'gold-plated-silver',
    title: { lt: 'Paauksuotas sidabras', en: 'Gold-plated silver' },
  },
}

// `images` are filenames in public/new-offers; order is the card contract —
// [0] card front, [1] hover swap, the rest gallery only.
const RINGS = [
  {
    slug: 'bangele',
    price: 145,
    material: MATERIALS.silver925.key,
    featured: true,
    title: { lt: 'Bangelė', en: 'Ripple' },
    description: {
      lt: 'Banguotas profilis, nulietas ir nukaltas ranka. Paviršius paliktas matinis, todėl įbrėžimai laikui bėgant tampa dalimi žiedo — o ne defektu.',
      en: 'A wave-cut profile, cast and then hammered by hand. The surface is left matte, so over time scratches become part of the ring rather than a flaw in it.',
    },
    details: {
      lt: ['Sidabras 925, be dangos', 'Plotis 4 mm, storis 2 mm', 'Matinis, šepečiu apdirbtas paviršius', 'Kiekvienas vienetas šiek tiek skiriasi'],
      en: ['Sterling silver 925, uncoated', '4 mm wide, 2 mm thick', 'Matte, brushed finish', 'Every piece differs slightly'],
    },
    images: ['ring_one.avif', 'ring_one_hover.avif', 'ring_two.avif', 'ring_three.avif'],
    sizeOptions: ['16', '17', '18', '19', '20'],
    ready: true,
    readySize: '18',
  },
  {
    slug: 'uola',
    price: 210,
    material: MATERIALS.gold14k.key,
    featured: true,
    title: { lt: 'Uola', en: 'Boulder' },
    description: {
      lt: 'Netaisyklingas, tarsi nuskeltas paviršius — forma auga iš liejimo, o ne iš brėžinio. Sunkus, bet neužkliūva už rankovės.',
      en: 'An irregular, chipped-looking surface — the shape grows out of the casting, not out of a drawing. Heavy, yet it never snags on a sleeve.',
    },
    details: {
      lt: ['Auksas 14k', 'Plotis 6 mm ties plačiausia vieta', 'Netaisyklinga, lieta faktūra', 'Gaminama pagal užsakymą'],
      en: ['14k gold', '6 mm at its widest point', 'Irregular, as-cast texture', 'Made to order'],
    },
    images: ['ring_two.avif', 'ring_two_hover.avif', 'ring_four.avif', 'ring_one.avif'],
    sizeOptions: ['15', '16', '17', '18', '19'],
    ready: false,
  },
  {
    slug: 'signetas-minimal',
    price: 165,
    material: MATERIALS.silver925.key,
    featured: true,
    title: { lt: 'Signetas Minimal', en: 'Minimal Signet' },
    description: {
      lt: 'Klasikinis signetas, nuimtas iki esmės. Plokščias skydelis paliktas tuščias — galime įgraviruoti inicialus arba palikti švarų.',
      en: 'A classic signet stripped back to the essentials. The flat face is left blank — we can engrave initials or leave it clean.',
    },
    details: {
      lt: ['Sidabras 925', 'Skydelis 12 × 10 mm', 'Galima gravūra (rašykite prieš užsakant)', 'Poliruotas paviršius'],
      en: ['Sterling silver 925', 'Face 12 × 10 mm', 'Engraving available (write to us before ordering)', 'Polished finish'],
    },
    images: ['ring_three.avif', 'ring_three_hover.avif', 'ring_one.avif', 'ring_four.avif'],
    sizeOptions: ['17', '18', '19', '20', '21'],
    ready: true,
    readySize: '19',
  },
  {
    slug: 'pyne',
    price: 180,
    material: MATERIALS.goldPlated.key,
    featured: true,
    title: { lt: 'Pynė', en: 'Braid' },
    description: {
      lt: 'Trys atskiros vielos, supintos ranka ir sulituotos į vientisą žiedą. Auksavimas storas, 3 mikronų, todėl nenusitrina po mėnesio.',
      en: 'Three separate wires, braided by hand and soldered into one band. The gold layer is a thick 3 microns, so it won’t wear through in a month.',
    },
    details: {
      lt: ['Sidabras 925 su 3 µm aukso danga', 'Trijų vielų pynė, plotis 5 mm', 'Pinama ranka', 'Venkite chloruoto vandens'],
      en: ['Sterling silver 925 with a 3 µm gold layer', 'Three-wire braid, 5 mm wide', 'Braided by hand', 'Avoid chlorinated water'],
    },
    images: ['ring_four.avif', 'ring_four_hover.avif', 'ring_two.avif', 'ring_three.avif'],
    sizeOptions: ['16', '17', '18', '19'],
    ready: false,
  },
  {
    slug: 'akmenukas',
    price: 260,
    material: MATERIALS.gold18k.key,
    title: { lt: 'Akmenukas', en: 'Pebble' },
    description: {
      lt: 'Vienas akmuo, įsodintas žemai ir tvirtai — nekliūva, netraukia dėmesio iš toli, bet iš arti aišku, kad tai ne masinė gamyba.',
      en: 'A single stone, set low and tight — it doesn’t catch, it doesn’t shout across a room, but up close it’s obvious this wasn’t mass-produced.',
    },
    details: {
      lt: ['Auksas 18k', 'Žemas rėmelio sodinimas', 'Akmuo 4 mm', 'Gaminama pagal užsakymą'],
      en: ['18k gold', 'Low bezel setting', '4 mm stone', 'Made to order'],
    },
    images: ['ring_one_hover.avif', 'ring_one.avif', 'ring_three_hover.avif', 'ring_two.avif'],
    sizeOptions: ['15', '16', '17', '18'],
    ready: true,
    readySize: '16',
  },
  {
    slug: 'grubus',
    price: 195,
    material: MATERIALS.silver925.key,
    title: { lt: 'Grubus', en: 'Rough' },
    description: {
      lt: 'Kalimo žymės paliktos matomos. Nešlifuojame jų — būtent jos parodo, kad žiedas gimė ant priekalo, o ne staklėse.',
      en: 'The hammer marks are left visible. We don’t sand them away — they’re exactly what shows this ring was born on an anvil, not in a machine.',
    },
    details: {
      lt: ['Sidabras 925', 'Plotis 8 mm — masyvus', 'Matomos plaktuko žymės', 'Oksiduotas, tamsintas paviršius'],
      en: ['Sterling silver 925', '8 mm wide — chunky', 'Visible hammer marks', 'Oxidised, darkened finish'],
    },
    images: ['ring_two_hover.avif', 'ring_two.avif', 'ring_four_hover.avif', 'ring_one.avif'],
    sizeOptions: ['18', '19', '20', '21', '22'],
    ready: false,
  },
  {
    slug: 'lasas',
    price: 150,
    material: MATERIALS.silver925.key,
    title: { lt: 'Lašas', en: 'Droplet' },
    description: {
      lt: 'Sustingęs metalo lašas ant plonos apyrankės. Lengviausias kolekcijos žiedas — tinka nešioti kasdien ir pamiršti, kad jį turi.',
      en: 'A frozen drop of metal on a thin band. The lightest ring in the collection — made to wear daily and forget you have it on.',
    },
    details: {
      lt: ['Sidabras 925', 'Apyrankė 2 mm, lašas 6 mm', 'Poliruota iki veidrodinio blizgesio', 'Tinka kasdieniam nešiojimui'],
      en: ['Sterling silver 925', '2 mm band, 6 mm drop', 'Polished to a mirror shine', 'Made for everyday wear'],
    },
    images: ['ring_three_hover.avif', 'ring_three.avif', 'ring_one_hover.avif', 'ring_four.avif'],
    sizeOptions: ['16', '17', '18', '19', '20'],
    ready: true,
    readySize: '17',
  },
  {
    slug: 'masyvus',
    price: 230,
    material: MATERIALS.gold14k.key,
    title: { lt: 'Masyvus', en: 'Heavyweight' },
    description: {
      lt: 'Pilnai užpildytas, be tuštumų viduje. Sveria tiek, kiek atrodo — ir būtent dėl to nešiojasi taip, kaip turėtų nešiotis auksas.',
      en: 'Solid all the way through, no hollow core. It weighs what it looks like it weighs — which is exactly why it wears the way gold should.',
    },
    details: {
      lt: ['Auksas 14k, vientisas', 'Plotis 9 mm', 'Apvalinti kraštai', 'Gaminama pagal užsakymą, 1–2 sav.'],
      en: ['14k gold, solid', '9 mm wide', 'Rounded edges', 'Made to order, 1–2 weeks'],
    },
    images: ['ring_four_hover.avif', 'ring_four.avif', 'ring_two_hover.avif', 'ring_three.avif'],
    sizeOptions: ['19', '20', '21', '22', '23'],
    ready: false,
  },
]

/* ── images ──────────────────────────────────────────────────────────────── */

/**
 * Uploads every photo once and returns { filename -> assetId }.
 *
 * Existing assets are matched on a sha1 of the file bytes stored in the asset's
 * `label`, so a second run reuses them instead of filling the media library
 * with duplicates.
 */
async function uploadImages(filenames) {
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && defined(label) && label in $labels]{ _id, label }`,
    { labels: filenames.map((name) => `seed:${name}`) },
  )
  const byLabel = new Map(existing.map((asset) => [asset.label, asset._id]))
  const assets = {}

  for (const name of filenames) {
    const label = `seed:${name}`
    const reused = byLabel.get(label)
    if (reused) {
      assets[name] = reused
      console.log(`   · ${name} — already uploaded`)
      continue
    }

    const bytes = await readFile(join(IMAGE_DIR, name))
    const asset = await client.assets.upload('image', bytes, {
      filename: name,
      label,
      title: name,
    })
    assets[name] = asset._id
    console.log(`   ✓ ${name} — uploaded`)
  }

  return assets
}

/* ── run ─────────────────────────────────────────────────────────────────── */

// A stable per-image key, so re-running doesn't reshuffle the array in Studio.
const imageKey = (slug, name, i) =>
  createHash('sha1').update(`${slug}:${name}:${i}`).digest('hex').slice(0, 12)

async function main() {
  console.log(`\n  Seeding rings into ${projectId}/${dataset}${REPLACE ? ' (replacing)' : ''}\n`)

  const available = new Set(await readdir(IMAGE_DIR))
  const needed = [...new Set(RINGS.flatMap((r) => r.images))]
  const absent = needed.filter((name) => !available.has(name))
  if (absent.length) {
    console.error(`  Missing image files in public/new-offers: ${absent.join(', ')}\n`)
    process.exit(1)
  }

  console.log('  Photos')
  const assets = await uploadImages(needed)

  // Materials first — products reference them, and a reference to a
  // non-existent document would fail validation in Studio.
  console.log('\n  Materials')
  const materialTx = client.transaction()
  for (const { key, title } of Object.values(MATERIALS)) {
    const doc = {
      _id: `material-${key}`,
      _type: 'material',
      title,
      key: { _type: 'slug', current: key },
    }
    // createOrReplace is safe here: a material has no editable prose worth
    // preserving, it's just a key plus its two labels.
    materialTx.createOrReplace(doc)
    console.log(`   ✓ ${key}`)
  }
  await materialTx.commit()

  console.log('\n  Rings')
  const productTx = client.transaction()
  RINGS.forEach((ring, index) => {
    const doc = {
      _id: `product-${ring.slug}`,
      _type: 'product',
      title: ring.title,
      slug: { _type: 'slug', current: ring.slug },
      material: { _type: 'reference', _ref: `material-${ring.material}` },
      description: ring.description,
      details: ring.details,
      price: ring.price,
      sizeOptions: ring.sizeOptions,
      ready: ring.ready,
      ...(ring.readySize ? { readySize: ring.readySize } : {}),
      featured: ring.featured ?? false,
      order: index,
      images: ring.images.map((name, i) => ({
        _type: 'image',
        _key: imageKey(ring.slug, name, i),
        asset: { _type: 'reference', _ref: assets[name] },
      })),
    }

    // Default to `createIfNotExists` so a second run never silently discards
    // edits the owner made in Studio. `--replace` is the explicit opt-in.
    if (REPLACE) productTx.createOrReplace(doc)
    else productTx.createIfNotExists(doc)

    console.log(`   ✓ ${ring.slug} — ${ring.price} € · ${ring.ready ? 'ready' : 'made to order'}`)
  })
  await productTx.commit()

  console.log(
    `\n  Done: ${Object.keys(MATERIALS).length} materials, ${needed.length} photos, ${RINGS.length} rings.` +
      (REPLACE ? '' : '\n  Existing rings were left untouched — re-run with --replace to overwrite.') +
      '\n  Review them at /studio\n',
  )
}

main().catch((error) => {
  console.error('\n  Seed failed:', error.message)
  if (error.statusCode === 401 || error.statusCode === 403) {
    console.error('  The token was rejected — it needs Editor permissions on this dataset.\n')
  }
  process.exit(1)
})
