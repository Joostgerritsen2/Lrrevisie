import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { PageVideoHero } from '@/components/layout/PageVideoHero'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: 'Contact',
  description: 'Neem contact op met LR Revisie voor al uw vragen over Land Rover versnellingsbakken, tussenbakken en differentielen.',
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-bg-primary">
      <PageVideoHero
        eyebrow="Land Rover Specialist"
        title="Contact opnemen"
        subtitle="Stel uw vraag — we helpen u graag persoonlijk verder."
        breadcrumbs={[
          { label: 'Home', href: `/${locale}` },
          { label: 'Contact' },
        ]}
        height="md"
      />

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-brand-accent" />
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Bereikbaarheid</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-[-0.5px] mb-8">Neem contact op</h2>

            <div className="space-y-3">
              {[
                { icon: Phone,   label: 'Telefoon',      value: '+31 (0)6 12 34 56 78', href: 'tel:+31612345678' },
                { icon: Mail,    label: 'E-mail',         value: 'info@lr-revisie.nl',   href: 'mailto:info@lr-revisie.nl' },
                { icon: MapPin,  label: 'Locatie',        value: 'Nederland',             href: undefined },
                { icon: Clock,   label: 'Openingstijden', value: 'Ma – Vr: 08:00 – 17:00', href: undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-bg-card border border-brand-primary/20 hover:border-brand-accent/30 transition-colors group">
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-primary/30 border border-brand-accent/15 flex-shrink-0 group-hover:border-brand-accent/40 transition-colors">
                    <Icon size={15} className="text-brand-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm text-white hover:text-brand-accent transition-colors font-medium">{value}</a>
                    ) : (
                      <div className="text-sm text-white font-medium">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 border-l-2 border-brand-accent bg-bg-card">
              <p className="text-sm text-text-muted leading-relaxed">
                <strong className="text-white">Eigen unit opsturen?</strong> U kunt uw versnellingsbak, tussenbak of differentieel opsturen voor revisie. Neem eerst contact op voor een prijsopgave en instructies.
              </p>
            </div>

            {/* Revisie service link */}
            <Link href={`/${locale}/revisie-service`}
              className="mt-5 flex items-center gap-3 p-4 bg-bg-green border border-brand-primary/30 hover:border-brand-accent/40 transition-colors group">
              <div className="flex-1">
                <div className="text-sm font-bold text-white mb-0.5">Revisie service</div>
                <div className="text-xs text-text-muted">Bekijk ons 5-staps revisieproces en indicatieve prijzen</div>
              </div>
              <div className="text-brand-accent/50 group-hover:text-brand-accent transition-colors text-xs font-bold tracking-wide">→</div>
            </Link>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.5px] mb-8">Stuur een bericht</h2>
            <form className="space-y-4" action="mailto:info@lr-revisie.nl" method="get">
              <div>
                <label className="block text-[10px] font-bold tracking-[2px] uppercase text-text-subtle mb-2">Naam</label>
                <input
                  type="text" name="Naam" placeholder="Uw naam"
                  className="w-full bg-bg-elevated border border-brand-primary/30 focus:border-brand-accent px-4 py-3 text-sm text-white placeholder-text-subtle outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[2px] uppercase text-text-subtle mb-2">E-mail</label>
                <input
                  type="email" name="E-mail" placeholder="uw@email.nl"
                  className="w-full bg-bg-elevated border border-brand-primary/30 focus:border-brand-accent px-4 py-3 text-sm text-white placeholder-text-subtle outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[2px] uppercase text-text-subtle mb-2">Betreft</label>
                <input
                  type="text" name="Betreft" placeholder="Bijv. LT77 revisie, FRC1780 beschikbaarheid"
                  className="w-full bg-bg-elevated border border-brand-primary/30 focus:border-brand-accent px-4 py-3 text-sm text-white placeholder-text-subtle outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[2px] uppercase text-text-subtle mb-2">Bericht</label>
                <textarea
                  name="Bericht" rows={5} placeholder="Uw bericht..."
                  className="w-full bg-bg-elevated border border-brand-primary/30 focus:border-brand-accent px-4 py-3 text-sm text-white placeholder-text-subtle outline-none transition-colors resize-none"
                />
              </div>
              <button type="submit"
                className="w-full bg-brand-primary border border-brand-accent py-3.5 text-sm font-bold tracking-wide hover:bg-brand-accent hover:text-bg-primary transition-colors">
                BERICHT VERSTUREN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
