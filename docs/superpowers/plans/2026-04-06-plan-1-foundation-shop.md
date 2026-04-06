# LR Revisie Plan 1: Foundation + Shop

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bouw een volledig browsable, statisch gegenereerde Next.js webshop voor LR Revisie — inclusief Sanity CMS, design system, homepage, winkel, categorie- en productpagina's, zoeken, en i18n (NL + EN).

**Architecture:** Next.js 15 App Router met `[locale]` segment voor i18n (next-intl). Sanity v3 als CMS voor producten en content. Alle shop-pagina's statisch gegenereerd (SSG) via `generateStaticParams`. Tailwind CSS met custom design tokens. Geen checkout in dit plan — dat is Plan 2.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, Sanity v3, next-intl, Zustand (cart state), Lucide React, next/image, Vercel

---

## File Map

```
lr-revisie/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # Root layout met Nav + Footer
│   │   ├── page.tsx              # Homepage
│   │   ├── winkel/
│   │   │   ├── page.tsx          # Winkel overzicht
│   │   │   └── [categorie]/
│   │   │       ├── page.tsx      # Categoriepagina
│   │   │       └── [product]/
│   │   │           └── page.tsx  # Productpagina
│   │   └── zoeken/
│   │       └── page.tsx          # Zoekresultaten
│   └── api/
│       └── search/
│           └── route.ts          # Zoek API (Sanity GROQ)
├── components/
│   ├── layout/
│   │   ├── Nav.tsx               # Sticky nav, transparant over hero
│   │   ├── NavSearch.tsx         # Zoekbalk in nav met dropdown
│   │   └── Footer.tsx            # 4-koloms footer
│   ├── shop/
│   │   ├── ProductCard.tsx       # Productkaart in grid
│   │   ├── CategoryCard.tsx      # Categoriekaart homepage + winkel
│   │   ├── ProductGallery.tsx    # Foto gallery + lightbox product detail
│   │   ├── ProductTabs.tsx       # Beschrijving / Specs / Compatibiliteit tabs
│   │   └── CategoryFilters.tsx   # Sidebar filters (prijs, beschikbaarheid)
│   ├── home/
│   │   ├── HeroSection.tsx       # Video hero + overlay + content
│   │   ├── UspBar.tsx            # 4 USP items balk
│   │   └── AboutSection.tsx      # Over ons met eigenaarsfoto + stats
│   └── ui/
│       ├── Button.tsx            # Primary / Ghost / Outline varianten
│       └── Badge.tsx             # Status badges (op voorraad, etc.)
├── lib/
│   ├── sanity/
│   │   ├── client.ts             # Sanity client (server + browser)
│   │   ├── image.ts              # urlFor helper
│   │   └── queries.ts            # Alle GROQ queries
│   ├── cart.ts                   # Zustand cart store
│   └── utils.ts                  # formatPrice, cn helper
├── sanity/
│   ├── sanity.config.ts          # Sanity Studio config
│   └── schemas/
│       ├── index.ts              # Schema bundel
│       ├── product.ts            # Product schema
│       ├── category.ts           # Categorie schema
│       ├── guide.ts              # Technische gids schema
│       └── settings.ts           # Site-instellingen singleton
├── messages/
│   ├── nl.json                   # NL vertalingen
│   └── en.json                   # EN vertalingen
├── i18n.ts                       # next-intl config
├── middleware.ts                  # i18n routing middleware
└── tailwind.config.ts            # Design tokens
```

---

## Task 1: Project initialiseren

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- Create: `.env.local.example`

- [ ] **Stap 1.1: Next.js project aanmaken**

```bash
cd "/Users/joost/Desktop/development/lr revisie"
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-eslint
```

- [ ] **Stap 1.2: Dependencies installeren**

```bash
npm install \
  next-intl \
  @sanity/client \
  @sanity/image-url \
  sanity \
  lucide-react \
  zustand \
  clsx \
  tailwind-merge \
  @portabletext/react \
  @radix-ui/react-slot

npm install -D vitest @vitest/ui
```

- [ ] **Stap 1.3: `.env.local` aanmaken**

```bash
cp .env.local.example .env.local
```

Inhoud van `.env.local.example`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Stap 1.4: `next.config.ts` instellen**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'lr-revisie.nl' }, // tijdelijk voor migratie
    ],
  },
  async redirects() {
    return [
      // Statische redirects — product-redirects komen later via migratie
      { source: '/over-landrover-revisie', destination: '/nl/over-ons', permanent: true },
      { source: '/veel-gestelde-vragen', destination: '/nl/faq', permanent: true },
      { source: '/privacybeleid', destination: '/nl/privacy', permanent: true },
      { source: '/versnellingsbak-identificatie', destination: '/nl/gidsen/versnellingsbak-identificatie', permanent: true },
      { source: '/overzicht-van-versnellingsbakken', destination: '/nl/gidsen/overzicht-versnellingsbakken', permanent: true },
      { source: '/rover-v8-motor-nummers', destination: '/nl/gidsen/rover-v8-motor-nummers', permanent: true },
    ]
  },
}

export default nextConfig
```

- [ ] **Stap 1.5: Commit**

```bash
git add -A
git commit -m "feat: init Next.js 15 project met TypeScript + Tailwind"
```

---

## Task 2: Design system tokens

**Files:**
- Modify: `tailwind.config.ts`
- Create: `app/globals.css`

- [ ] **Stap 2.1: Tailwind config schrijven**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:  '#030A05',
          card:     '#060F08',
          elevated: '#091409',
          green:    '#003D1F',
          'deep-green': '#002B16',
        },
        brand: {
          primary: '#005B2F',
          accent:  '#00A652',
          dark:    '#003D1F',
        },
        border: {
          DEFAULT: 'rgba(0,91,47,0.25)',
          hover:   'rgba(0,166,82,0.4)',
          subtle:  'rgba(255,255,255,0.06)',
        },
        text: {
          primary: '#FFFFFF',
          muted:   'rgba(255,255,255,0.5)',
          subtle:  'rgba(255,255,255,0.25)',
          accent:  '#00A652',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        full: '9999px', // alleen voor pills/badges
      },
    },
  },
}

export default config
```

- [ ] **Stap 2.2: `app/globals.css` schrijven**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { border-radius: 0 !important; }
  body {
    background-color: #030A05;
    color: #ffffff;
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
}

@layer utilities {
  .accent-line-left {
    border-left: 2px solid #00A652;
  }
  .accent-line-top::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: #00A652;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s;
  }
  .accent-line-top:hover::before {
    transform: scaleX(1);
  }
}
```

- [ ] **Stap 2.3: `lib/utils.ts` schrijven**

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, locale = 'nl-NL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

// Prijzen worden in de DB opgeslagen als integers (centen)
// €24,95 = 2495
```

- [ ] **Stap 2.4: Test `formatPrice`**

```typescript
// lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice } from '../utils'

describe('formatPrice', () => {
  it('formats cents to euro string', () => {
    expect(formatPrice(2495)).toBe('€ 24,95')
  })
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('€ 0,00')
  })
  it('handles large amounts', () => {
    expect(formatPrice(125000)).toBe('€ 1.250,00')
  })
})
```

```bash
# Vitest installeren en runnen
npm install -D vitest @vitest/ui
npx vitest run lib/__tests__/utils.test.ts
```

Verwacht: 3 tests PASS

- [ ] **Stap 2.5: Commit**

```bash
git add -A
git commit -m "feat: design system tokens + utils"
```

---

## Task 3: i18n setup (next-intl)

**Files:**
- Create: `i18n.ts`, `middleware.ts`
- Create: `messages/nl.json`, `messages/en.json`
- Create: `app/[locale]/layout.tsx`

- [ ] **Stap 3.1: `i18n.ts` schrijven**

```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))
```

