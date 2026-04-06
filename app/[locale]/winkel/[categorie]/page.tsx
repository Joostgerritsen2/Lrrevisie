import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { sanityClient } from '@/lib/sanity/client'
import { PRODUCTS_BY_CATEGORY_QUERY, ALL_CATEGORY_SLUGS_QUERY } from '@/lib/sanity/queries'
import { ProductCard } from '@/components/shop/ProductCard'
import { SortSelect } from '@/components/shop/SortSelect'

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

  // Sortering
  const sorted = [...products].sort((a: { naam: string; prijs: number }, b: { naam: string; prijs: number }) => {
    if (sort === 'prijs-asc') return a.prijs - b.prijs
    if (sort === 'prijs-desc') return b.prijs - a.prijs
    return a.naam.localeCompare(b.naam)
  })

  const catNaam = (products[0] as { categorie?: { naam: string } })?.categorie?.naam ?? categorie

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-brand-accent tracking-[2px] uppercase mb-2">
            <a href={`/${locale}`}>Home</a> / <a href={`/${locale}/winkel`}>Winkel</a> / {catNaam}
          </div>
          <h1 className="text-4xl font-extrabold tracking-[-1px]">{catNaam}</h1>
          <p className="text-text-muted mt-2">{products.length} producten</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-10">
        {/* SortSelect wrapped in Suspense (uses useSearchParams) */}
        <Suspense fallback={null}>
          <SortSelect current={sort} />
        </Suspense>

        {/* Productgrid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0.5">
          {sorted.map((product: { _id: string; naam: string; naamEn?: string; artikelnummer: string; slug: string; categorie: { naam: string; slug: string }; prijs: number; salePrijs?: number; inVoorraad: boolean; afbeelding?: unknown }) => (
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
      </div>
    </div>
  )
}
