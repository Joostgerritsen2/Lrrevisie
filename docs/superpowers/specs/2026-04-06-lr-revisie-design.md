# LR Revisie — Design Spec
**Datum:** 2026-04-06
**Status:** Goedgekeurd

---

## 1. Project Doel

Volledige herbouw van lr-revisie.nl. De huidige WordPress + Divi + WooCommerce site wordt vervangen door een moderne, razendsnelle Next.js webshop. Prioriteiten: snelheid, vindbaarheid (Google + LLMs), en een premium design dat recht doet aan de vakkennis van LR Revisie.

---

## 2. Tech Stack

| Laag | Keuze | Reden |
|------|-------|-------|
| Frontend | Next.js 15 (App Router) | SSG/ISR voor snelheid, i18n ingebouwd |
| Styling | Tailwind CSS | Design system tokens, geen Divi-bloat |
| CMS / Producten | Sanity v3 | Eigenaar beheert producten zelf via Studio |
| Betaling | Mollie | Bestaand account, iDEAL + Bancontact + card |
| Orders | Sanity (order documents) | Alles op één plek |
| Deploy | Vercel | Edge CDN, ISR, zero-config |
| Taal | NL (primair) + EN via Next.js i18n | Internationale klanten |

---

## 3. Design System

### Kleuren
```
--color-bg:          #030A05   (diepzwart-groen)
--color-bg-card:     #060F08
--color-bg-elevated: #091409
--color-border:      rgba(0,91,47,0.25)
--color-border-hover: rgba(0,166,82,0.4)
--color-primary:     #005B2F   (Land Rover groen)
--color-accent:      #00A652   (helder groen, accenten)
--color-text:        #FFFFFF
--color-text-muted:  rgba(255,255,255,0.5)
--color-text-subtle: rgba(255,255,255,0.25)
```

### Typografie
- Font: Inter (400/500/600/700/800)
- Headings: font-weight 800, letter-spacing negatief (-0.5px tot -2px)
- Body: 14–16px, line-height 1.7
- Labels: 10–11px, letter-spacing 2–3px, uppercase

### Karakter
- **Nul border-radius** overal — scherpe, industriële hoeken
- Groene accentlijn (2–4px) als visueel karakter element
- Hover: border-color transition + subtiele achtergrond verlichting
- Lucide icons (consistent, geen emoji)

---

## 4. Sitemap & URL Structuur

### Pagina's
```
/                          Homepage
/over-ons/                 Over LR Revisie
/contact/                  Contact
/faq/                      Veelgestelde vragen
/gidsen/                   Technische gidsen overzicht
/gidsen/[slug]/            Individuele gids (SEO-waardevolle content)
/winkel/                   Winkel overzicht (alle categorieën)
/winkel/[categorie]/       Categoriepagina met filters
/winkel/[categorie]/[product]/  Productpagina
/zoeken/                   Zoekresultaten
/winkelwagen/              Winkelwagen
/afrekenen/                Checkout (gastbetaling)
/bestelling/[id]/          Orderbevestiging
/verzending-retour/        Verzending & retourbeleid
/statiegeld/               Statiegeld retourbeleid
/herroepingsrecht/         Herroepingsrecht
/algemene-voorwaarden/     Algemene voorwaarden
/privacy/                  Privacybeleid
```

### 301 Redirect Map (next.config.js)
```
/product/[slug]/           → /winkel/[categorie]/[slug]/
/product-category/[cat]/   → /winkel/[cat]/
/over-landrover-revisie/   → /over-ons/
/veel-gestelde-vragen/     → /faq/
/versnellingsbak-identificatie/ → /gidsen/versnellingsbak-identificatie/
/overzicht-van-versnellingsbakken/ → /gidsen/overzicht-versnellingsbakken/
/rover-v8-motor-nummers/   → /gidsen/rover-v8-motor-nummers/
/privacybeleid/            → /privacy/
```
Alle 418 product-redirects worden programmatisch gegenereerd vanuit Sanity (slug + categorie).