- [ ] **Stap 3.2: `middleware.ts` schrijven**

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['nl', 'en'],
  defaultLocale: 'nl',
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Stap 3.3: NL vertalingen aanmaken**

```json
// messages/nl.json
{
  "nav": {
    "shop": "Winkel",
    "guides": "Gidsen",
    "about": "Over ons",
    "contact": "Contact",
    "search": "Zoek op artikelnummer...",
    "cart": "Winkelwagen"
  },
  "hero": {
    "eyebrow": "Land Rover & Range Rover Specialist",
    "headline": "Revisie-onderdelen. Vakkundig.",
    "subtext": "Versnellingsbakken, tussenbakken, differentielen en stuurhuizen. Meer dan 418 onderdelen direct leverbaar.",
    "cta_shop": "Bekijk de winkel",
    "cta_guides": "Technische gidsen"
  },
  "usp": {
    "shipping_title": "Gratis verzending",
    "shipping_sub": "Vanaf €75,- in NL & BE",
    "delivery_title": "Snelle levering",
    "delivery_sub": "1–3 werkdagen",
    "expertise_title": "30+ jaar expertise",
    "expertise_sub": "Vakkundige revisie",
    "payment_title": "iDEAL & Bancontact",
    "payment_sub": "Veilig betalen via Mollie"
  },
  "shop": {
    "title": "Winkel",
    "all_categories": "Alle categorieën",
    "products": "producten",
    "add_to_cart": "In winkelwagen",
    "in_stock": "Op voorraad",
    "out_of_stock": "Niet op voorraad",
    "sort_price_asc": "Prijs laag–hoog",
    "sort_price_desc": "Prijs hoog–laag",
    "sort_name": "Naam A–Z"
  },
  "product": {
    "tab_description": "Beschrijving",
    "tab_specs": "Specificaties",
    "tab_compat": "Compatibiliteit",
    "article_number": "Artikelnummer",
    "related": "Gerelateerde producten"
  },
  "footer": {
    "tagline": "Betrouwbare en vakkundige revisie van tussenbakken, versnellingsbakken en onderdelen voor Land Rover en Range Rover.",
    "shop": "Winkel",
    "info": "Info",
    "service": "Klantenservice",
    "copyright": "© 2025 LR Revisie — Land Rover & Range Rover Specialist"
  }
}
```

- [ ] **Stap 3.4: EN vertalingen aanmaken**

```json
// messages/en.json
{
  "nav": {
    "shop": "Shop",
    "guides": "Guides",
    "about": "About",
    "contact": "Contact",
    "search": "Search by part number...",
    "cart": "Cart"
  },
  "hero": {
    "eyebrow": "Land Rover & Range Rover Specialist",
    "headline": "Revision parts. Expert quality.",
    "subtext": "Gearboxes, transfer cases, differentials and steering boxes. Over 418 parts in stock for immediate delivery.",
    "cta_shop": "Browse the shop",
    "cta_guides": "Technical guides"
  },
  "usp": {
    "shipping_title": "Free shipping",
    "shipping_sub": "From €75,- in NL & BE",
    "delivery_title": "Fast delivery",
    "delivery_sub": "1–3 working days",
    "expertise_title": "30+ years expertise",
    "expertise_sub": "Expert revision",
    "payment_title": "iDEAL & Bancontact",
    "payment_sub": "Secure payment via Mollie"
  },
  "shop": {
    "title": "Shop",
    "all_categories": "All categories",
    "products": "products",
    "add_to_cart": "Add to cart",
    "in_stock": "In stock",
    "out_of_stock": "Out of stock",
    "sort_price_asc": "Price low–high",
    "sort_price_desc": "Price high–low",
    "sort_name": "Name A–Z"
  },
  "product": {
    "tab_description": "Description",
    "tab_specs": "Specifications",
    "tab_compat": "Compatibility",
    "article_number": "Article number",
    "related": "Related products"
  },
  "footer": {
    "tagline": "Reliable and expert revision of transfer cases, gearboxes and parts for Land Rover and Range Rover.",
    "shop": "Shop",
    "info": "Info",
    "service": "Customer service",
    "copyright": "© 2025 LR Revisie — Land Rover & Range Rover Specialist"
  }
}
```

- [ ] **Stap 3.5: Root `app/[locale]/layout.tsx` schrijven**

```typescript
// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '../globals.css'

const locales = ['nl', 'en']

export const metadata: Metadata = {
  title: { default: 'LR Revisie — Land Rover Specialist', template: '%s | LR Revisie' },
  description: 'Vakkundige revisie van versnellingsbakken, tussenbakken, differentielen en stuurhuizen voor Land Rover en Range Rover.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Stap 3.6: Smoke test — dev server starten**

```bash
npm run dev
```

Open http://localhost:3000 — verwacht: redirect naar http://localhost:3000/nl

- [ ] **Stap 3.7: Commit**

```bash
git add -A
git commit -m "feat: i18n setup met next-intl (NL + EN)"
```

---

## Task 4: Sanity v3 setup + schemas

**Files:**
- Create: `sanity/sanity.config.ts`
- Create: `sanity/schemas/category.ts`
- Create: `sanity/schemas/product.ts`
- Create: `sanity/schemas/guide.ts`
- Create: `sanity/schemas/settings.ts`
- Create: `sanity/schemas/index.ts`
- Create: `lib/sanity/client.ts`
- Create: `lib/sanity/image.ts`
- Create: `lib/sanity/queries.ts`

- [ ] **Stap 4.1: Sanity project aanmaken**

```bash
npx sanity@latest init --env .env.local
```

Kies: bestaand project OF nieuw project aanmaken.
Selecteer dataset: `production`

Vul in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<jouw-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<token-met-editor-rechten>
```

- [ ] **Stap 4.2: Sanity Studio config**

```typescript
// sanity/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemas } from './schemas'

export default defineConfig({
  name: 'lr-revisie',
  title: 'LR Revisie',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemas },
})
```

- [ ] **Stap 4.3: Categorie schema**

```typescript
// sanity/schemas/category.ts
import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categorie',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam (NL)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'naamEn', title: 'Naam (EN)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'naam' }, validation: r => r.required() }),
    defineField({ name: 'beschrijving', title: 'Beschrijving (NL)', type: 'text' }),
    defineField({ name: 'beschrijvingEn', title: 'Beschrijving (EN)', type: 'text' }),
    defineField({ name: 'afbeelding', title: 'Afbeelding', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'volgorde', title: 'Volgorde', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'naam', media: 'afbeelding' },
  },
})
```

- [ ] **Stap 4.4: Product schema**

```typescript
// sanity/schemas/product.ts
import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam (NL)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'naamEn', title: 'Naam (EN)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'naam' }, validation: r => r.required() }),
    defineField({ name: 'artikelnummer', title: 'Artikelnummer / OEM Code', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'prijs',
      title: 'Prijs (in centen, bijv. 2495 = €24,95)',
      type: 'number',
      validation: r => r.required().min(0),
    }),
    defineField({ name: 'saleProijs', title: 'Aanbiedingsprijs (centen)', type: 'number' }),
    defineField({
      name: 'categorie',
      title: 'Categorie',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: r => r.required(),
    }),
    defineField({ name: 'afbeeldingen', title: 'Afbeeldingen', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'beschrijving', title: 'Beschrijving (NL)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'beschrijvingEn', title: 'Beschrijving (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'specificaties',
      title: 'Specificaties',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'waarde', type: 'string', title: 'Waarde' },
          ],
        },
      ],
    }),
    defineField({
      name: 'compatibiliteit',
      title: 'Compatibele voertuigen',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bijv. "Land Rover Defender 90/110 (1983-2006)"',
    }),
    defineField({ name: 'inVoorraad', title: 'Op voorraad', type: 'boolean', initialValue: true }),
    defineField({ name: 'seoTitle', title: 'SEO Titel', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Beschrijving', type: 'text' }),
    defineField({
      name: 'gerelateerdeProducten',
      title: 'Gerelateerde producten',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
  ],
  preview: {
    select: { title: 'naam', subtitle: 'artikelnummer', media: 'afbeeldingen.0' },
  },
})
```

