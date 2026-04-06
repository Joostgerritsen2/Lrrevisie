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
