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
    <div className="min-h-screen bg-bg-primary">
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 pt-28 pb-10 md:pt-32 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-subtle mb-4">
            <a href={`/${locale}`} className="hover:text-white transition-colors">Home</a>
            <span className="text-white/20 mx-1">›</span>
            <span className="text-brand-accent">Zoeken</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-1.5px] leading-tight mb-6">
            {q ? `Resultaten voor "${q}"` : 'Zoeken'}
          </h1>
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
        {q && results.length > 0 && <p className="text-text-muted text-sm mb-6">{results.length} resultaten</p>}
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
