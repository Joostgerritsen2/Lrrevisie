import { notFound } from 'next/navigation'
import { Check, X, ShieldCheck, Truck, RotateCcw, Phone, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity/client'
import { PRODUCT_QUERY, ALL_PRODUCT_SLUGS_QUERY } from '@/lib/sanity/queries'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductTabs } from '@/components/shop/ProductTabs'
import { ProductCard } from '@/components/shop/ProductCard'
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
    <div className="min-h-screen pt-16 bg-bg-primary">

      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-bg-card/50">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-3">
          <div className="flex items-center gap-1.5 text-xs text-text-subtle flex-wrap">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={11} className="text-white/20" />
            <Link href={`/${locale}/winkel`} className="hover:text-white transition-colors">Winkel</Link>
            <ChevronRight size={11} className="text-white/20" />
            <Link href={`/${locale}/winkel/${product.categorie.slug}`} className="hover:text-white transition-colors">
              {product.categorie.naam}
            </Link>
            <ChevronRight size={11} className="text-white/20" />
            <span className="text-white/50 truncate max-w-[200px]">{naam}</span>
          </div>
        </div>
      </div>

      {/* Product hoofdsectie */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Linker kolom: Gallery */}
          <ProductGallery images={product.afbeeldingen ?? []} />

          {/* Rechter kolom: Info + Kopen */}
          <div className="flex flex-col">
            {/* Categorie + artikelnummer */}
            <div className="flex items-center gap-3 mb-3">
              <Link href={`/${locale}/winkel/${product.categorie.slug}`}
                className="text-[10px] font-bold tracking-[2px] uppercase text-brand-accent/80 hover:text-brand-accent transition-colors bg-brand-primary/20 border border-brand-accent/15 px-2.5 py-1">
                {product.categorie.naam}
              </Link>
              <span className="text-xs font-mono text-text-subtle">{product.artikelnummer}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.5px] leading-tight mb-4">{naam}</h1>

            {/* Prijs */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl md:text-4xl font-extrabold text-brand-accent">
                {formatPrice(product.salePrijs ?? product.prijs)}
              </span>
              {product.salePrijs && (
                <span className="text-lg text-text-subtle line-through">{formatPrice(product.prijs)}</span>
              )}
              <span className="text-xs text-text-subtle">incl. BTW</span>
            </div>

            {/* Voorraad status */}
            <div className="flex items-center gap-2 mb-6">
              {product.inVoorraad ? (
                <>
                  <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-brand-accent">Op voorraad</span>
                </>
              ) : (
                <>
                  <X size={14} className="text-red-400" />
                  <span className="text-sm font-medium text-red-400">Niet op voorraad</span>
                </>
              )}
            </div>

            {/* Korte specs (top 4) */}
            {product.specificaties?.length > 0 && (
              <div className="bg-bg-card border border-brand-primary/20 p-4 mb-6">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {product.specificaties.slice(0, 4).map((s: { label: string; waarde: string }) => (
                    <div key={s.label} className="min-w-0">
                      <dt className="text-[10px] font-bold tracking-[1.5px] uppercase text-text-subtle mb-0.5 truncate">{s.label}</dt>
                      <dd className="text-sm font-semibold text-white truncate">{s.waarde}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* CTA */}
            {product.inVoorraad ? (
              <AddToCartButton
                id={product._id}
                naam={naam}
                artikelnummer={product.artikelnummer}
                slug={product.slug}
                categorie={product.categorie.slug}
                prijs={product.prijs}
                afbeelding={product.afbeeldingen?.[0]}
              />
            ) : (
              <Link href={`/${locale}/contact`}
                className="flex items-center justify-center gap-2 bg-bg-card border border-brand-primary/40 px-6 py-3.5 text-sm font-bold hover:border-brand-accent/40 transition-colors mb-4">
                <Phone size={14} /> Vraag naar beschikbaarheid
              </Link>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/6">
              {[
                { icon: ShieldCheck, title: '2 jaar garantie', sub: 'op alle revisies' },
                { icon: Truck,       title: 'EU verzending',   sub: 'snel geleverd' },
                { icon: RotateCcw,   title: '14 dagen',        sub: 'retourrecht' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex flex-col items-center text-center gap-1.5 p-3 bg-bg-card/50 border border-white/5">
                  <Icon size={16} className="text-brand-accent" />
                  <span className="text-[11px] font-bold text-white leading-tight">{title}</span>
                  <span className="text-[10px] text-text-subtle leading-tight">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: beschrijving + alle specs */}
        <div className="mt-12 md:mt-16">
          <ProductTabs
            beschrijving={beschrijving}
            specificaties={product.specificaties}
            compatibiliteit={product.compatibiliteit}
          />
        </div>

        {/* Gerelateerde producten */}
        {product.gerelateerdeProducten?.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-0.5 bg-brand-accent" />
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Mogelijk ook interessant</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-[-0.5px] mb-6">Gerelateerde producten</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
              {product.gerelateerdeProducten.map((rel: {
                _id: string; naam: string; naamEn?: string; artikelnummer: string
                slug: string; categorie: { naam: string; slug: string }
                prijs: number; inVoorraad: boolean; afbeelding?: unknown
              }) => (
                <ProductCard
                  key={rel._id}
                  id={rel._id}
                  naam={locale === 'en' && rel.naamEn ? rel.naamEn : rel.naam}
                  artikelnummer={rel.artikelnummer}
                  slug={rel.slug}
                  categorie={rel.categorie}
                  prijs={rel.prijs}
                  inVoorraad={rel.inVoorraad}
                  afbeelding={rel.afbeelding as Parameters<typeof ProductCard>[0]['afbeelding']}
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
