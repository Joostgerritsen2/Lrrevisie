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
  productCount: number
  featured?: boolean
  locale: string
}

export function CategoryCard({ naam, slug, beschrijving, afbeelding, productCount, featured, locale }: CategoryCardProps) {
  return (
    <Link
      href={`/${locale}/winkel/${slug}`}
      className={cn(
        'group relative flex flex-col gap-2.5 p-7 border border-brand-primary/20',
        'bg-bg-card hover:bg-bg-elevated hover:border-brand-accent/40',
        'transition-colors duration-200 accent-line-top',
        featured && 'col-span-2',
      )}
    >
      {afbeelding && (
        <div className="absolute inset-0 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity">
          <Image
            src={urlFor(afbeelding).width(600).url()}
            alt={naam}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h3 className="relative text-[15px] font-bold tracking-[-0.3px] text-white">{naam}</h3>
      {beschrijving && (
        <p className="relative text-xs text-text-muted leading-relaxed">{beschrijving}</p>
      )}
      <div className="relative mt-auto flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-xs font-semibold text-brand-accent/70">{productCount} producten</span>
        <ArrowRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
      </div>
    </Link>
  )
}