- [ ] **Stap 4.5: Gids schema**

```typescript
// sanity/schemas/guide.ts
import { defineType, defineField } from 'sanity'

export const guide = defineType({
  name: 'guide',
  title: 'Technische Gids',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel (NL)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titelEn', title: 'Titel (EN)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'titel' }, validation: r => r.required() }),
    defineField({ name: 'seoDescription', title: 'SEO Beschrijving', type: 'text' }),
    defineField({ name: 'inhoud', title: 'Inhoud (NL)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'inhoudEn', title: 'Inhoud (EN)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({
      name: 'relatedProducts',
      title: 'Gerelateerde producten',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({ name: 'gepubliceerdOp', title: 'Gepubliceerd op', type: 'datetime' }),
  ],
})
```

- [ ] **Stap 4.6: Settings schema (singleton)**

```typescript
// sanity/schemas/settings.ts
import { defineType, defineField } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site-instellingen',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'gratisverzendingVanaf', title: 'Gratis verzending vanaf (centen)', type: 'number', initialValue: 7500 }),
    defineField({ name: 'verzendkostenNL', title: 'Verzendkosten NL (centen)', type: 'number', initialValue: 695 }),
    defineField({ name: 'verzendkostenBE', title: 'Verzendkosten BE (centen)', type: 'number', initialValue: 995 }),
    defineField({ name: 'eigenaarFoto', title: 'Foto eigenaar', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'eigenaarNaam', title: 'Naam eigenaar', type: 'string' }),
    defineField({ name: 'eigenaarBio', title: 'Bio eigenaar (NL)', type: 'text' }),
  ],
})
```

- [ ] **Stap 4.7: Schema bundel**

```typescript
// sanity/schemas/index.ts
import { category } from './category'
import { product } from './product'
import { guide } from './guide'
import { settings } from './settings'

export const schemas = [category, product, guide, settings]
```

- [ ] **Stap 4.8: Sanity client**

```typescript
// lib/sanity/client.ts
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Server-side client met token (voor ISR revalidatie)
export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
```

- [ ] **Stap 4.9: Image URL helper**

```typescript
// lib/sanity/image.ts
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from './client'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

- [ ] **Stap 4.10: GROQ queries**

```typescript
// lib/sanity/queries.ts

// Categorieën
export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(volgorde asc) {
    _id, naam, naamEn, "slug": slug.current,
    beschrijving, beschrijvingEn, afbeelding,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`

// Producten per categorie
export const PRODUCTS_BY_CATEGORY_QUERY = `
  *[_type == "product" && categorie->slug.current == $categorie]
  | order(naam asc) {
    _id, naam, naamEn, artikelnummer,
    "slug": slug.current,
    "categorie": categorie->{ naam, "slug": slug.current },
    prijs, saleProijs, inVoorraad,
    "afbeelding": afbeeldingen[0]
  }
`

// Één product
export const PRODUCT_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    _id, naam, naamEn, artikelnummer,
    "slug": slug.current,
    "categorie": categorie->{ naam, naamEn, "slug": slug.current },
    prijs, saleProijs, inVoorraad,
    afbeeldingen, beschrijving, beschrijvingEn,
    specificaties, compatibiliteit,
    seoTitle, seoDescription,
    "gerelateerdeProducten": gerelateerdeProducten[]-> {
      _id, naam, artikelnummer, "slug": slug.current,
      prijs, inVoorraad, "afbeelding": afbeeldingen[0],
      "categorie": categorie->{ "slug": slug.current }
    }
  }
`

// Alle product slugs (voor generateStaticParams)
export const ALL_PRODUCT_SLUGS_QUERY = `
  *[_type == "product"] {
    "slug": slug.current,
    "categorie": categorie->slug.current
  }
`

// Alle categorie slugs
export const ALL_CATEGORY_SLUGS_QUERY = `
  *[_type == "category"] { "slug": slug.current }
`

// Settings
export const SETTINGS_QUERY = `*[_type == "settings"][0]`

// Zoeken
export const SEARCH_QUERY = `
  *[_type == "product" && (
    naam match $q + "*" ||
    artikelnummer match $q + "*" ||
    naamEn match $q + "*"
  )] | order(_score desc) [0...20] {
    _id, naam, artikelnummer,
    "slug": slug.current,
    prijs, inVoorraad,
    "afbeelding": afbeeldingen[0],
    "categorie": categorie->{ naam, "slug": slug.current }
  }
`
```

- [ ] **Stap 4.11: Sanity Studio draaien en schemas testen**

```bash
npx sanity dev
```

Open http://localhost:3333 — controleer dat alle schemas zichtbaar zijn: Categorie, Product, Technische Gids, Site-instellingen.

Voeg 2 testcategorieën en 3 testproducten in via Studio.

- [ ] **Stap 4.12: Commit**

```bash
git add -A
git commit -m "feat: Sanity v3 schemas + client + GROQ queries"
```

---

## Task 5: UI Primitives

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Badge.tsx`

- [ ] **Stap 5.1: Button component**

```typescript
// components/ui/Button.tsx
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-primary border-2 border-brand-accent text-white hover:bg-brand-accent font-bold tracking-wide',
  ghost:   'bg-transparent border-2 border-white/25 text-white/85 hover:border-white/50 font-bold tracking-wide',
  outline: 'bg-transparent border border-border text-text-muted hover:border-border-hover hover:text-white font-medium',
}

const sizes = {
  sm:  'px-4 py-2 text-xs',
  md:  'px-6 py-3 text-sm',
  lg:  'px-8 py-4 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Stap 5.2: Badge component**

```typescript
// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'neutral'
  className?: string
}

const variants = {
  success: 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent',
  warning: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400',
  error:   'bg-red-500/10 border border-red-500/30 text-red-400',
  neutral: 'bg-white/5 border border-white/10 text-text-muted',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
```

- [ ] **Stap 5.3: Commit**

```bash
git add -A
git commit -m "feat: Button + Badge UI primitives"
```

---

## Task 6: Nav + Footer

**Files:**
- Create: `components/layout/Nav.tsx`
- Create: `components/layout/NavSearch.tsx`
- Create: `components/layout/Footer.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Stap 6.1: Nav component schrijven**

```typescript
// components/layout/Nav.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { NavSearch } from './NavSearch'
import { useCartStore } from '@/lib/cart'

interface NavProps {
  locale: string
  transparent?: boolean
}

export function Nav({ locale, transparent = false }: NavProps) {
  const t = useTranslations('nav')
  const itemCount = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0))

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-10
        border-b border-white/5
        ${transparent
          ? 'bg-gradient-to-b from-black/70 to-transparent border-transparent'
          : 'bg-bg-primary/95 backdrop-blur-sm'}
        transition-all duration-300
      `}
    >
      {/* Logo */}
      <Link href={`/${locale}`}>
        <Image
          src="https://lr-revisie.nl/wp-content/uploads/2023/04/LR_Logo.jpg"
          alt="LR Revisie"
          width={120}
          height={37}
          className="h-9 w-auto object-contain"
          priority
        />
      </Link>

      {/* Links */}
      <div className="flex items-center gap-8">
        <Link href={`/${locale}/winkel`} className="text-text-muted hover:text-white text-sm font-medium transition-colors">{t('shop')}</Link>
        <Link href={`/${locale}/gidsen`} className="text-text-muted hover:text-white text-sm font-medium transition-colors">{t('guides')}</Link>
        <Link href={`/${locale}/over-ons`} className="text-text-muted hover:text-white text-sm font-medium transition-colors">{t('about')}</Link>
        <Link href={`/${locale}/contact`} className="text-text-muted hover:text-white text-sm font-medium transition-colors">{t('contact')}</Link>
      </div>

      {/* Rechts */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/40">
          <Link href={locale === 'nl' ? '/nl' : '/nl'} className={locale === 'nl' ? 'text-white font-semibold' : ''}>NL</Link>
          {' / '}
          <Link href={locale === 'en' ? '/en' : '/en'} className={locale === 'en' ? 'text-white font-semibold' : ''}>EN</Link>
        </span>
        <NavSearch locale={locale} />
        <Link
          href={`/${locale}/winkelwagen`}
          className="flex items-center gap-2 bg-brand-primary border border-brand-accent px-4 py-2 text-sm font-semibold hover:bg-brand-accent transition-colors"
        >
          <ShoppingCart size={16} />
          {itemCount > 0 ? itemCount : t('cart')}
        </Link>
      </div>
    </nav>
  )
}
```

- [ ] **Stap 6.2: NavSearch component**

```typescript
// components/layout/NavSearch.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  _id: string
  naam: string
  artikelnummer: string
  slug: string
  prijs: number
  afbeelding?: any
  categorie: { naam: string; slug: string }
}

