import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations('footer')

  return (
    <footer className="bg-[#010603] border-t border-brand-primary/20 pt-14 pb-7">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Image
              src="https://lr-revisie.nl/wp-content/uploads/2023/04/LR_Logo.jpg"
              alt="LR Revisie"
              width={100}
              height={31}
              className="h-7 w-auto object-contain mb-5 opacity-70"
            />
            <p className="text-sm text-text-subtle leading-relaxed max-w-[240px]">{t('tagline')}</p>
          </div>
          {/* Winkel */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-5">{t('shop')}</h4>
            {['gereviseerde-versnellingsbakken','gereviseerde-tussenbakken','gereviseerde-differentielen','gereviseerde-stuurhuizen','onderdelen'].map(cat => (
              <Link key={cat} href={`/${locale}/winkel/${cat}`} className="block text-sm text-text-muted hover:text-white mb-2.5 capitalize transition-colors">
                {cat.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
          {/* Info */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-5">{t('info')}</h4>
            <Link href={`/${locale}/over-ons`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Over ons</Link>
            <Link href={`/${locale}/gidsen`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Gidsen</Link>
            <Link href={`/${locale}/faq`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">FAQ</Link>
            <Link href={`/${locale}/contact`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Contact</Link>
          </div>
          {/* Service */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-5">{t('service')}</h4>
            <Link href={`/${locale}/verzending-retour`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Verzending &amp; retour</Link>
            <Link href={`/${locale}/algemene-voorwaarden`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Algemene voorwaarden</Link>
            <Link href={`/${locale}/privacy`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Privacybeleid</Link>
            <Link href={`/${locale}/herroepingsrecht`} className="block text-sm text-text-muted hover:text-white mb-2.5 transition-colors">Herroepingsrecht</Link>
          </div>
        </div>
        {/* Bottom */}
        <div className="border-t border-white/4 pt-6 flex justify-between items-center">
          <p className="text-xs text-white/20">{t('copyright')}</p>
          <div className="flex gap-1.5">
            {['iDEAL','Bancontact','Mastercard','Visa'].map(m => (
              <span key={m} className="bg-white/5 border border-white/7 px-2.5 py-1 text-[11px] text-white/30 font-semibold">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
