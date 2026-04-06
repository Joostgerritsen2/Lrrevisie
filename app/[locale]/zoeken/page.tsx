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
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 py-10 md:py-12">
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

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-10">
        {q && <p className="text-text-muted text-sm mb-6">{results.length} resultaten voor &quot;{q}&quot;</p>}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0.5">
            {results.map((product: { _id: string; naam: string; naamEn?: string; artikelnummer: string; slug: string; categorie: { naam: string; slug: string }; prijs: number; inVoorraad: boolean; afbeelding?: unknown }) => (
              <ProductCard
                key={product._id}
                id={product._id}
                naam={locale === 'en' && product.naamEn ? product.naamEn : product.naam}
                artikelnummer={product.artikelnummer}
                slug={product.slug}
                categorie={product.categorie}
                prijs={product.prijs}
                inVoorraad={product.inVoorraad}
                afbeelding={product.afbeelding as Parameters<typeof ProductCard>[0]['afbeelding']}
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