export function NavSearch({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', down)
    return () => document.removeEventListener('mousedown', down)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
      setOpen(true)
    }, 250)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 bg-white/6 border border-white/10 px-3 py-2 min-w-[200px]">
        <Search size={14} className="text-white/40" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('search')}
          className="bg-transparent text-sm text-white placeholder-white/40 outline-none w-full"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 min-w-[320px] bg-bg-card border border-border z-50 shadow-xl">
          {results.map(r => (
            <Link
              key={r._id}
              href={`/${locale}/winkel/${r.categorie.slug}/${r.slug}`}
              onClick={() => { setOpen(false); setQuery('') }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors border-b border-border last:border-0"
            >
              {r.afbeelding && (
                <Image
                  src={urlFor(r.afbeelding).width(48).height(48).url()}
                  alt={r.naam}
                  width={48}
                  height={48}
                  className="object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{r.naam}</div>
                <div className="text-xs text-text-muted">{r.artikelnummer}</div>
              </div>
              <div className="text-sm font-bold text-brand-accent">{formatPrice(r.prijs)}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Stap 6.3: Search API route**

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity/client'
import { SEARCH_QUERY } from '@/lib/sanity/queries'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json([])
  const results = await sanityClient.fetch(SEARCH_QUERY, { q })
  return NextResponse.json(results)
}
```

- [ ] **Stap 6.4: Footer component**

```typescript
// components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'  // server component: getTranslations, niet useTranslations

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations('footer')

  return (
    <footer className="bg-[#010603] border-t border-brand-primary/20 pt-14 pb-7">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Image
              src="https://lr-revisie.nl/wp-content/uploads/2023/04/LR_Logo.jpg"
              alt="LR Revisie"
              width={100}
              height={31}
              className="h-7 w-auto object-contain mb-5 opacity-70"
            />
            <p className="text-sm text-text-subtle leading-relaxed max-w-[240px]">{t('tagline')}</p>
          </div>
          {/* Winkel */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-5">{t('shop')}</h4>
            {['gereviseerde-versnellingsbakken','gereviseerde-tussenbakken','gereviseerde-differentielen','gereviseerde-stuurhuizen','onderdelen'].map(cat => (
              <Link key={cat} href={`/${locale}/winkel/${cat}`} className="block text-sm text-text-muted hover:text-white mb-2.5 capitalize transition-colors">
                {cat.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
          {/* Info */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-5">{t('info')}</h4>
            <Link href={`/${locale}/over-ons`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Over ons</Link>
            <Link href={`/${locale}/gidsen`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Gidsen</Link>
            <Link href={`/${locale}/faq`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">FAQ</Link>
            <Link href={`/${locale}/contact`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Contact</Link>
          </div>
          {/* Service */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-5">{t('service')}</h4>
            <Link href={`/${locale}/verzending-retour`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Verzending & retour</Link>
            <Link href={`/${locale}/algemene-voorwaarden`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Algemene voorwaarden</Link>
            <Link href={`/${locale}/privacy`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Privacybeleid</Link>
            <Link href={`/${locale}/herroepingsrecht`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Herroepingsrecht</Link>
          </div>
        </div>
        {/* Bottom */}
        <div className="border-t border-white/4 pt-6 flex justify-between items-center">
          <p className="text-xs text-white/20">{t('copyright')}</p>
          <div className="flex gap-1.5">
            {['iDEAL','Bancontact','Mastercard','Visa'].map(m => (
              <span key={m} className="bg-white/5 border border-white/7 px-2.5 py-1 text-[11px] text-white/30 font-semibold">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Stap 6.5: Nav + Footer toevoegen aan layout**

```typescript
// app/[locale]/layout.tsx — update children sectie
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

// In de return:
return (
  <html lang={locale}>
    <body>
      <NextIntlClientProvider messages={messages}>
        <Nav locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </NextIntlClientProvider>
    </body>
  </html>
)
```

- [ ] **Stap 6.6: Commit**

```bash
git add -A
git commit -m "feat: Nav + NavSearch + Footer layout components"
```

---

## Task 7: Cart state (Zustand)

**Files:**
- Create: `lib/cart.ts`

- [ ] **Stap 7.1: Cart store schrijven**

```typescript
// lib/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string          // Sanity product _id
  naam: string
  artikelnummer: string
  slug: string
  categorie: string   // categorie slug
  prijs: number       // in centen
  afbeeldingUrl?: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set(state => {
        const existing = state.items.find(i => i.id === item.id)
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          }
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),

      removeItem: (id) => set(state => ({
        items: state.items.filter(i => i.id !== id)
      })),

      updateQuantity: (id, quantity) => set(state => ({
        items: quantity <= 0
          ? state.items.filter(i => i.id !== id)
          : state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.prijs * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'lr-revisie-cart' }
  )
)
```

- [ ] **Stap 7.2: Test cart store**

```typescript
// lib/__tests__/cart.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../cart'

const testItem = {
  id: 'prod-1',
  naam: 'Oil Seal',
  artikelnummer: 'FRC1780',
  slug: 'frc1780-oil-seal',
  categorie: 'onderdelen',
  prijs: 2495,
}

beforeEach(() => useCartStore.getState().clearCart())

describe('cart store', () => {
  it('adds an item', () => {
    useCartStore.getState().addItem(testItem)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('increments quantity for existing item', () => {
    useCartStore.getState().addItem(testItem)
    useCartStore.getState().addItem(testItem)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('removes an item', () => {
    useCartStore.getState().addItem(testItem)
    useCartStore.getState().removeItem('prod-1')
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('calculates total correctly', () => {
    useCartStore.getState().addItem(testItem)
    useCartStore.getState().updateQuantity('prod-1', 3)
    expect(useCartStore.getState().total()).toBe(7485) // 3 * 2495
  })
})
```

```bash
npx vitest run lib/__tests__/cart.test.ts
```

Verwacht: 4 tests PASS

- [ ] **Stap 7.3: Commit**

```bash
git add -A
git commit -m "feat: cart store met Zustand + persist"
```

---

## Task 8: Homepage

**Files:**
- Create: `components/home/HeroSection.tsx`
- Create: `components/home/UspBar.tsx`
- Create: `components/home/AboutSection.tsx`
- Create: `components/shop/CategoryCard.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Stap 8.1: HeroSection schrijven**

```typescript
// components/home/HeroSection.tsx
'use client'
import { ShoppingBag, BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero')

  return (
    <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
      {/* Video achtergrond — vervang src door echte Land Rover video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://lr-revisie.nl/wp-content/uploads/2023/01/FRC8382-scaled.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.3) saturate(0.6)' }}
      >
        {/* Video bestand aanleveren door eigenaar */}
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-black/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 via-transparent to-transparent pointer-events-none" />

      {/* Dikke accentlijn links */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent z-10" />

      {/* Content */}
      <div className="relative z-10 pb-20 pl-20 max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-0.5 bg-brand-accent" />
          <span className="text-xs font-bold tracking-[3px] uppercase text-brand-accent">
            {t('eyebrow')}
          </span>
        </div>
        <h1 className="text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-[-2px] text-white mb-5">
          {t('headline')}
        </h1>
        <p className="text-base leading-[1.75] text-text-muted mb-9 max-w-[480px]">
          {t('subtext')}
        </p>
        <div className="flex gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link href={`/${locale}/winkel`}>
              <ShoppingBag size={16} />
              {t('cta_shop')}
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <Link href={`/${locale}/gidsen`}>
              <BookOpen size={16} />
              {t('cta_guides')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats rechtsonder IN de hero */}
      <div className="absolute bottom-0 right-0 flex z-10">
        {[
          { num: '418', label: 'Onderdelen' },
          { num: '30+', label: 'Jaar ervaring' },
          { num: 'NL & BE', label: 'Levering' },
        ].map(s => (
          <div
            key={s.num}
            className="bg-bg-primary/85 backdrop-blur-sm border-l border-t border-brand-primary/40 px-7 py-5 text-center"
          >
            <div className="text-2xl font-extrabold text-brand-accent leading-none">{s.num}</div>
            <div className="text-[10px] text-text-muted tracking-[1px] mt-1 uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-16 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-12 bg-gradient-to-b from-brand-accent/80 to-transparent animate-pulse" />
        <span className="text-[10px] tracking-[2px] uppercase text-white/30">Scroll</span>
      </div>
    </section>
  )
}
```

Noot: Button component heeft een `asChild` prop nodig voor Link wrapping. Voeg dit toe aan Button:
```typescript
// Voeg toe aan Button.tsx props:
import { Slot } from '@radix-ui/react-slot'
// npm install @radix-ui/react-slot
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  // ... rest
}
// In de component body:
const Comp = asChild ? Slot : 'button'
return <Comp className={cn(...)} {...props}>{children}</Comp>
```

- [ ] **Stap 8.2: UspBar component**

```typescript
// components/home/UspBar.tsx
import { Truck, Zap, Wrench, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function UspBar() {
  const t = useTranslations('usp')

  const items = [
    { icon: Truck,       title: t('shipping_title'),  sub: t('shipping_sub') },
    { icon: Zap,         title: t('delivery_title'),  sub: t('delivery_sub') },
    { icon: Wrench,      title: t('expertise_title'), sub: t('expertise_sub') },
    { icon: ShieldCheck, title: t('payment_title'),   sub: t('payment_sub') },
  ]

  return (
    <div className="bg-bg-green border-b border-brand-primary/30 grid grid-cols-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3.5 px-6 py-5 border-r border-white/5 last:border-r-0"
        >
          <item.icon size={20} className="text-brand-accent flex-shrink-0" />
          <div>
            <strong className="block text-sm font-semibold text-white">{item.title}</strong>
            <span className="text-xs text-text-muted">{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Stap 8.3: CategoryCard component**

```typescript
// components/shop/CategoryCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity/image'
import { cn } from '@/lib/utils'

interface CategoryCardProps {
  naam: string
  slug: string
  beschrijving?: string
  afbeelding?: any
  productCount: number
  featured?: boolean
  locale: string
}

export function CategoryCard({ naam, slug, beschrijving, afbeelding, productCount, featured, locale }: CategoryCardProps) {
  return (
    <Link
      href={`/${locale}/winkel/${slug}`}
      className={cn(
        'group relative flex flex-col gap-2.5 p-7 border border-brand-primary/20',
        'bg-bg-card hover:bg-bg-elevated hover:border-brand-accent/40',
        'transition-colors duration-200 accent-line-top',
        featured && 'col-span-2',
      )}
    >
      {afbeelding && (
        <div className="absolute inset-0 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity">
          <Image
            src={urlFor(afbeelding).width(600).url()}
            alt={naam}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h3 className="relative text-[15px] font-bold tracking-[-0.3px] text-white">{naam}</h3>
      {beschrijving && (
        <p className="relative text-xs text-text-muted leading-relaxed">{beschrijving}</p>
      )}
      <div className="relative mt-auto flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-xs font-semibold text-brand-accent/70">{productCount} producten</span>
        <ArrowRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
      </div>
    </Link>
  )
}
```

- [ ] **Stap 8.4: AboutSection met eigenaarsfoto**

```typescript
// components/home/AboutSection.tsx
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

interface AboutSectionProps {
  eigenaarNaam?: string
  eigenaarBio?: string
  eigenaarFoto?: any
}

export function AboutSection({ eigenaarNaam, eigenaarBio, eigenaarFoto }: AboutSectionProps) {
  return (
    <section className="bg-[#020806] py-20 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-20 items-center">
        {/* Tekst + stats */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Over ons</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-[-1px] mb-4">
            De Land Rover specialist in Nederland
          </h2>
          <p className="text-sm text-text-muted leading-[1.85] mb-9">
            {eigenaarBio || 'Al meer dan 30 jaar reviseren wij versnellingsbakken, tussenbakken, differentielen en stuurhuizen voor Land Rover en Range Rover voertuigen. Elk onderdeel wordt vakkundig gereviseerd en getest voordat het de deur uitgaat.'}
          </p>
          {/* Stats grid */}
          <div className="grid grid-cols-2 border border-brand-primary/20">
            {[
              { num: '30+', label: 'Jaar ervaring' },
              { num: '418', label: 'Op voorraad' },
              { num: 'NL & BE', label: 'Levering' },
              { num: '100%', label: 'Gereviseerd' },
            ].map(s => (
              <div key={s.num} className="p-6 border-r border-b border-brand-primary/20 last:border-r-0 [&:nth-child(2)]:border-r-0 [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0">
                <div className="text-4xl font-extrabold text-brand-accent tracking-[-1px]">{s.num}</div>
                <div className="text-[11px] text-text-muted tracking-[1px] mt-1 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Eigenaarsfoto + werkplaatsfotos */}
        <div className="grid grid-cols-2 gap-1">
          {eigenaarFoto && (
            <div className="col-span-2 relative aspect-[16/7] overflow-hidden bg-bg-card">
              <Image
                src={urlFor(eigenaarFoto).width(800).height(350).url()}
                alt={eigenaarNaam || 'Eigenaar LR Revisie'}
                fill
                className="object-cover object-top saturate-75"
              />
              {eigenaarNaam && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary/90 to-transparent px-6 py-4">
                  <span className="text-sm font-semibold text-white">{eigenaarNaam}</span>
                  <span className="text-xs text-text-muted ml-2">— Eigenaar LR Revisie</span>
                </div>
              )}
            </div>
          )}
          <div className="relative aspect-square overflow-hidden bg-bg-card">
            <Image src="https://lr-revisie.nl/wp-content/uploads/2023/01/UKC75L-scaled.jpg" alt="Onderdeel" fill className="object-cover saturate-75" />
          </div>
          <div className="relative aspect-square overflow-hidden bg-bg-card">
            <Image src="https://lr-revisie.nl/wp-content/uploads/2023/01/RTC2914-scaled.jpg" alt="Onderdeel" fill className="object-cover saturate-75" />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Stap 8.5: Homepage pagina assembleren**

```typescript
// app/[locale]/page.tsx
import { sanityClient } from '@/lib/sanity/client'
import { CATEGORIES_QUERY, SETTINGS_QUERY } from '@/lib/sanity/queries'
import { HeroSection } from '@/components/home/HeroSection'
import { UspBar } from '@/components/home/UspBar'
import { CategoryCard } from '@/components/shop/CategoryCard'
import { AboutSection } from '@/components/home/AboutSection'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const [categories, settings] = await Promise.all([
    sanityClient.fetch(CATEGORIES_QUERY),
    sanityClient.fetch(SETTINGS_QUERY),
  ])

  return (
    <>
      <HeroSection locale={locale} />
      <UspBar />

      {/* Categorieën */}
      <section className="bg-bg-primary py-20 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Productcategorieën</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-[-1px] mb-10">Wat zoek je?</h2>
          <div className="grid grid-cols-3 gap-0.5">
            {categories.map((cat: any, i: number) => (
              <CategoryCard
                key={cat._id}
                naam={locale === 'en' && cat.naamEn ? cat.naamEn : cat.naam}
                slug={cat.slug}
                beschrijving={locale === 'en' && cat.beschrijvingEn ? cat.beschrijvingEn : cat.beschrijving}
                afbeelding={cat.afbeelding}
                productCount={cat.productCount}
                featured={i === 0}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Zoekbalk */}
      <section className="bg-gradient-to-r from-bg-deep-green to-brand-primary py-14 px-10 border-t-2 border-brand-accent">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-16">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.5px] mb-1.5">Weet je het artikelnummer al?</h2>
            <p className="text-sm text-white/60">Zoek direct op OEM-nummer, naam of omschrijving</p>
          </div>
          <Link href={`/${locale}/zoeken`} className="flex flex-1 max-w-[520px] border-2 border-white/25 bg-black/20">
            <span className="flex-1 px-5 py-4 text-sm text-white/35">Bijv. FRC1780, RTC7158 of &apos;output shaft seal&apos;…</span>
            <span className="flex items-center gap-2 bg-bg-green border-l-2 border-white/25 px-6 py-4 text-sm font-bold tracking-wide">
              <Search size={16} />
              ZOEK
            </span>
          </Link>
        </div>
      </section>

      <AboutSection
        eigenaarNaam={settings?.eigenaarNaam}
        eigenaarBio={settings?.eigenaarBio}
        eigenaarFoto={settings?.eigenaarFoto}
      />
    </>
  )
}
```

- [ ] **Stap 8.6: Visual check**

```bash
npm run dev
```

Ga naar http://localhost:3000/nl — controleer:
- Hero toont met video poster + gradient overlay
- USP-balk direct onder hero
- Categorieën grid (leeg als nog geen data)
- Zoekbalk sectie
- About sectie (leeg eigenaarsfoto als niet ingesteld)

- [ ] **Stap 8.7: Commit**

```bash
git add -A
git commit -m "feat: homepage met hero, USP-balk, categorieën, zoekbalk, about sectie"
```

---

## Task 9: Winkel overzicht + categoriepagina

**Files:**
- Create: `app/[locale]/winkel/page.tsx`
- Create: `app/[locale]/winkel/[categorie]/page.tsx`
- Create: `components/shop/ProductCard.tsx`
- Create: `components/shop/CategoryFilters.tsx`

- [ ] **Stap 9.1: ProductCard component**

```typescript
// components/shop/ProductCard.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { urlFor } from '@/lib/sanity/image'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/lib/cart'

interface ProductCardProps {
  id: string
  naam: string
  artikelnummer: string
  slug: string
  categorie: { naam: string; slug: string }
  prijs: number
  saleProijs?: number
  inVoorraad: boolean
  afbeelding?: any
  locale: string
}

export function ProductCard({ id, naam, artikelnummer, slug, categorie, prijs, saleProijs, inVoorraad, afbeelding, locale }: ProductCardProps) {
  const t = useTranslations('shop')
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ id, naam, artikelnummer, slug, categorie: categorie.slug, prijs, afbeeldingUrl: afbeelding ? urlFor(afbeelding).width(200).url() : undefined })
  }

  return (
    <Link
      href={`/${locale}/winkel/${categorie.slug}/${slug}`}
      className="group flex flex-col border border-brand-primary/20 bg-bg-card hover:bg-bg-elevated hover:border-brand-accent/40 transition-colors accent-line-top"
    >
      {/* Afbeelding */}
      <div className="relative aspect-square bg-bg-primary overflow-hidden">
        {afbeelding ? (
          <Image
            src={urlFor(afbeelding).width(400).height(400).url()}
            alt={naam}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-subtle text-xs">Geen foto</div>
        )}
        {saleProijs && (
          <Badge variant="success" className="absolute top-2 left-2">Sale</Badge>
        )}
        {!inVoorraad && (
          <div className="absolute inset-0 bg-bg-primary/60 flex items-center justify-center">
            <Badge variant="neutral">{t('out_of_stock')}</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="text-xs text-text-subtle font-mono">{artikelnummer}</div>
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">{naam}</h3>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <span className="text-base font-bold text-brand-accent">{formatPrice(saleProijs ?? prijs)}</span>
            {saleProijs && (
              <span className="ml-2 text-xs text-text-subtle line-through">{formatPrice(prijs)}</span>
            )}
          </div>
          {inVoorraad && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-brand-primary border border-brand-accent px-3 py-1.5 text-xs font-bold hover:bg-brand-accent transition-colors"
            >
              <ShoppingCart size={12} />
              {t('add_to_cart')}
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Stap 9.2: Winkel overzicht pagina**

```typescript
// app/[locale]/winkel/page.tsx
import { sanityClient } from '@/lib/sanity/client'
import { CATEGORIES_QUERY } from '@/lib/sanity/queries'
import { CategoryCard } from '@/components/shop/CategoryCard'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function WinkelPage({ params }: PageProps) {
  const { locale } = await params
  const categories = await sanityClient.fetch(CATEGORIES_QUERY)

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-bg-green border-b border-brand-primary/30 px-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-brand-accent tracking-[2px] uppercase mb-2">
            <a href={`/${locale}`} className="hover:text-white">Home</a> / Winkel
          </div>
          <h1 className="text-4xl font-extrabold tracking-[-1px]">Winkel</h1>
          <p className="text-text-muted mt-2">418 onderdelen voor Land Rover en Range Rover</p>
        </div>
      </div>

      {/* Categorieën grid */}
      <div className="max-w-7xl mx-auto px-10 py-14">
        <div className="grid grid-cols-3 gap-0.5">
          {categories.map((cat: any, i: number) => (
            <CategoryCard
              key={cat._id}
              naam={locale === 'en' && cat.naamEn ? cat.naamEn : cat.naam}
              slug={cat.slug}
              beschrijving={locale === 'en' && cat.beschrijvingEn ? cat.beschrijvingEn : cat.beschrijving}
              afbeelding={cat.afbeelding}
              productCount={cat.productCount}
              featured={i === 0}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Stap 9.2b: SortSelect client component**

```typescript
// components/shop/SortSelect.tsx
'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function SortSelect({ current }: { current: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex justify-end mb-6">
      <select
        value={current}
        onChange={handleChange}
        className="bg-bg-card border border-border text-sm text-text-muted px-3 py-2 outline-none"
      >
        <option value="naam">Naam A–Z</option>
        <option value="prijs-asc">Prijs laag–hoog</option>
        <option value="prijs-desc">Prijs hoog–laag</option>
      </select>
    </div>
  )
}
```

En voeg import toe aan categoriepagina:
```typescript
import { SortSelect } from '@/components/shop/SortSelect'
```

- [ ] **Stap 9.3: Categoriepagina met productgrid**

```typescript
// app/[locale]/winkel/[categorie]/page.tsx
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { PRODUCTS_BY_CATEGORY_QUERY, ALL_CATEGORY_SLUGS_QUERY } from '@/lib/sanity/queries'
import { ProductCard } from '@/components/shop/ProductCard'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string; categorie: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(ALL_CATEGORY_SLUGS_QUERY)
  const locales = ['nl', 'en']
  return locales.flatMap((locale: string) =>
    slugs.map((s: { slug: string }) => ({ locale, categorie: s.slug }))
  )
}

export default async function CategoriePage({ params, searchParams }: PageProps) {
  const { locale, categorie } = await params
  const { sort = 'naam' } = await searchParams

  const products = await sanityClient.fetch(PRODUCTS_BY_CATEGORY_QUERY, { categorie })

  if (!products) notFound()

  // Client-side sortering
  const sorted = [...products].sort((a: any, b: any) => {
    if (sort === 'prijs-asc') return a.prijs - b.prijs
    if (sort === 'prijs-desc') return b.prijs - a.prijs
    return a.naam.localeCompare(b.naam)
  })

  const catNaam = products[0]?.categorie?.naam ?? categorie

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-bg-green border-b border-brand-primary/30 px-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-brand-accent tracking-[2px] uppercase mb-2">
            <a href={`/${locale}`}>Home</a> / <a href={`/${locale}/winkel`}>Winkel</a> / {catNaam}
          </div>
          <h1 className="text-4xl font-extrabold tracking-[-1px]">{catNaam}</h1>
          <p className="text-text-muted mt-2">{products.length} producten</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-10">
        {/* Sortering — client component want window nodig */}
        <SortSelect current={sort} />

        {/* Productgrid */}
        <div className="grid grid-cols-4 gap-0.5">
          {sorted.map((product: any) => (
            <ProductCard
              key={product._id}
              id={product._id}
              naam={locale === 'en' && product.naamEn ? product.naamEn : product.naam}
              artikelnummer={product.artikelnummer}
              slug={product.slug}
              categorie={product.categorie}
              prijs={product.prijs}
              saleProijs={product.saleProijs}
              inVoorraad={product.inVoorraad}
              afbeelding={product.afbeelding}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Stap 9.4: Commit**

```bash
git add -A
git commit -m "feat: winkel overzicht + categoriepagina + ProductCard"
```

---

## Task 10: Productpagina

**Files:**
- Create: `app/[locale]/winkel/[categorie]/[product]/page.tsx`
- Create: `components/shop/ProductGallery.tsx`
- Create: `components/shop/ProductTabs.tsx`

- [ ] **Stap 10.1: ProductGallery component**

```typescript
// components/shop/ProductGallery.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

export function ProductGallery({ images }: { images: any[] }) {
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) {
    return <div className="aspect-square bg-bg-card border border-border flex items-center justify-center text-text-subtle text-sm">Geen foto beschikbaar</div>
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Hoofdfoto */}
      <div className="relative aspect-square bg-bg-card border border-border overflow-hidden">
        <Image
          src={urlFor(images[active]).width(600).height(600).url()}
          alt="Product"
          fill
          className="object-contain p-6"
          priority
        />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img: any, i: number) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 border-2 overflow-hidden flex-shrink-0 transition-colors ${
                i === active ? 'border-brand-accent' : 'border-border hover:border-brand-primary'
              }`}
            >
              <Image
                src={urlFor(img).width(64).height(64).url()}
                alt={`Foto ${i + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Stap 10.2: ProductTabs component**

```typescript
// components/shop/ProductTabs.tsx
'use client'
import { useState } from 'react'
import { PortableText } from '@portabletext/react'

interface ProductTabsProps {
  beschrijving?: any[]
  specificaties?: { label: string; waarde: string }[]
  compatibiliteit?: string[]
}

const tabs = [
  { key: 'beschrijving', label: 'Beschrijving' },
  { key: 'specificaties', label: 'Specificaties' },
  { key: 'compatibiliteit', label: 'Compatibiliteit' },
]

export function ProductTabs({ beschrijving, specificaties, compatibiliteit }: ProductTabsProps) {
  const [active, setActive] = useState('beschrijving')

  return (
    <div className="mt-12 border-t border-border">
      {/* Tab headers */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-6 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition-colors ${
              active === tab.key
                ? 'border-brand-accent text-white'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8">
        {active === 'beschrijving' && (
          <div className="prose prose-invert prose-sm max-w-none text-text-muted leading-relaxed">
            {beschrijving ? <PortableText value={beschrijving} /> : <p>Geen beschrijving beschikbaar.</p>}
          </div>
        )}
        {active === 'specificaties' && (
          <div className="max-w-lg">
            {specificaties && specificaties.length > 0 ? (
              <table className="w-full text-sm">
                <tbody>
                  {specificaties.map((s, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-2.5 pr-6 text-text-muted font-medium w-1/2">{s.label}</td>
                      <td className="py-2.5 text-white">{s.waarde}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-text-muted text-sm">Geen specificaties beschikbaar.</p>
            )}
          </div>
        )}
        {active === 'compatibiliteit' && (
          <div>
            {compatibiliteit && compatibiliteit.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2">
                {compatibiliteit.map((v, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="w-1 h-1 bg-brand-accent rounded-full flex-shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted text-sm">Geen compatibiliteitsinformatie beschikbaar.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Stap 10.3: Productpagina**

```typescript
// app/[locale]/winkel/[categorie]/[product]/page.tsx
import { notFound } from 'next/navigation'
import { ShoppingCart, Check } from 'lucide-react'
import type { Metadata } from 'next'
import { sanityClient } from '@/lib/sanity/client'
import { PRODUCT_QUERY, ALL_PRODUCT_SLUGS_QUERY } from '@/lib/sanity/queries'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductTabs } from '@/components/shop/ProductTabs'
import { ProductCard } from '@/components/shop/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/shop/AddToCartButton'

interface PageProps {
  params: Promise<{ locale: string; categorie: string; product: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(ALL_PRODUCT_SLUGS_QUERY)
  const locales = ['nl', 'en']
  return locales.flatMap((locale: string) =>
    slugs.map((s: { slug: string; categorie: string }) => ({
      locale,
      categorie: s.categorie,
      product: s.slug,
    }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product: slug } = await params
  const product = await sanityClient.fetch(PRODUCT_QUERY, { slug })
  if (!product) return {}
  return {
    title: product.seoTitle ?? product.naam,
    description: product.seoDescription ?? `${product.naam} — artikelnummer ${product.artikelnummer}`,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, product: slug } = await params
  const product = await sanityClient.fetch(PRODUCT_QUERY, { slug })

  if (!product) notFound()

  const naam = locale === 'en' && product.naamEn ? product.naamEn : product.naam
  const beschrijving = locale === 'en' && product.beschrijvingEn ? product.beschrijvingEn : product.beschrijving

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-10 py-12">
        {/* Breadcrumb */}
        <div className="text-xs text-brand-accent tracking-[2px] uppercase mb-8">
          <a href={`/${locale}`}>Home</a> / <a href={`/${locale}/winkel`}>Winkel</a> / <a href={`/${locale}/winkel/${product.categorie.slug}`}>{product.categorie.naam}</a> / {naam}
        </div>

        {/* Product hoofdsectie */}
        <div className="grid grid-cols-2 gap-16 mb-16">
          <ProductGallery images={product.afbeeldingen ?? []} />

          {/* Rechterkolom */}
          <div>
            <div className="text-xs font-mono text-text-subtle mb-2">{product.artikelnummer}</div>
            <h1 className="text-3xl font-extrabold tracking-[-0.5px] mb-4">{naam}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold text-brand-accent">
                {formatPrice(product.saleProijs ?? product.prijs)}
              </span>
              {product.saleProijs && (
                <span className="text-lg text-text-subtle line-through">{formatPrice(product.prijs)}</span>
              )}
            </div>

            <div className="mb-8">
              {product.inVoorraad ? (
                <Badge variant="success"><Check size={12} className="mr-1" />Op voorraad</Badge>
              ) : (
                <Badge variant="neutral">Niet op voorraad</Badge>
              )}
            </div>

            {product.inVoorraad && (
              <AddToCartButton
                id={product._id}
                naam={naam}
                artikelnummer={product.artikelnummer}
                slug={product.slug}
                categorie={product.categorie.slug}
                prijs={product.prijs}
                afbeelding={product.afbeeldingen?.[0]}
              />
            )}

            {/* Quick specs */}
            {product.specificaties?.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-xs font-bold tracking-[2px] uppercase text-text-muted mb-4">Specificaties</h3>
                <dl className="space-y-2">
                  {product.specificaties.slice(0, 4).map((s: any) => (
                    <div key={s.label} className="flex gap-3 text-sm">
                      <dt className="text-text-muted w-32 flex-shrink-0">{s.label}</dt>
                      <dd className="text-white">{s.waarde}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <ProductTabs
          beschrijving={beschrijving}
          specificaties={product.specificaties}
          compatibiliteit={product.compatibiliteit}
        />

        {/* Gerelateerde producten */}
        {product.gerelateerdeProducten?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold tracking-[-0.5px] mb-6">Gerelateerde producten</h2>
            <div className="grid grid-cols-4 gap-0.5">
              {product.gerelateerdeProducten.map((rel: any) => (
                <ProductCard
                  key={rel._id}
                  id={rel._id}
                  naam={locale === 'en' && rel.naamEn ? rel.naamEn : rel.naam}
                  artikelnummer={rel.artikelnummer}
                  slug={rel.slug}
                  categorie={rel.categorie}
                  prijs={rel.prijs}
                  inVoorraad={rel.inVoorraad}
                  afbeelding={rel.afbeelding}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Stap 10.4: AddToCartButton (client component)**

```typescript
// components/shop/AddToCartButton.tsx
'use client'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart'
import { urlFor } from '@/lib/sanity/image'

interface Props {
  id: string
  naam: string
  artikelnummer: string
  slug: string
  categorie: string
  prijs: number
  afbeelding?: any
}

export function AddToCartButton({ id, naam, artikelnummer, slug, categorie, prijs, afbeelding }: Props) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = () => {
    addItem({
      id, naam, artikelnummer, slug, categorie, prijs,
      afbeeldingUrl: afbeelding ? urlFor(afbeelding).width(200).url() : undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className="flex items-center gap-3 w-full bg-brand-primary border-2 border-brand-accent px-8 py-4 text-sm font-bold tracking-wide hover:bg-brand-accent transition-colors"
    >
      {added ? <Check size={16} /> : <ShoppingCart size={16} />}
      {added ? 'Toegevoegd!' : 'In winkelwagen'}
    </button>
  )
}
```

- [ ] **Stap 10.5: Commit**

```bash
git add -A
git commit -m "feat: productpagina met gallery, tabs, gerelateerde producten"
```

---

## Task 11: Zoekpagina

**Files:**
- Create: `app/[locale]/zoeken/page.tsx`

- [ ] **Stap 11.1: Zoekpagina schrijven**

```typescript
// app/[locale]/zoeken/page.tsx
import { sanityClient } from '@/lib/sanity/client'
import { SEARCH_QUERY } from '@/lib/sanity/queries'
import { ProductCard } from '@/components/shop/ProductCard'
import { Search } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function ZoekenPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { q = '' } = await searchParams

  const results = q.length >= 2
    ? await sanityClient.fetch(SEARCH_QUERY, { q })
    : []

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-bg-green border-b border-brand-primary/30 px-10 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-[-1px] mb-6">Zoeken</h1>
          <form method="get" className="flex max-w-xl border-2 border-brand-accent/50">
            <input
              name="q"
              defaultValue={q}
              autoFocus
              placeholder="Artikelnummer, naam of omschrijving…"
              className="flex-1 bg-bg-primary/50 px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none"
            />
            <button type="submit" className="bg-brand-primary px-5 py-3.5 border-l border-brand-accent/50">
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-10">
        {q && <p className="text-text-muted text-sm mb-6">{results.length} resultaten voor &quot;{q}&quot;</p>}
        {results.length > 0 ? (
          <div className="grid grid-cols-4 gap-0.5">
            {results.map((product: any) => (
              <ProductCard
                key={product._id}
                id={product._id}
                naam={locale === 'en' && product.naamEn ? product.naamEn : product.naam}
                artikelnummer={product.artikelnummer}
                slug={product.slug}
                categorie={product.categorie}
                prijs={product.prijs}
                inVoorraad={product.inVoorraad}
                afbeelding={product.afbeelding}
                locale={locale}
              />
            ))}
          </div>
        ) : q ? (
          <p className="text-text-muted">Geen resultaten gevonden. Probeer een ander zoekterm.</p>
        ) : null}
      </div>
    </div>
  )
}
```

- [ ] **Stap 11.2: Commit**

```bash
git add -A
git commit -m "feat: zoekpagina"
```

---

## Task 12: Nav transparant + scroll-gedrag

**Files:**
- Modify: `components/layout/Nav.tsx`

- [ ] **Stap 12.1: Scroll-gedrag toevoegen aan Nav**

```typescript
// Vervang Nav.tsx met scroll-aware versie:
'use client'
import { useEffect, useState } from 'react'
// ... rest van imports

export function Nav({ locale }: { locale: string }) {
  const [scrolled, setScrolled] = useState(false)
  // ... rest van state

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-10
      transition-all duration-300
      ${scrolled
        ? 'bg-bg-primary/97 backdrop-blur-sm border-b border-white/5 shadow-lg shadow-black/20'
        : 'bg-gradient-to-b from-black/60 to-transparent border-transparent'
      }
    `}>
    {/* ... zelfde inhoud als Task 6.1 */}
    </nav>
  )
}
```

- [ ] **Stap 12.2: Verwijder `transparent` prop uit homepage layout**

In `app/[locale]/layout.tsx` — Nav krijgt geen `transparent` prop meer nodig, regelt zichzelf.

- [ ] **Stap 12.3: Commit**

```bash
git add -A
git commit -m "feat: nav scroll-gedrag (transparant → solid)"
```

---

## Task 13: Deploy naar Vercel

**Files:**
- Create: `vercel.json` (optioneel)
- Create: `.gitignore`

- [ ] **Stap 13.1: `.gitignore` controleren**

```
.env.local
.next/
node_modules/
.sanity/
```

- [ ] **Stap 13.2: Build testen lokaal**

```bash
npm run build
```

Verwacht: geen TypeScript errors, succesvolle SSG build.
Als er errors zijn: fix ze voordat je deployed.

- [ ] **Stap 13.3: Push naar GitHub**

```bash
git remote add origin <jouw-github-repo-url>
git push -u origin main
```

- [ ] **Stap 13.4: Vercel project aanmaken**

1. Ga naar vercel.com → New Project
2. Importeer de GitHub repo
3. Voeg environment variables in: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`, `NEXT_PUBLIC_SITE_URL`
4. Deploy

- [ ] **Stap 13.5: Sanity CORS instellen voor productie**

```bash
npx sanity cors add https://jouw-project.vercel.app
```

- [ ] **Stap 13.6: Sanity Studio embedden (optioneel — voor eigenaar)**

```typescript
// app/studio/[[...tool]]/page.tsx
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

Nu toegankelijk op `/studio` — eigenaar kan hier inloggen en producten beheren.

- [ ] **Stap 13.7: Final commit**

```bash
git add -A
git commit -m "feat: plan 1 compleet — foundation + shop deployed"
```

---

## Wat ontbreekt in Plan 1 (→ Plan 2)

- Winkelwagen pagina (`/winkelwagen`)
- Checkout flow (`/afrekenen` + Mollie integratie)
- Orderbevestiging (`/bestelling/[id]`)
- Bevestigingsmail (Resend)
- WooCommerce productmigratie (script)
- SEO structured data (Schema.org Product markup)
- Sitemap XML generatie
- 301 redirect generatie voor alle 418 producten
- Google Shopping feed
- `llms.txt`
- Juridische pagina's content
