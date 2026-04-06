/**
 * Downloadt het LR Revisie logo en verwijdert de witte achtergrond.
 * Slaat op als /public/logo.png met transparantie.
 *
 * Usage: node scripts/remove-logo-bg.mjs
 */

import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..')
const OUT = join(ROOT, 'public', 'logo.png')

const LOGO_URL = 'https://lr-revisie.nl/wp-content/uploads/2023/04/LR_Logo.jpg'

console.log('Downloading logo...')
const res = await fetch(LOGO_URL)
const buf = Buffer.from(await res.arrayBuffer())

// Verwerk: wit (≥245,245,245) → transparant, rest behouden
const img = sharp(buf)
const { width, height, channels } = await img.metadata()
console.log(`Logo: ${width}×${height}, ${channels} channels`)

// Haal raw pixel data op (RGBA)
const { data, info } = await img
  .ensureAlpha()        // voeg alpha kanaal toe
  .raw()
  .toBuffer({ resolveWithObject: true })

const pixels = new Uint8Array(data)
const THRESHOLD = 240  // pixels met R,G,B > threshold → transparant
const TOLERANCE = 15   // kleurafwijking tolerantie

for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i]
  const g = pixels[i + 1]
  const b = pixels[i + 2]

  // Bijna-wit → transparant
  if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
    pixels[i + 3] = 0  // alpha = 0
    continue
  }

  // Bijna-wit met lichte tint (grijstinten rand) → semi-transparant
  const brightness = (r + g + b) / 3
  if (brightness > 200 && Math.max(r, g, b) - Math.min(r, g, b) < TOLERANCE) {
    // Anti-aliasing rand: fade op basis van brightness
    pixels[i + 3] = Math.round(255 * (1 - (brightness - 200) / 55))
  }
}

await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(OUT)

console.log(`✓ Saved to public/logo.png`)