---

## 5. Pagina Ontwerpen

### 5.1 Homepage
Secties van boven naar beneden:
1. **Nav** — sticky bij scroll, transparant over hero, logo + links + zoek + winkelwagen
2. **Hero** — volledige viewport, `<video autoplay muted loop playsinline>` als achtergrond (Land Rover werkplaats footage), donkere gradient overlay, grote headline, twee CTA-knoppen, stat-blokken rechtsonder in hero
3. **USP-balk** — 4 items: gratis verzending, snelle levering, 30+ jaar expertise, iDEAL
4. **Categorieën** — 3×2 grid, featured card (versnellingsbakken) spans 2 kolommen
5. **Zoekbalk** — prominente sectie met artikelnummer zoeken
6. **Over ons** — 2-koloms: tekst + stats-grid links, foto-collage rechts
7. **Footer** — 4-koloms: brand + 3 linkgroepen, betaalmethode-iconen

### 5.2 Categoriepagina `/winkel/[categorie]/`
- Breadcrumb: Home > Winkel > [Categorie]
- Sidebar: subcategorieën, prijsfilter, beschikbaarheidsfilter
- Hoofdgrid: productkaarten (foto, naam, artikelnummer, prijs, "In winkelwagen")
- Sortering: prijs laag-hoog, naam A-Z, nieuwste eerst
- SSG met ISR revalidatie (60s) — razendsnel

