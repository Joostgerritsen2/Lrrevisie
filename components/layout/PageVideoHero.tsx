'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'

// Mixkit CC0 — draaiende metalen tandwielen, past perfect bij een gearbox specialist
const VIDEO_URL = 'https://assets.mixkit.co/videos/32653/32653-720.mp4'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageVideoHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  breadcrumbs: Breadcrumb[]
  height?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function PageVideoHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  height = 'md',
  children,
}: PageVideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        if (video) video.style.transform = `translateY(${window.scrollY * 0.25}px)`
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heightClass = {
    sm: 'min-h-[220px] md:min-h-[260px]',
    md: 'min-h-[280px] md:min-h-[360px]',
    lg: 'min-h-[360px] md:min-h-[480px]',
  }[height]

  return (
    <div className={`relative flex flex-col justify-end overflow-hidden bg-bg-primary pt-16 ${heightClass}`}>

      {/* Video achtergrond */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-110"
        style={{ filter: 'brightness(0.32) saturate(0.6) contrast(1.1)', willChange: 'transform' }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Groene brand tint */}
      <div className="absolute inset-0 bg-brand-primary/15 mix-blend-multiply pointer-events-none" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/55 to-transparent pointer-events-none" />

      {/* Verticale accentlijn links */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-accent/60 z-10" />

      {/* Subtiele punt-patroon overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #00A652 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 pb-10 md:pb-14 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-text-subtle mb-4 flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={11} className="text-white/20" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-brand-accent">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>

        {/* Eyebrow */}
        {eyebrow && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">{eyebrow}</span>
          </div>
        )}

        {/* Titel */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-1.5px] leading-tight text-white mb-3">
          {title.split('\n').map((line, i) => (
            <span key={i}>{line}{i < title.split('\n').length - 1 && <br />}</span>
          ))}
        </h1>

        {/* Subtitel */}
        {subtitle && (
          <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed">{subtitle}</p>
        )}

        {/* Extra content (bijv. CTA knoppen) */}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}
