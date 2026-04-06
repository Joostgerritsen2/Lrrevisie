import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Settings, Layers, RotateCw, Navigation, Flame, Wrench, Lock, Package } from 'lucide-react'
import { urlFor } from '@/lib/sanity/image'
import { cn } from '@/lib/utils'
import type { SanityImageSource } from '@sanity/image-url'

interface CategoryCardProps {
  naam: string
  slug: string
  beschrijving?: string
  afbeelding?: SanityImageSource
  productCount: number
  featured?: boolean
  locale: string
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'gereviseerde-versnellingsbakken': Settings,
  'gereviseerde-tussenbakken':       Layers,
  'gereviseerde-differentielen':     RotateCw,
  'gereviseerde-stuurhuizen':        Navigation,
  'gereviseerde-cilinderkoppen':     Flame,
  'onderdelen':                      Wrench,
  'sper-en-lock-differentielen':     Lock,
  'accessoires-en-overigen':         Package,
}

export function CategoryCard({ naam, slug, beschrijving, afbeelding, productCount, featured, locale }: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[slug] ?? Wrench

  return (
    <Link
      href={`/${locale}/winkel/${slug}`}
      className={cn(
        'group relative flex flex-col min-h-[180px] p-6 lg:p-7 border border-brand-primary/25',
        'bg-bg-card hover:bg-bg-elevated hover:border-brand-accent/50',
        'transition-all duration-200 overflow-hidden accent-line-top',
        featured && 'col-span-2',
      )}
    >
      {/* Background image (low opacity) */}
      {afbeelding && (
        <div className="absolute inset-0 overflow-hidden opacity-8 group-hover:opacity-15 transition-opacity duration-300">
          <Image
            src={urlFor(afbeelding).width(700).url()}
            alt={naam}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/80 to-transparent" />
        </div>
      )}

      {/* Decorative background icon */}
      <div className="absolute right-5 top-5 opacity-4 group-hover:opacity-7 transition-opacity duration-300">
        <Icon size={72} className="text-brand-accent" strokeWidth={1} />
      </div>

      {/* Small icon */}
      <div className="relative w-8 h-8 flex items-center justify-center bg-brand-primary/40 border border-brand-accent/20 mb-4 group-hover:border-brand-accent/50 transition-colors">
        <Icon size={15} className="text-brand-accent" />
      </div>

      {/* Text */}
      <h3 className="relative text-[15px] font-bold tracking-[-0.3px] text-white mb-1.5 leading-tight">{naam}</h3>
      {beschrijving && (
        <p className="relative text-xs text-text-muted leading-relaxed line-clamp-2 mb-3">{beschrijving}</p>
      )}

      {/* Footer */}
      <div className="relative mt-auto flex items-center justify-between pt-3.5 border-t border-white/6">
        <span className="text-xs font-semibold text-brand-accent/70 group-hover:text-brand-accent transition-colors">
          {productCount} producten
        </span>
        <ArrowRight size={15} className="text-white/20 group-hover:text-brand-accent transition-colors duration-200" />
      </div>
    </Link>
  )
}
