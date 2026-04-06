import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryIllustration } from './CategoryIllustration'
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
  naam, slug, productCount, featured, locale,
}: CategoryCardProps) {
  return (
    <Link
      href={`/${locale}/winkel/${slug}`}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden bg-bg-grey-card',
        'border border-white/5 hover:border-brand-accent/50',
        'min-h-[200px] sm:min-h-[220px] transition-all duration-500',
        featured ? 'sm:col-span-2' : '',
      )}
    >
      {/* SVG blauwdruk illustratie — groot, gecentreerd, als watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Achtergrond glow bij hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,166,82,0.08) 0%, transparent 70%)' }}
        />

        <CategoryIllustration
          slug={slug}
          className={cn(
            'w-[75%] h-[75%] transition-all duration-700 ease-out',
            'text-brand-accent/[0.07] group-hover:text-brand-accent/[0.22]',
            'scale-90 group-hover:scale-100',
          )}
        />
      </div>

      {/* Subtiele dot-grid achtergrond */}
      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
        style={{ backgroundImage: 'radial-gradient(circle, #00A652 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />

      {/* Groene accentlijn links */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-accent/20 group-hover:bg-brand-accent transition-colors duration-300" />

      {/* Hover: subtiele groene rand glow */}
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,166,82,0)] group-hover:shadow-[inset_0_0_0_1px_rgba(0,166,82,0.3)] transition-all duration-500 pointer-events-none" />

      {/* Content onderaan */}
      <div className="relative z-10 p-5 sm:p-6">
        <h3 className="text-[15px] sm:text-base font-extrabold tracking-[-0.3px] text-white leading-tight mb-1">
          {naam}
        </h3>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
          <span className="text-[11px] font-semibold text-brand-accent/60 group-hover:text-brand-accent transition-colors duration-300">
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
