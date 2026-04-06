'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NavSearch } from './NavSearch'
import { useCartStore } from '@/lib/cart'

export function Nav({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const itemCount = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0))
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function switchLocalePath(target: string) {
    const segs = pathname.split('/')
    segs[1] = target
    return segs.join('/')
  }

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-5 md:px-10
      transition-all duration-300
      ${scrolled
        ? 'bg-bg-primary/97 backdrop-blur-md border-b border-white/6 shadow-2xl shadow-black/30'
        : 'bg-gradient-to-b from-black/70 to-transparent'
      }
    `}>
      {/* Logo — transparante PNG, donkergroen → helder via filter */}
      <Link href={`/${locale}`} className="group flex-shrink-0">
        <Image
          src="/lr-logo.png"
          alt="LR Revisie"
          width={140}
          height={43}
          className="h-9 w-auto object-contain transition-all duration-200"
          style={{ filter: 'brightness(1.1) saturate(1.2)' }}
          priority
        />
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7 lg:gap-9">
        <Link href={`/${locale}/winkel`}
          className="relative text-sm font-medium text-white/65 hover:text-white transition-colors after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-px after:bg-brand-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200">
          {t('shop')}
        </Link>
        <Link href={`/${locale}/gidsen`}
          className="relative text-sm font-medium text-white/65 hover:text-white transition-colors after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-px after:bg-brand-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200">
          {t('guides')}
        </Link>
        <Link href={`/${locale}/over-ons`}
          className="relative text-sm font-medium text-white/65 hover:text-white transition-colors after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-px after:bg-brand-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200">
          {t('about')}
        </Link>
        <Link href={`/${locale}/contact`}
          className="relative text-sm font-medium text-white/65 hover:text-white transition-colors after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-px after:bg-brand-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200">
          {t('contact')}
        </Link>
      </div>

      {/* Rechts */}
      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden lg:flex text-[11px] text-white/35 gap-1 items-center">
          <Link href={switchLocalePath('nl')}
            className={locale === 'nl' ? 'text-white font-bold' : 'hover:text-white/60 transition-colors'}>NL</Link>
          <span className="text-white/20">·</span>
          <Link href={switchLocalePath('en')}
            className={locale === 'en' ? 'text-white font-bold' : 'hover:text-white/60 transition-colors'}>EN</Link>
        </span>
        <NavSearch locale={locale} />
        <Link
          href={`/${locale}/winkelwagen`}
          className="flex items-center gap-2 bg-brand-primary border border-brand-accent/70 px-3.5 md:px-4 py-2 text-sm font-bold hover:bg-brand-accent hover:border-brand-accent transition-all duration-200 group"
        >
          <ShoppingCart size={15} className="group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">
            {itemCount > 0 ? `(${itemCount})` : t('cart')}
          </span>
          {itemCount > 0 && <span className="sm:hidden">{itemCount}</span>}
        </Link>
      </div>
    </nav>
  )
}
