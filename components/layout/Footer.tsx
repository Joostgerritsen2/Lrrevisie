import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

const SHOP_LINKS = [
  { slug: 'gereviseerde-versnellingsbakken', label: 'Versnellingsbakken' },
  { slug: 'gereviseerde-tussenbakken',       label: 'Tussenbakken' },
  { slug: 'gereviseerde-differentielen',     label: 'Differentielen' },
  { slug: 'gereviseerde-stuurhuizen',        label: 'Stuurhuizen' },
  { slug: 'onderdelen',                      label: 'Onderdelen' },
  { slug: 'sper-en-lock-differentielen',     label: 'Sper & Lock Diff.' },
]

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations('footer')

  return (
    <footer className="bg-[#010603] border-t border-brand-primary/20 pt-12 md:pt-14 pb-7">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo.png"
              alt="LR Revisie"
              width={120}
              height={37}
              className="h-8 w-auto object-contain mb-5"
              style={{ filter: 'brightness(2) saturate(0.9) opacity(0.65)' }}
            />
            <p className="text-sm text-text-subtle leading-relaxed max-w-[240px]">{t('tagline')}</p>
          </div>

          {/* Winkel */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-4 md:mb-5">{t('shop')}</h4>
            {SHOP_LINKS.map(({ slug, label }) => (
              <Link key={slug} href={`/${locale}/winkel/${slug}`}
                className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">
                {label}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-4 md:mb-5">{t('info')}</h4>
            <Link href={`/${locale}/over-ons`} className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">Over ons</Link>
            <Link href={`/${locale}/gidsen`} className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">Gidsen</Link>
            <Link href={`/${locale}/faq`} className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">FAQ</Link>
            <Link href={`/${locale}/contact`} className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">Contact</Link>
          </div>

          {/* Service */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-4 md:mb-5">{t('service')}</h4>
            <Link href={`/${locale}/verzending-retour`} className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">Verzending &amp; retour</Link>
            <Link href={`/${locale}/algemene-voorwaarden`} className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">Algemene voorwaarden</Link>
            <Link href={`/${locale}/privacy`} className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">Privacybeleid</Link>
            <Link href={`/${locale}/herroepingsrecht`} className="block text-sm text-text-muted hover:text-white mb-2 transition-colors">Herroepingsrecht</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/4 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-white/20">{t('copyright')}</p>
          <div className="flex gap-1.5">
            {['iDEAL', 'Bancontact', 'Mastercard', 'Visa'].map(m => (
              <span key={m} className="bg-white/5 border border-white/7 px-2.5 py-1 text-[11px] text-white/30 font-semibold">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
