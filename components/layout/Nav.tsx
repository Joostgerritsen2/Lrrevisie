'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NavSearch } from './NavSearch'
import { useCartStore } from '@/lib/cart'

const NAV_LINKS = (locale: string, t: (k: string) => string) => [
  { href: `/${locale}/winkel`,          label: t('shop') },
  { href: `/${locale}/revisie-service`, label: t('revision') },
  { href: `/${locale}/gidsen`,          label: t('guides') },
  { href: `/${locale}/contact`,         label: t('contact') },
]

export function Nav({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const itemCount = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0))
  const pathname = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sluit menu bij route-wijziging
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Blokkeer body scroll wanneer menu open is
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function switchLocalePath(target: string) {
    const segs = pathname.split('/')
    segs[1] = target
    return segs.join('/')
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-5 md:px-10
        transition-all duration-300
        ${scrolled || mobileOpen
          ? 'bg-bg-primary border-b border-white/6 shadow-2xl shadow-black/40'
          : 'bg-gradient-to-b from-black/70 to-transparent'
        }
      `}>
        {/* Logo */}
        <Link href={`/${locale}`} className="flex-shrink-0">
          <Image
            src="/lr-logo.png"
            alt="LR Revisie"
            width={280}
            height={86}
            quality={100}
            className="h-8 md:h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS(locale, t).map(({ href, label }) => (
            <Link key={href} href={href}
              className={`relative px-3 py-1.5 text-sm font-medium transition-colors rounded-none
                ${isActive(href)
                  ? 'text-white after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-0.5 after:bg-brand-accent'
                  : 'text-white/60 hover:text-white'
                }`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Rechts */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* Taalwisselaar — desktop only */}
          <span className="hidden lg:flex text-[11px] text-white/35 gap-1 items-center">
            <Link href={switchLocalePath('nl')}
              className={locale === 'nl' ? 'text-white font-bold' : 'hover:text-white/60 transition-colors'}>NL</Link>
            <span className="text-white/20">·</span>
            <Link href={switchLocalePath('en')}
              className={locale === 'en' ? 'text-white font-bold' : 'hover:text-white/60 transition-colors'}>EN</Link>
          </span>

          <NavSearch locale={locale} />

          {/* Cart */}
          <Link href={`/${locale}/winkelwagen`}
            className="relative flex items-center gap-2 bg-brand-primary border border-brand-accent/60 px-3 md:px-4 py-2 text-sm font-bold hover:bg-brand-accent hover:border-brand-accent transition-all duration-200 group"
          >
            <ShoppingCart size={15} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">{itemCount > 0 ? `(${itemCount})` : t('cart')}</span>
            {itemCount > 0 && (
              <>
                <span className="sm:hidden text-xs font-bold">{itemCount}</span>
                <span className="absolute -top-1.5 -right-1.5 sm:hidden w-4 h-4 bg-brand-accent text-bg-primary text-[10px] font-black flex items-center justify-center">
                  {itemCount}
                </span>
              </>
            )}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-white/70 hover:text-white transition-colors"
            aria-label={mobileOpen ? 'Sluit menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`
        fixed inset-0 z-40 md:hidden transition-all duration-300
        ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

        {/* Slide-in panel */}
        <div className={`
          absolute top-16 left-0 right-0 bg-bg-primary border-b border-white/8
          transition-transform duration-300
          ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}
        `}>
          <nav className="px-5 py-6 space-y-1">
            {NAV_LINKS(locale, t).map(({ href, label }) => (
              <Link key={href} href={href}
                className={`flex items-center justify-between py-3.5 border-b border-white/5 text-[15px] font-semibold transition-colors
                  ${isActive(href) ? 'text-brand-accent' : 'text-white/80 hover:text-white'}`}
              >
                {label}
                <ChevronRight size={16} className="text-white/20" />
              </Link>
            ))}
          </nav>

          {/* Bottom: taalwisselaar */}
          <div className="px-5 py-4 border-t border-white/8 flex items-center justify-between">
            <span className="text-xs text-text-subtle">Taal</span>
            <div className="flex gap-3 text-sm font-semibold">
              <Link href={switchLocalePath('nl')}
                className={locale === 'nl' ? 'text-brand-accent' : 'text-white/40 hover:text-white transition-colors'}>
                Nederlands
              </Link>
              <span className="text-white/15">|</span>
              <Link href={switchLocalePath('en')}
                className={locale === 'en' ? 'text-brand-accent' : 'text-white/40 hover:text-white transition-colors'}>
                English
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
