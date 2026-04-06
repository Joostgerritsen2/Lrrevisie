'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { urlFor } from '@/lib/sanity/image'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/lib/cart'
import type { SanityImageSource } from '@sanity/image-url'

interface ProductCardProps {
  id: string
  naam: string
  artikelnummer: string
  slug: string
  categorie: { naam: string; slug: string }
  prijs: number
  salePrijs?: number
  inVoorraad: boolean
  afbeelding?: SanityImageSource
  locale: string
}

export function ProductCard({ id, naam, artikelnummer, slug, categorie, prijs, salePrijs, inVoorraad, afbeelding, locale }: ProductCardProps) {
  const t = useTranslations('shop')
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ id, naam, artikelnummer, slug, categorie: categorie.slug, prijs, afbeeldingUrl: afbeelding ? urlFor(afbeelding).width(200).url() : undefined })
  }

  return (
    <Link
      href={`/${locale}/winkel/${categorie.slug}/${slug}`}
      className="group flex flex-col border border-brand-primary/20 bg-bg-card hover:bg-bg-elevated hover:border-brand-accent/40 transition-colors accent-line-top"
    >
      {/* Afbeelding */}
      <div className="relative aspect-square bg-bg-primary overflow-hidden">
        {afbeelding ? (
          <Image
            src={urlFor(afbeelding).width(400).height(400).url()}
            alt={naam}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-subtle text-xs">Geen foto</div>
        )}
        {salePrijs && (
          <Badge variant="success" className="absolute top-2 left-2">Sale</Badge>
        )}
        {!inVoorraad && (
          <div className="absolute inset-0 bg-bg-primary/60 flex items-center justify-center">
            <Badge variant="neutral">{t('out_of_stock')}</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="text-xs text-text-subtle font-mono">{artikelnummer}</div>
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">{naam}</h3>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <span className="text-base font-bold text-brand-accent">{formatPrice(salePrijs ?? prijs)}</span>
            {salePrijs && (
              <span className="ml-2 text-xs text-text-subtle line-through">{formatPrice(prijs)}</span>
            )}
          </div>
          {inVoorraad && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-brand-primary border border-brand-accent px-2.5 py-1.5 text-xs font-bold hover:bg-brand-accent transition-colors flex-shrink-0"
            >
              <ShoppingCart size={12} />
              <span className="hidden sm:inline">{t('add_to_cart')}</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
