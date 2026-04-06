/**
 * Verwerkt het LR Revisie logo:
 *  - Witte achtergrond → transparant
 *  - Donkere tekst (navy/charcoal) → wit  (zichtbaar op donkere achtergrond)
 *  - Groen vlak → blijft groen
 *
 * Bron: /Users/joost/Downloads/LR_Logo.webp  (of download van site als fallback)
 * Uitvoer: public/logo.png
 *
 * Usage: node scripts/remove-logo-bg.mjs
 */

import sharp from 'sharp'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT  = join(__dir, '..')
const OUT   = join(ROOT, 'public', 'logo.png')

// Gebruik lokaal bestand als het bestaat, anders download
const LOCAL = '/Users/joost/Downloads/LR_Logo.webp'
let buf
if (existsSync(LOCAL)) {
  console.log('Using local file:', LOCAL)
  buf = readFileSync(LOCAL)
} else {
  console.log('Downloading logo from lr-revisie.nl...')
  const res = await fetch('https://lr-revisie.nl/wp-content/uploads/2023/04/LR_Logo.jpg')
  buf = Buffer.from(await res.arrayBuffer())
}

const img = sharp(buf)
const { width, height } = await img.metadata()
console.log(`Logo: ${width}×${height}`)

const { data, info } = await img
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const px = new Uint8Array(data)

for (let i = 0; i < px.length; i += 4) {
  const r = px[i], g = px[i + 1], b = px[i + 2]
  const brightness = (r + g + b) / 3
  const spread     = Math.max(r, g, b) - Math.min(r, g, b)

  // ── 1. Witte / bijna-witte achtergrond → transparant ───────────────────
  if (r > 230 && g > 230 && b > 230) {
    px[i + 3] = 0
    continue
  }

  // ── 2. Anti-aliasing rand (lichtgrijs, weinig kleur) → semi-transparant ─
  if (brightness > 180 && spread < 25) {
    px[i + 3] = Math.round(255 * (1 - (brightness - 180) / 75))
    continue
  }

  // ── 3. Groen vlak (G dominant) → behoud als groen ──────────────────────
  const isGreen = g > r * 1.2 && g > b * 1.2 && g > 80
  if (isGreen) continue   // behoud originele pixel

  // ── 4. Donkere tekst (navy/charcoal, niet groen) → wit ─────────────────
  if (brightness < 140) {
    px[i]     = 255   // R → wit
    px[i + 1] = 255   // G → wit
    px[i + 2] = 255   // B → wit
    px[i + 3] = 255   // volledig opaque
  }
}

await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT)

console.log('✓ Saved to public/logo.png')
