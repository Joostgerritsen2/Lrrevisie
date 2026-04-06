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
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-warm border-b border-white/6 px-5 md:px-10 pt-24 pb-7 md:pt-28 md:pb-9">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-subtle mb-4 flex-wrap">
            <a href={`/${locale}`} className="hover:text-white transition-colors">Home</a>
            <span className="text-white/20 mx-1">›</span>
            <span className="text-brand-accent">Winkel</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Land Rover specialist</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-1.5px] leading-tight text-white mb-3">Winkel</h1>
          <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed">Gereviseerde versnellingsbakken, tussenbakken, differentielen en onderdelen voor alle Land Rover en Range Rover modellen.</p>
        </div>
      </div>

      {/* Categorieën grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {categories.map((cat: { _id: string; naam: string; naamEn?: string; slug: string; beschrijving?: string; beschrijvingEn?: string; afbeelding?: unknown; productCount: number }, i: number) => (
            <CategoryCard
              key={cat._id}
              naam={locale === 'en' && cat.naamEn ? cat.naamEn : cat.naam}
              slug={cat.slug}
              beschrijving={locale === 'en' && cat.beschrijvingEn ? cat.beschrijvingEn : cat.beschrijving}
              afbeelding={cat.afbeelding as Parameters<typeof CategoryCard>[0]['afbeelding']}
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
