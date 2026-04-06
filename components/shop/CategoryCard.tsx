import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity/image'
import { cn } from '@/lib/utils'
import type { SanityImageSource } from '@sanity/image-url'

interface CategoryCardProps {
  naam: string
  slug: string
  beschrijving?: string
  afbeelding?: SanityImageSource
  productAfbeelding?: SanityImageSource
  productCount: number
  featured?: boolean
  locale: string
}

export function CategoryCard({
  naam, slug, beschrijving, afbeelding, productAfbeelding,
  productCount, featured, locale,
}: CategoryCardProps) {
  const img = afbeelding ?? productAfbeelding

  return (
    <Link
      href={`/${locale}/winkel/${slug}`}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden',
        'min-h-[200px] sm:min-h-[220px]',
        featured ? 'sm:col-span-2 sm:min-h-[260px]' : '',
      )}
    >
      {/* Achtergrond foto */}
      {img ? (
        <Image
          src={urlFor(img).width(featured ? 900 : 600).height(400).url()}
          alt={naam}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={featured ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
        />
      ) : (
        <div className="absolute inset-0 bg-bg-elevated" />
      )}

      {/* Gradient overlay — donker onderaan voor leesbaarheid */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/55" />

      {/* Groene accentlijn boven — verschijnt bij hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6">
        <h3 className="text-base sm:text-lg font-extrabold tracking-[-0.3px] text-white leading-tight mb-1.5">
          {naam}
        </h3>
        {beschrijving && (
          <p className="text-xs text-white/50 leading-relaxed line-clamp-1 mb-3 group-hover:text-white/70 transition-colors">
            {beschrijving}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-accent/80 group-hover:text-brand-accent transition-colors">
            {productCount} producten
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-white/40 group-hover:text-brand-accent group-hover:gap-2 transition-all duration-200">
            Bekijk <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}
