'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NavSearch } from './NavSearch'
import { useCartStore } from '@/lib/cart'

interface NavProps {
  locale: string
}

export function Nav({ locale }: NavProps) {
  const t = useTranslations('nav')
  const itemCount = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0))
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function switchLocalePath(targetLocale: string) {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    return segments.join('/')
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-10
        transition-all duration-300
        ${scrolled
          ? 'bg-bg-primary/97 backdrop-blur-sm border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-gradient-to-b from-black/60 to-transparent border-transparent'
        }
      `}
    >
      {/* Logo */}
      <Link href={`/${locale}`}>
        <Image
          src="https://lr-revisie.nl/wp-content/uploads/2023/04/LR_Logo.jpg"
          alt="LR Revisie"
          width={120}
          height={37}
          className="h-9 w-auto object-contain"
          priority
        />
      </Link>

      {/* Links */}
      <div className="flex items-center gap-8">
        <Link href={`/${locale}/winkel`} className="text-text-muted hover:text-white text-sm font-medium transition-colors">{t('shop')}</Link>
        <Link href={`/${locale}/gidsen`} className="text-text-muted hover:text-white text-sm font-medium transition-colors">{t('guides')}</Link>
        <Link href={`/${locale}/over-ons`} className="text-text-muted hover:text-white text-sm font-medium transition-colors">{t('about')}</Link>
        <Link href={`/${locale}/contact`} className="text-text-muted hover:text-white text-sm font-medium transition-colors">{t('contact')}</Link>
      </div>

      {/* Rechts */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/40">
          <Link href={switchLocalePath('nl')} className={locale === 'nl' ? 'text-white font-semibold' : ''}>NL</Link>
          {' / '}
          <Link href={switchLocalePath('en')} className={locale === 'en' ? 'text-white font-semibold' : ''}>EN</Link>
        </span>
        <NavSearch locale={locale} />
        <Link
          href={`/${locale}/winkelwagen`}
          className="flex items-center gap-2 bg-brand-primary border border-brand-accent px-4 py-2 text-sm font-semibold hover:bg-brand-accent transition-colors"
        >
          <ShoppingCart size={16} />
          {itemCount > 0 ? itemCount : t('cart')}
        </Link>
      </div>
    </nav>
  )
}
