'use client'
import { ShoppingBag, Wrench, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useEffect, useRef } from 'react'

// Coverr.co (gratis commercieel gebruik) — klassieke Land Rover Defender 90, donkerblauw
const VIDEO_URL   = 'https://cdn.coverr.co/videos/coverr-couple-getting-out-of-a-land-rover-5064/1080p.mp4'
const VIDEO_URL_2 = 'https://cdn.coverr.co/videos/coverr-parked-land-rover-on-a-beach-1734/1080p.mp4'
const POSTER_URL  = 'https://cdn.coverr.co/videos/coverr-couple-getting-out-of-a-land-rover-5064/thumbnail?width=1280'

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        if (video) video.style.transform = `translateY(${window.scrollY * 0.3}px)`
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative h-[70vh] min-h-[480px] max-h-[680px] flex items-end overflow-hidden bg-bg-primary">

      {/* Video achtergrond — met parallax */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={POSTER_URL}
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ filter: 'brightness(0.5) saturate(0.9) contrast(1.1)', willChange: 'transform' }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
        <source src={VIDEO_URL_2} type="video/mp4" />
      </video>

      {/* Subtiele groene brand-tint */}
      <div className="absolute inset-0 bg-brand-primary/15 mix-blend-multiply pointer-events-none" />

      {/* Gradient onderaan: tekst leesbaar, bovenkant open zodat video zichtbaar blijft */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/45 to-bg-primary/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/75 via-transparent to-transparent pointer-events-none" />

      {/* Verticale accentlijn links */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-accent z-10" />

      {/* Decoratieve rechterhoek — geeft diepte */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-accent/20 to-transparent" />

      {/* Hoofdcontent */}
      <div className="relative z-10 pb-16 md:pb-24 pl-8 md:pl-20 pr-6 max-w-2xl xl:max-w-3xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 md:mb-6">
          <div className="w-6 md:w-10 h-[2px] bg-brand-accent" />
          <span className="text-[10px] md:text-[11px] font-bold tracking-[4px] uppercase text-brand-accent/70">
            Land Rover & Range Rover Specialist
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(34px,5.5vw,72px)] font-extrabold leading-[1.02] tracking-[-2px] text-white mb-5 md:mb-6">
          {t('headline')}
        </h1>

        {/* Subtext */}
        <p className="text-sm md:text-base leading-[1.8] text-white/55 mb-8 md:mb-10 max-w-[500px]">
          {t('subtext')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link href={`/${locale}/winkel`}>
              <ShoppingBag size={16} />
              {t('cta_shop')}
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <Link href={`/${locale}/over-ons`}>
              <Wrench size={16} />
              Over ons
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats blokken rechtsonder */}
      <div className="absolute bottom-0 right-0 flex z-10">
        {[
          { num: '531',  label: 'Onderdelen' },
          { num: '30+',  label: 'Jaar ervaring' },
          { num: 'EU',   label: 'Verzending' },
        ].map((s, i) => (
          <div
            key={s.num}
            className={`
              bg-bg-primary/90 backdrop-blur-sm
              border-l border-t border-brand-primary/50
              px-5 md:px-8 py-4 md:py-6 text-center
              ${i === 2 ? '' : ''}
            `}
          >
            <div className="text-xl md:text-3xl font-extrabold text-brand-accent leading-none tracking-[-1px]">
              {s.num}
            </div>
            <div className="text-[9px] md:text-[10px] text-white/40 tracking-[1.5px] mt-1.5 uppercase font-medium">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10 opacity-40">
        <ChevronDown size={18} className="text-white animate-bounce" />
      </div>
    </section>
  )
}
