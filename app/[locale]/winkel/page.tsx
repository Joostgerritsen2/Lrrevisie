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
