/**
 * Scrapes lr-revisie.nl sitemap and imports all products + categories into Sanity.
 *
 * Usage:
 *   node scripts/import-products.mjs
 *
 * ~531 products from 3 sitemap files. Expect ~25-30 minutes.
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { randomBytes } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ─── Config ───────────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..')

let token = process.env.SANITY_API_TOKEN
if (!token) {
  const envPath = join(ROOT, '.env.local')
  if (existsSync(envPath)) {
    const env = readFileSync(envPath, 'utf8')
    const match = env.match(/^SANITY_API_TOKEN=(.+)$/m)
    if (match) token = match[1].trim()
  }
}
if (!token) throw new Error('SANITY_API_TOKEN not found in .env.local')

const PROJECT_ID = '1ohluaob'
const DATASET = 'production'
const BASE_URL = 'https://lr-revisie.nl'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── Category definitions ─────────────────────────────────────────────────────

const CATEGORIES = [
  {
    slug: 'gereviseerde-versnellingsbakken',
    naam: 'Gereviseerde Versnellingsbakken',
    naamEn: 'Reconditioned Gearboxes',
    beschrijving: 'Volledig gereviseerde versnellingsbakken voor Land Rover en Range Rover.',
    beschrijvingEn: 'Fully reconditioned gearboxes for Land Rover and Range Rover.',
    volgorde: 1,
  },
  {
    slug: 'gereviseerde-tussenbakken',
    naam: 'Gereviseerde Tussenbakken',
    naamEn: 'Reconditioned Transfer Cases',
    beschrijving: 'Volledig gereviseerde tussenbakken voor Land Rover en Range Rover.',
    beschrijvingEn: 'Fully reconditioned transfer cases for Land Rover and Range Rover.',
    volgorde: 2,
  },
  {
    slug: 'gereviseerde-differentielen',
    naam: 'Gereviseerde Differentielen',
    naamEn: 'Reconditioned Differentials',
    beschrijving: 'Volledig gereviseerde differentielen voor Land Rover en Range Rover.',
    beschrijvingEn: 'Fully reconditioned differentials for Land Rover and Range Rover.',
    volgorde: 3,
  },
  {
    slug: 'gereviseerde-stuurhuizen',
    naam: 'Gereviseerde Stuurhuizen',
    naamEn: 'Reconditioned Steering Boxes',
    beschrijving: 'Volledig gereviseerde stuurhuizen voor Land Rover en Range Rover.',
    beschrijvingEn: 'Fully reconditioned steering boxes for Land Rover and Range Rover.',
    volgorde: 4,
  },
  {
    slug: 'gereviseerde-cilinderkoppen',
    naam: 'Gereviseerde Cilinderkoppen',
    naamEn: 'Reconditioned Cylinder Heads',
    beschrijving: 'Volledig gereviseerde cilinderkoppen voor Land Rover en Range Rover.',
    beschrijvingEn: 'Fully reconditioned cylinder heads for Land Rover and Range Rover.',
    volgorde: 5,
  },
  {
    slug: 'onderdelen',
    naam: 'Onderdelen',
    naamEn: 'Parts',
    beschrijving: 'Losse onderdelen voor Land Rover versnellingsbakken, tussenbakken en differentielen.',
    beschrijvingEn: 'Spare parts for Land Rover gearboxes, transfer cases and differentials.',
    volgorde: 6,
  },
  {
    slug: 'sper-en-lock-differentielen',
    naam: 'Sper & Lock Differentielen',
    naamEn: 'LSD & Locker Differentials',
    beschrijving: 'ARB, Detroit, Fairey en andere sper- en lockdifferentielen voor Land Rover.',
    beschrijvingEn: 'ARB, Detroit, Fairey and other LSD & locker differentials for Land Rover.',
    volgorde: 7,
  },
  {
    slug: 'accessoires-en-overigen',
    naam: 'Accessoires & Overigen',
    naamEn: 'Accessories & Other',
    beschrijving: 'Accessoires en overige producten voor Land Rover.',
    beschrijvingEn: 'Accessories and other products for Land Rover.',
    volgorde: 8,
  },
]

// Maps WooCommerce category path segments → our Sanity category slugs
const CATEGORY_MAP = {
  'gereviseerde-versnellingsbakken': 'gereviseerde-versnellingsbakken',
  'gereviseerde-tussenbakken': 'gereviseerde-tussenbakken',
  'gereviseerde-differentielen': 'gereviseerde-differentielen',
  'gereviseerde-stuurhuizen': 'gereviseerde-stuurhuizen',
  'gereviseerde-cilinderkoppen': 'gereviseerde-cilinderkoppen',
  'onderdelen': 'onderdelen',
  'lt76-parts': 'onderdelen',
  'lt77-parts': 'onderdelen',
  'lt85-parts': 'onderdelen',
  'lt95-parts': 'onderdelen',
  'lt230-parts': 'onderdelen',
  'r380-parts': 'onderdelen',
  'mt82-parts': 'onderdelen',
  'zf-automaat-parts': 'onderdelen',
  'fairey-overdrive-parts': 'onderdelen',
  'koenig-pto-model-61': 'onderdelen',
  'adwest-3-bolt-heavyweight': 'onderdelen',
  'adwest-4-bolt-lightweight': 'onderdelen',
  'borg-warner-parts': 'onderdelen',
  'sper-en-lock-differentielen': 'sper-en-lock-differentielen',
  'arb-air-lockers': 'sper-en-lock-differentielen',
  'detroit-atb-differentieel': 'sper-en-lock-differentielen',
  'detroit-lockers': 'sper-en-lock-differentielen',
  'accessoires': 'sper-en-lock-differentielen', // sper subcategory
  'accessoires-en-overigen': 'accessoires-en-overigen',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function key() {
  return randomBytes(8).toString('hex')
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchText(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml',
        },
        signal: AbortSignal.timeout(20000),
      })
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.text()
    } catch (e) {
      if (i === retries - 1) throw e
      await sleep(1500 * (i + 1))
    }
  }
}

function extractJsonLd(html) {
  const results = []
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    try {
      results.push(JSON.parse(m[1].trim()))
    } catch {}
  }
  return results
}

function findProductSchema(jsonLds) {
  for (const j of jsonLds) {
    if (j['@type'] === 'Product') return j
    if (j['@graph']) {
      const p = j['@graph'].find((g) => g['@type'] === 'Product')
      if (p) return p
    }
  }
  return null
}

function extractCategorySlug(html) {
  // Look for the active category in the nav: class contains "current-product-ancestor" or "current-product-parent"
  // href="https://lr-revisie.nl/product-category/onderdelen/lt76-parts/"
  const re = /current-product-(?:ancestor|parent)[^>]*[\s\S]*?href="https:\/\/lr-revisie\.nl\/product-category\/([^"]+)\/"/g
  const slugs = []
  let m
  while ((m = re.exec(html)) !== null) {
    // Take the last path segment
    const parts = m[1].split('/').filter(Boolean)
    if (parts.length > 0) slugs.push(parts[parts.length - 1])
  }

  // Try the most specific subcategory first, then fall back to parent
  for (const slug of slugs.reverse()) {
    if (CATEGORY_MAP[slug]) return CATEGORY_MAP[slug]
  }

  // Fallback: look in URL breadcrumbs / og:url
  const breadRe = /href="https:\/\/lr-revisie\.nl\/product-category\/([^"]+)\/"/g
  while ((m = breadRe.exec(html)) !== null) {
    const parts = m[1].split('/').filter(Boolean)
    for (const part of parts.reverse()) {
      if (CATEGORY_MAP[part]) return CATEGORY_MAP[part]
    }
  }

  return 'onderdelen' // sensible default
}

function textToPortableText(text) {
  if (!text) return []
  const clean = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8203;/g, '')
    .trim()

  return clean
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => ({
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: key(), text: p, marks: [] }],
    }))
}

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function uploadImageFromUrl(imageUrl, filename) {
  try {
    const res = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 500) return null
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: res.headers.get('content-type') || 'image/jpeg',
    })
    return asset._id
  } catch (e) {
    console.warn(`    ⚠ image: ${e.message}`)
    return null
  }
}

// ─── Sitemap discovery ────────────────────────────────────────────────────────

async function getAllProductUrlsFromSitemap() {
  const urls = []

  // Get sitemap index
  const index = await fetchText(`${BASE_URL}/sitemap_index.xml`)
  if (!index) throw new Error('Cannot fetch sitemap index')

  const sitemapFiles = [...index.matchAll(/(product-sitemap\d+\.xml)/g)].map((m) => m[1])
  console.log(`  Found ${sitemapFiles.length} product sitemap files`)

  for (const file of sitemapFiles) {
    const xml = await fetchText(`${BASE_URL}/${file}`)
    if (!xml) continue
    const matches = [...xml.matchAll(/<loc>(https:\/\/lr-revisie\.nl\/product\/[^<]+)<\/loc>/g)]
    const fileUrls = matches.map((m) => m[1].trim())
    console.log(`  ${file}: ${fileUrls.length} products`)
    urls.push(...fileUrls)
    await sleep(300)
  }

  // Deduplicate
  return [...new Set(urls)]
}

// ─── Product scraping ─────────────────────────────────────────────────────────

async function scrapeProduct(url) {
  const html = await fetchText(url)
  if (!html) return null

  const jsonLds = extractJsonLd(html)
  const schema = findProductSchema(jsonLds)
  if (!schema) return null

  const naam = (schema.name || '').trim()
  if (!naam) return null

  const artikelnummer = (schema.sku || schema.mpn || '').trim() || toSlug(naam)

  const offers = Array.isArray(schema.offers) ? schema.offers[0] : schema.offers
  const priceFloat = offers ? parseFloat(offers.price) : 0
  const prijs = isNaN(priceFloat) ? 0 : Math.round(priceFloat * 100)
  const inVoorraad = offers?.availability ? !offers.availability.includes('OutOfStock') : true

  // Images — strip WP thumbnail suffixes to get the original
  const rawImages = Array.isArray(schema.image)
    ? schema.image
    : schema.image
    ? [schema.image]
    : []
  const imageUrls = rawImages
    .map((i) => (typeof i === 'string' ? i : i.url || i['@id'] || ''))
    .filter(Boolean)
    .map((u) => u.replace(/-\d{2,4}x\d{2,4}(\.\w+)$/, '$1'))
    .filter((v, i, a) => a.indexOf(v) === i)

  const beschrijvingRaw = schema.description || ''

  const seoTitle =
    html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/\s*[-|]\s*LR\s*Revisie.*$/i, '').trim() || naam
  const seoDescription = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || ''

  // Spec table
  const specs = []
  const seen = new Set()
  const trRe = /<tr[^>]*>[\s\S]*?<th[^>]*>([\s\S]*?)<\/th>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi
  let m
  while ((m = trRe.exec(html)) !== null) {
    const label = m[1].replace(/<[^>]+>/g, '').trim()
    const waarde = m[2].replace(/<[^>]+>/g, '').trim()
    const k = label.toLowerCase()
    if (label && waarde && label.length < 80 && !seen.has(k)) {
      seen.add(k)
      specs.push({ _type: 'object', _key: key(), label, waarde })
    }
  }

  const categorySanitySlug = extractCategorySlug(html)

  return {
    naam,
    artikelnummer,
    prijs,
    inVoorraad,
    imageUrls,
    beschrijvingRaw,
    seoTitle,
    seoDescription,
    specs,
    categorySanitySlug,
  }
}

// ─── Sanity import ────────────────────────────────────────────────────────────

async function upsertCategory(cat) {
  const docId = `category-${cat.slug}`
  const existing = await client.fetch(`*[_type == "category" && slug.current == $slug][0]._id`, {
    slug: cat.slug,
  })
  if (existing) {
    console.log(`  ✓ exists: ${cat.naam}`)
    return existing
  }
  await client.createOrReplace({
    _id: docId,
    _type: 'category',
    naam: cat.naam,
    naamEn: cat.naamEn,
    slug: { _type: 'slug', current: cat.slug },
    beschrijving: cat.beschrijving,
    beschrijvingEn: cat.beschrijvingEn,
    volgorde: cat.volgorde,
  })
  console.log(`  ✓ created: ${cat.naam}`)
  return docId
}

async function importProduct(data, categoryId) {
  if (!data?.naam) return false

  const slug = toSlug(data.naam)
  const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]._id`, { slug })
  if (existing) return 'skip'

  // Upload images (max 3)
  const afbeeldingen = []
  for (const imgUrl of data.imageUrls.slice(0, 3)) {
    const filename = imgUrl.split('/').pop() || 'product.jpg'
    const assetId = await uploadImageFromUrl(imgUrl, filename)
    if (assetId) {
      afbeeldingen.push({
        _type: 'image',
        _key: key(),
        asset: { _type: 'reference', _ref: assetId },
      })
    }
    await sleep(100)
  }

  await client.create({
    _type: 'product',
    naam: data.naam,
    slug: { _type: 'slug', current: slug },
    artikelnummer: data.artikelnummer,
    prijs: data.prijs,
    inVoorraad: data.inVoorraad,
    categorie: { _type: 'reference', _ref: categoryId },
    afbeeldingen,
    beschrijving: textToPortableText(data.beschrijvingRaw),
    specificaties: data.specs,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
  })
  return true
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 LR Revisie product import\n')

  // 1. Categories
  console.log('📂 Upsert categories...')
  const categoryIds = {}
  for (const cat of CATEGORIES) {
    categoryIds[cat.slug] = await upsertCategory(cat)
    await sleep(100)
  }
  console.log()

  // 2. Discover all product URLs via sitemap
  console.log('🗺  Loading sitemap...')
  const productUrls = await getAllProductUrlsFromSitemap()
  console.log(`   Total unique products: ${productUrls.length}\n`)

  // 3. Scrape + import
  let imported = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < productUrls.length; i++) {
    const url = productUrls[i]
    const num = `[${String(i + 1).padStart(3)}/${productUrls.length}]`

    try {
      const data = await scrapeProduct(url)
      if (!data) {
        console.log(`${num} ⚠ no schema — ${url.split('/').slice(-2, -1)[0]}`)
        failed++
      } else {
        const catId = categoryIds[data.categorySanitySlug]
        if (!catId) {
          console.log(`${num} ⚠ unknown category "${data.categorySanitySlug}" — ${data.naam}`)
          failed++
        } else {
          const result = await importProduct(data, catId)
          if (result === 'skip') {
            process.stdout.write(`${num} ↷ skip\r`)
            skipped++
          } else if (result === true) {
            console.log(`${num} ✓ [${data.categorySanitySlug}] ${data.naam} (€${(data.prijs / 100).toFixed(2)})`)
            imported++
          } else {
            failed++
          }
        }
      }
    } catch (e) {
      console.log(`${num} ✗ ${e.message} — ${url}`)
      failed++
    }

    await sleep(300)
  }

  console.log(`\n✅ Done!`)
  console.log(`   Imported: ${imported}`)
  console.log(`   Skipped:  ${skipped} (already existed)`)
  console.log(`   Failed:   ${failed}`)
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
