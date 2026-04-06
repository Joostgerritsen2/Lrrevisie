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
  productAfbeelding?: SanityImageSource
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

export function CategoryCard({
  naam, slug, beschrijving, afbeelding, productAfbeelding,
  productCount, featured, locale,
}: CategoryCardProps) {
  const img = afbeelding ?? productAfbeelding
  const Icon = CATEGORY_ICONS[slug] ?? Wrench

  return (
    <Link
      href={`/${locale}/winkel/${slug}`}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden bg-bg-card',
        'border border-brand-primary/20 hover:border-brand-accent/40',
        'min-h-[190px] sm:min-h-[210px] transition-colors duration-300',
        featured ? 'sm:col-span-2' : '',
      )}
    >
      {/* Product foto — object-contain, alleen zichtbaar bij hover */}
      {img && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Image
            src={urlFor(img).width(600).height(400).url()}
            alt={naam}
            fill
            className="object-contain p-8 scale-90 group-hover:scale-100 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
          {/* Donkere vignette overlay zodat tekst leesbaar blijft */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/95 via-bg-card/50 to-bg-card/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-card/60 via-transparent to-bg-card/60" />
        </div>
      )}

      {/* Default state: decoratief groot icoon */}
      <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-0 transition-opacity duration-300">
        <Icon size={80} className="text-brand-accent" strokeWidth={0.8} />
      </div>

      {/* Groene accentlijn links — altijd zichtbaar, sterker bij hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-accent/20 group-hover:bg-brand-accent transition-colors duration-300" />

      {/* Content onderaan */}
      <div className="relative z-10 p-5 sm:p-6">
        {/* Klein icoon */}
        <div className="w-7 h-7 flex items-center justify-center bg-brand-primary/30 border border-brand-accent/15 mb-3 group-hover:border-brand-accent/50 transition-colors">
          <Icon size={13} className="text-brand-accent" />
        </div>

        <h3 className="text-[15px] sm:text-base font-extrabold tracking-[-0.3px] text-white leading-tight mb-1">
          {naam}
        </h3>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
          <span className="text-[11px] font-semibold text-brand-accent/60 group-hover:text-brand-accent transition-colors">
            {productCount} producten
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/25 group-hover:text-brand-accent group-hover:gap-2 transition-all duration-200 font-semibold">
            Bekijk <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}
