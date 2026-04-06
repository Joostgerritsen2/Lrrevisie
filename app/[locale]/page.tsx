import { sanityClient } from '@/lib/sanity/client'
import { CATEGORIES_QUERY, SETTINGS_QUERY, FEATURED_PRODUCTS_QUERY } from '@/lib/sanity/queries'
import { HeroSection } from '@/components/home/HeroSection'
import { UspBar } from '@/components/home/UspBar'
import { CategoryCard } from '@/components/shop/CategoryCard'
import { ProductCard } from '@/components/shop/ProductCard'
import { AboutSection } from '@/components/home/AboutSection'
import { FaqSection } from '@/components/home/FaqSection'
import { Parallax } from '@/components/ui/Parallax'
import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const [categories, settings, featured] = await Promise.all([
    sanityClient.fetch(CATEGORIES_QUERY),
    sanityClient.fetch(SETTINGS_QUERY),
    sanityClient.fetch(FEATURED_PRODUCTS_QUERY),
  ])

  return (
    <>
      <HeroSection locale={locale} />
      <UspBar />

      {/* ─── Categorieën ───────────────────────────────────────────── */}
      <section className="relative bg-bg-grey py-16 md:py-24 px-5 md:px-10 overflow-hidden">
        {/* Decoratief parallax achtergrond element */}
        <Parallax speed={0.3} className="absolute inset-[-25%] pointer-events-none">
          <div className="absolute top-[15%] right-[5%] w-[700px] h-[700px] bg-brand-accent/[0.07] blur-[100px]" style={{ borderRadius: '50%' }} />
          <div className="absolute bottom-[10%] left-[0%] w-[500px] h-[500px] bg-brand-primary/[0.2] blur-[80px]" style={{ borderRadius: '50%' }} />
        </Parallax>

        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-0.5 bg-brand-accent" />
                <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Productcategorieën</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-1px]">Wat zoek je?</h2>
            </div>
            <Link href={`/${locale}/winkel`}
              className="hidden sm:flex items-center gap-2 text-sm text-brand-accent/70 hover:text-brand-accent transition-colors font-medium">
              Alle categorieën <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {categories.map((cat: {
              _id: string; naam: string; naamEn?: string; slug: string
              beschrijving?: string; beschrijvingEn?: string
              afbeelding?: unknown; productAfbeelding?: unknown; productCount: number
            }, i: number) => (
              <CategoryCard
                key={cat._id}
                naam={locale === 'en' && cat.naamEn ? cat.naamEn : cat.naam}
                slug={cat.slug}
                beschrijving={locale === 'en' && cat.beschrijvingEn ? cat.beschrijvingEn : cat.beschrijving}
                afbeelding={cat.afbeelding as Parameters<typeof CategoryCard>[0]['afbeelding']}
                productAfbeelding={cat.productAfbeelding as Parameters<typeof CategoryCard>[0]['productAfbeelding']}
                productCount={cat.productCount}
                featured={i === 0}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Uitgelichte producten ─────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="bg-bg-warm border-t border-white/6 py-16 md:py-24 px-5 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8 md:mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-0.5 bg-brand-accent" />
                  <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Vers binnengekomen</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-1px]">Uitgelichte producten</h2>
              </div>
              <Link href={`/${locale}/winkel`}
                className="hidden sm:flex items-center gap-2 text-sm text-brand-accent/70 hover:text-brand-accent transition-colors font-medium">
                Alle producten <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0.5">
              {featured.map((product: {
                _id: string; naam: string; naamEn?: string; artikelnummer: string; slug: string
                categorie: { naam: string; naamEn?: string; slug: string }
                prijs: number; salePrijs?: number; inVoorraad: boolean; afbeelding?: unknown
              }) => (
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

            <div className="mt-6 text-center sm:hidden">
              <Link href={`/${locale}/winkel`}
                className="inline-flex items-center gap-2 text-sm text-brand-accent font-medium">
                Alle producten bekijken <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Zoekbalk CTA ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-bg-deep-green via-brand-dark to-brand-primary py-12 md:py-16 px-5 md:px-10 border-t-2 border-brand-accent relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-16">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-[-0.5px] mb-1.5">Weet je het artikelnummer al?</h2>
            <p className="text-sm text-white/55">Zoek direct op OEM-nummer, naam of omschrijving</p>
          </div>
          <form action={`/${locale}/zoeken`} method="GET"
            className="flex w-full md:flex-1 md:max-w-[520px] border-2 border-white/20 bg-black/20 focus-within:border-white/40 transition-colors">
            <input
              type="text"
              name="q"
              placeholder="Bijv. FRC1780, RTC7158 of 'output shaft seal'…"
              autoComplete="off"
              className="flex-1 px-5 py-4 text-sm text-white bg-transparent placeholder-white/30 outline-none"
            />
            <button type="submit"
              className="flex items-center gap-2 bg-brand-accent/20 border-l-2 border-white/20 px-5 md:px-6 py-4 text-sm font-bold tracking-widest hover:bg-brand-accent/40 transition-colors flex-shrink-0">
              <Search size={15} />
              <span className="hidden sm:inline">ZOEK</span>
            </button>
          </form>
        </div>
      </section>

      <FaqSection locale={locale} />

      <AboutSection
        eigenaarNaam={settings?.eigenaarNaam}
        eigenaarBio={settings?.eigenaarBio}
        eigenaarFoto={settings?.eigenaarFoto}
      />
    </>
  )
}