### 5.3 Productpagina `/winkel/[categorie]/[product]/`
- Foto gallery (meerdere foto's, lightbox)
- Rechterkolom: naam, artikelnummer, prijs, beschikbaarheid, "In winkelwagen" knop
- Tabs: Beschrijving | Specificaties | Compatibiliteit (LR-modellen)
- Gerelateerde producten onderaan
- Schema.org Product markup voor Google Shopping + LLM-citaties
- Breadcrumb structured data

### 5.4 Winkelwagen
- Productlijst met foto, naam, prijs, hoeveelheid aanpassen, verwijderen
- Subtotaal, verzendkosten berekening
- "Afrekenen" CTA prominent
- Bewaar winkelwagen in localStorage

### 5.5 Checkout (gast)
Stap 1: Adresgegevens (naam, email, adres, postcode, stad, land)
Stap 2: Verzendmethode selecteren
Stap 3: Betaling via Mollie (redirect naar Mollie betaalpagina)
→ Mollie webhook ontvangt betaalbevestiging
→ Order aangemaakt in Sanity
→ Bevestigingsmail via Resend (transactionele email, 21% BTW verwerkt in ordertotaal)

### 5.6 Technische Gidsen (SEO/LLM strategie)
- `/gidsen/` — overzicht van alle gidsen
- Elke gids heeft structured data (Article schema)
- Content in Sanity (Portable Text)
- Interne links naar relevante producten
- Open Graph + Twitter Card metadata
- `llms.txt` in root voor LLM-vindbaarheid

---

## 6. Sanity Schema

### Product
```
{
  name, slug, artikelnummer, prijs, salePrice?,
  categorie (reference), subcategorie?,
  afbeeldingen[] (image), beschrijving (Portable Text),
  specificaties[] ({label, waarde}),
  compatibiliteit[] (string — LR-modellen),
  inVoorraad (boolean), voorraadAantal?,
  seoTitle, seoDescription,
  gerelateerdeProducten[] (reference)
}
```

### Categorie
```
{
  naam, slug, beschrijving, afbeelding,
  volgorde (number — voor sortering)
}
```

### Order (aangemaakt na succesvolle Mollie betaling)
```
{
  mollieOrderId, status (pending/paid/shipped/cancelled),
  klant: { naam, email, adres },
  regels[] ({ product (ref), naam, artikelnummer, prijs, aantal }),
  totaal, verzendkosten, btw,
  aangemaaktop (datetime), verzenddatum?
}
```

### Gids (technische content)
```
{
  titel, slug, inhoud (Portable Text),
  seoDescription, relatedProducts[] (reference),
  gepubliceerdOp (datetime)
}
```

### Instellingen (singleton)
```
{
  gratisverzendingVanaf, verzendkostenNL, verzendkostenBE,
  mollieApiKey (hidden), resendApiKey (hidden),
  usp[] ({icoon, titel, ondertitel})
}
```

---

## 7. Checkout Flow (Mollie)

```
Klant klikt "Afrekenen"
  → Next.js API route POST /api/checkout/create
  → Mollie Orders API: maak order aan met regels + redirect URLs
  → Klant → Mollie betaalpagina (iDEAL, Bancontact, etc.)
  → Na betaling → redirect naar /bestelling/[id]?result=success
  → Mollie webhook → POST /api/mollie/webhook
    → Controleer betaalstatus bij Mollie
    → Sla order op in Sanity
    → Stuur bevestigingsmail
```

---

## 8. SEO & LLM Vindbaarheid

- **Next.js Metadata API** — title, description, og:image per pagina
- **Schema.org** — Product, BreadcrumbList, Article, Organization, WebSite
- **Sitemap.xml** — automatisch gegenereerd vanuit Sanity
- **robots.txt** — geoptimaliseerd
- **llms.txt** — in `/public/llms.txt` met bedrijfsbeschrijving + productcategorieën
- **Canonical URLs** — voorkomen duplicate content
- **Hreflang** — NL/EN alternates
- Technische gidsen als autoritatieve content voor LLM-citaties
- Alle product ALT-teksten via Sanity

---

## 9. Product Feed (Marktplaats / Google Shopping)

API endpoint `/api/feeds/google-shopping.xml` — genereert Google Shopping XML feed vanuit Sanity-producten. Uitbreidbaar naar Marktplaats-export (CSV), Bol.com feed. Sanity als "single source of truth" voor alle platformen.

---

## 10. Performance Targets

- Lighthouse score: 95+ (Performance, Accessibility, SEO)
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Alle productpagina's: statisch gegenereerd (SSG)
- Categoriepagina's: ISR (60s revalidatie)
- Afbeeldingen: next/image met WebP + lazy loading
- Video hero: lazy load, poster image als fallback

---

## 11. Productmigratieplan

418 producten migreren van WooCommerce naar Sanity:
1. WooCommerce REST API exporteren naar JSON
2. Mapping script: WC-velden → Sanity-schema
3. Afbeeldingen downloaden en uploaden naar Sanity assets
4. Categorieën mappen naar nieuwe slug-structuur
5. Redirect-tabel genereren (oud slug → nieuw pad)

---

## 12. Project Structuur

```
lr-revisie/
├── app/                    # Next.js App Router
│   ├── [locale]/
│   │   ├── page.tsx        # Homepage
│   │   ├── winkel/
│   │   │   ├── page.tsx    # Winkel overzicht
│   │   │   └── [categorie]/
│   │   │       ├── page.tsx
│   │   │       └── [product]/page.tsx
│   │   ├── winkelwagen/page.tsx
│   │   ├── afrekenen/page.tsx
│   │   └── bestelling/[id]/page.tsx
│   └── api/
│       ├── checkout/create/route.ts
│       └── mollie/webhook/route.ts
├── components/
│   ├── layout/             # Nav, Footer
│   ├── shop/               # ProductCard, CategoryCard, etc.
│   ├── checkout/           # CheckoutForm, CartItem
│   └── ui/                 # Button, Icon, Badge (generiek)
├── lib/
│   ├── sanity.ts           # Sanity client + queries
│   ├── mollie.ts           # Mollie client
│   └── cart.ts             # Cart state (Zustand)
├── sanity/                 # Sanity Studio (embedded)
│   └── schemas/
└── public/
    └── llms.txt
```
