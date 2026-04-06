import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { sanityClient } from '@/lib/sanity/client'
import { PRODUCTS_BY_CATEGORY_QUERY, ALL_CATEGORY_SLUGS_QUERY } from '@/lib/sanity/queries'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductFilter } from '@/components/shop/ProductFilter'

interface PageProps {
  params: Promise<{ locale: string; categorie: string }>
  searchParams: Promise<{ sort?: string; voorraad?: string; min?: string; max?: string }>
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
  const { sort = 'naam', voorraad = 'all', min = '', max = '' } = await searchParams

  const products = await sanityClient.fetch(PRODUCTS_BY_CATEGORY_QUERY, { categorie })
  if (!products || products.length === 0) notFound()

  const catNaam = (products[0] as { categorie?: { naam: string } })?.categorie?.naam ?? categorie

  // Filter + sortering
  type Product = { _id: string; naam: string; naamEn?: string; artikelnummer: string; slug: string; categorie: { naam: string; slug: string }; prijs: number; salePrijs?: number; inVoorraad: boolean; afbeelding?: unknown }

  let filtered: Product[] = [...products]
  if (voorraad === 'op-voorraad') filtered = filtered.filter(p => p.inVoorraad)
  if (min) filtered = filtered.filter(p => (p.prijs / 100) >= Number(min))
  if (max) filtered = filtered.filter(p => (p.prijs / 100) <= Number(max))
  filtered.sort((a, b) => {
    if (sort === 'prijs-asc')  return a.prijs - b.prijs
    if (sort === 'prijs-desc') return b.prijs - a.prijs
    return a.naam.localeCompare(b.naam)
  })

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-warm border-b border-white/6 px-5 md:px-10 pt-24 pb-6 md:pt-28 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-subtle mb-4 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/20 mx-1">›</span>
            <Link href={`/${locale}/winkel`} className="hover:text-white transition-colors">Winkel</Link>
            <span className="text-white/20 mx-1">›</span>
            <span className="text-brand-accent">{catNaam}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-1.5px] leading-tight mb-2">{catNaam}</h1>
          <p className="text-sm text-text-muted">{products.length} gereviseerde onderdelen</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
        <Suspense fallback={null}>
          <ProductFilter total={products.length} filtered={filtered.length} />
        </Suspense>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-text-muted">
            <p className="text-lg font-semibold mb-2">Geen producten gevonden</p>
            <p className="text-sm">Pas de filters aan om meer resultaten te zien.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0.5">
            {filtered.map(product => (
              <ProductCard
                key={product._id}
                id={product._id}
                naam={locale === 'en' && product.naamEn ? product.naamEn : product.naam}
                artikelnummer={product.artikelnummer}
                slug={product.slug}
                categorie={product.categorie}
                prijs={product.prijs}
                salePrijs={product.salePrijs}
                inVoorraad={product.inVoorraad}
                afbeelding={product.afbeelding as Parameters<typeof ProductCard>[0]['afbeelding']}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
