import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import { sanityClient } from '@/lib/sanity/client'
import { PRODUCT_QUERY, ALL_PRODUCT_SLUGS_QUERY } from '@/lib/sanity/queries'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductTabs } from '@/components/shop/ProductTabs'
import { ProductCard } from '@/components/shop/ProductCard'
import { Badge } from '@/components/ui/Badge'
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
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-10 py-12">
        {/* Breadcrumb */}
        <div className="text-xs text-brand-accent tracking-[2px] uppercase mb-8">
          <a href={`/${locale}`}>Home</a> / <a href={`/${locale}/winkel`}>Winkel</a> / <a href={`/${locale}/winkel/${product.categorie.slug}`}>{product.categorie.naam}</a> / {naam}
        </div>

        {/* Product hoofdsectie */}
        <div className="grid grid-cols-2 gap-16 mb-16">
          <ProductGallery images={product.afbeeldingen ?? []} />

          {/* Rechterkolom */}
          <div>
            <div className="text-xs font-mono text-text-subtle mb-2">{product.artikelnummer}</div>
            <h1 className="text-3xl font-extrabold tracking-[-0.5px] mb-4">{naam}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold text-brand-accent">
                {formatPrice(product.salePrijs ?? product.prijs)}
              </span>
              {product.salePrijs && (
                <span className="text-lg text-text-subtle line-through">{formatPrice(product.prijs)}</span>
              )}
            </div>

            <div className="mb-8">
              {product.inVoorraad ? (
                <Badge variant="success"><Check size={12} className="mr-1" />Op voorraad</Badge>
              ) : (
                <Badge variant="neutral">Niet op voorraad</Badge>
              )}
            </div>

            {product.inVoorraad && (
              <AddToCartButton
                id={product._id}
                naam={naam}
                artikelnummer={product.artikelnummer}
                slug={product.slug}
                categorie={product.categorie.slug}
                prijs={product.prijs}
                afbeelding={product.afbeeldingen?.[0]}
              />
            )}

            {/* Quick specs */}
            {product.specificaties?.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-xs font-bold tracking-[2px] uppercase text-text-muted mb-4">Specificaties</h3>
                <dl className="space-y-2">
                  {product.specificaties.slice(0, 4).map((s: { label: string; waarde: string }) => (
                    <div key={s.label} className="flex gap-3 text-sm">
                      <dt className="text-text-muted w-32 flex-shrink-0">{s.label}</dt>
                      <dd className="text-white">{s.waarde}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <ProductTabs
          beschrijving={beschrijving}
          specificaties={product.specificaties}
          compatibiliteit={product.compatibiliteit}
        />

        {/* Gerelateerde producten */}
        {product.gerelateerdeProducten?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold tracking-[-0.5px] mb-6">Gerelateerde producten</h2>
            <div className="grid grid-cols-4 gap-0.5">
              {product.gerelateerdeProducten.map((rel: { _id: string; naam: string; naamEn?: string; artikelnummer: string; slug: string; categorie: { naam: string; slug: string }; prijs: number; inVoorraad: boolean; afbeelding?: unknown }) => (
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
