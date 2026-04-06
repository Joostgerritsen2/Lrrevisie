'use client'
import { ShoppingBag, BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero')

  return (
    <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
      {/* Video achtergrond */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://lr-revisie.nl/wp-content/uploads/2023/01/FRC8382-scaled.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.3) saturate(0.6)' }}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-black/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 via-transparent to-transparent pointer-events-none" />

      {/* Accentlijn links */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent z-10" />

      {/* Content */}
      <div className="relative z-10 pb-20 pl-20 max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-0.5 bg-brand-accent" />
          <span className="text-xs font-bold tracking-[3px] uppercase text-brand-accent">
            {t('eyebrow')}
          </span>
        </div>
        <h1 className="text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-[-2px] text-white mb-5">
          {t('headline')}
        </h1>
        <p className="text-base leading-[1.75] text-text-muted mb-9 max-w-[480px]">
          {t('subtext')}
        </p>
        <div className="flex gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link href={`/${locale}/winkel`}>
              <ShoppingBag size={16} />
              {t('cta_shop')}
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <Link href={`/${locale}/gidsen`}>
              <BookOpen size={16} />
              {t('cta_guides')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats rechtsonder IN de hero */}
      <div className="absolute bottom-0 right-0 flex z-10">
        {[
          { num: '418', label: 'Onderdelen' },
          { num: '30+', label: 'Jaar ervaring' },
          { num: 'NL & BE', label: 'Levering' },
        ].map(s => (
          <div
            key={s.num}
            className="bg-bg-primary/85 backdrop-blur-sm border-l border-t border-brand-primary/40 px-7 py-5 text-center"
          >
            <div className="text-2xl font-extrabold text-brand-accent leading-none">{s.num}</div>
            <div className="text-[10px] text-text-muted tracking-[1px] mt-1 uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-16 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-12 bg-gradient-to-b from-brand-accent/80 to-transparent animate-pulse" />
        <span className="text-[10px] tracking-[2px] uppercase text-white/30">Scroll</span>
      </div>
    </section>
  )
}
