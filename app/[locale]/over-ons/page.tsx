import Image from 'next/image'
import { sanityClient } from '@/lib/sanity/client'
import { SETTINGS_QUERY } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { CheckCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: 'Over ons',
  description: '30+ jaar specialist in revisie van Land Rover en Range Rover versnellingsbakken, tussenbakken en differentielen.',
}

const HIGHLIGHTS = [
  'Gespecialiseerd in LT76, LT77, LT85, LT95, LT230, R380 en ZF automaat',
  '30+ jaar ervaring met Land Rover en Range Rover',
  'Elk onderdeel 100% gereviseerd en getest',
  'Levering in Nederland, België en heel Europa',
  'Geen nieuw? Stuur uw eigen onderdeel op voor revisie',
  'Persoonlijk advies via telefoon of e-mail',
]

export default async function OverOnsPage({ params }: PageProps) {
  const { locale } = await params
  const settings = await sanityClient.fetch(SETTINGS_QUERY)

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-brand-accent tracking-[2px] uppercase mb-2">
            <a href={`/${locale}`} className="hover:text-white transition-colors">Home</a>
            <span className="mx-1.5">/</span>
            Over ons
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-1px]">Over LR Revisie</h1>
          <p className="text-text-muted mt-2">Uw specialist in Land Rover revisie-onderdelen</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-brand-accent" />
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Onze missie</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.5px] mb-6">
              Vakkundige revisie voor iedere Land Rover
            </h2>
            <div className="space-y-4 text-sm text-text-muted leading-relaxed">
              <p>
                LR Revisie is al meer dan 30 jaar gespecialiseerd in het reviseren van versnellingsbakken, tussenbakken, differentielen en stuurhuizen voor Land Rover en Range Rover voertuigen.
              </p>
              <p>
                Elk onderdeel dat onze werkplaats verlaat is volledig gereviseerd, gemonteerd met nieuwe lagers en afdichtingen, en uitvoerig getest. Zo weet u zeker dat uw Land Rover weer jaren meekan.
              </p>
              <p>
                Heeft u geen nieuw onderdeel nodig maar wilt u uw eigen unit laten reviseren? Dat kan. Stuur uw versnellingsbak, tussenbak of differentieel op en wij zorgen voor een vakkundige revisie.
              </p>
            </div>

            {/* Highlights */}
            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map(h => (
                <li key={h} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-muted">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Photo */}
          <div className="space-y-4">
            {settings?.eigenaarFoto ? (
              <div className="relative aspect-[4/3] overflow-hidden border border-brand-primary/25">
                <Image
                  src={urlFor(settings.eigenaarFoto).width(700).url()}
                  alt={settings.eigenaarNaam ?? 'LR Revisie specialist'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-[4/3] bg-bg-elevated border border-brand-primary/25 overflow-hidden">
                <Image
                  src="https://lr-revisie.nl/wp-content/uploads/2022/12/koen-van-driel-lr-revisie.jpg"
                  alt="Koen van Driel — LR Revisie"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {settings?.eigenaarNaam && (
              <div className="border-l-2 border-brand-accent pl-4">
                <div className="text-sm font-bold text-white">{settings.eigenaarNaam}</div>
                <div className="text-xs text-text-muted">Eigenaar &amp; specialist, LR Revisie</div>
              </div>
            )}
            {!settings?.eigenaarNaam && (
              <div className="border-l-2 border-brand-accent pl-4">
                <div className="text-sm font-bold text-white">Koen van Driel</div>
                <div className="text-xs text-text-muted">Eigenaar &amp; specialist, LR Revisie</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 mt-16 md:mt-20">
          {[
            { num: '30+', label: 'Jaar ervaring' },
            { num: '500+', label: 'Producten' },
            { num: '100%', label: 'Gereviseerd' },
            { num: 'EU', label: 'Levering' },
          ].map(s => (
            <div key={s.num} className="bg-bg-card border border-brand-primary/20 px-6 py-7 text-center">
              <div className="text-3xl font-extrabold text-brand-accent mb-1">{s.num}</div>
              <div className="text-xs text-text-muted tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
