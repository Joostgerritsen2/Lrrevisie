import Link from 'next/link'
import { Package, Wrench, CheckCircle2, ArrowRight, Phone, Clock, ShieldCheck, Truck, Star } from 'lucide-react'
import { PageVideoHero } from '@/components/layout/PageVideoHero'

interface PageProps { params: Promise<{ locale: string }> }

export const metadata = {
  title: 'Revisie Service — Stuur uw bak in',
  description: 'Stuur uw versnellingsbak, tussenbak of differentieel in voor een vakkundige revisie door LR Revisie.',
}

const STEPS = [
  { num: '01', icon: Phone,        title: 'Contact opnemen',      body: 'Bel of mail ons vooraf zodat we de revisie kunnen inplannen en u een prijsindicatie krijgt.' },
  { num: '02', icon: Truck,        title: 'Inzenden',             body: 'Stuur uw onderdeel goed verpakt naar ons werkplaatsadres. Wij helpen u met de juiste verpakking.' },
  { num: '03', icon: Wrench,       title: 'Diagnose & offerte',   body: 'Na ontvangst doen wij een grondige diagnose en sturen een gedetailleerde offerte voor de revisie.' },
  { num: '04', icon: CheckCircle2, title: 'Revisie',              body: 'Na uw akkoord reviseren wij het onderdeel volledig: reiniging, meting, vervanging van slitage-onderdelen en eindtest.' },
  { num: '05', icon: Package,      title: 'Retour zending',       body: 'Het gereviseerde onderdeel wordt zorgvuldig ingepakt en retour gezonden, inclusief revisie-certificaat.' },
]

const REVISIES = [
  { name: 'Versnellingsbak revisie',    types: ['LT77', 'R380', 'MT82'],            prijs: 'Vanaf €450',  tijd: '3–7 werkdagen' },
  { name: 'Tussenbak revisie',          types: ['LT230'],                           prijs: 'Vanaf €350',  tijd: '3–5 werkdagen' },
  { name: 'Differentieel revisie',      types: ['Dana 44', 'Dana 60', 'Rover diff'], prijs: 'Vanaf €280',  tijd: '2–5 werkdagen' },
  { name: 'Stuurhuis revisie',          types: ['Adwest', 'ZF'],                    prijs: 'Vanaf €320',  tijd: '3–5 werkdagen' },
  { name: 'Cilinderkop revisie',        types: ['TDI', 'TD5', 'V8'],               prijs: 'Vanaf €380',  tijd: '5–10 werkdagen' },
]

export default async function RevisieServicePage({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-bg-primary">
      <PageVideoHero
        eyebrow="30+ jaar ervaring"
        title={`Stuur uw bak in\nvoor revisie`}
        subtitle="Vakkundige revisie van versnellingsbakken, tussenbakken, differentielen en stuurhuizen voor alle Land Rover en Range Rover modellen."
        breadcrumbs={[
          { label: 'Home', href: `/${locale}` },
          { label: 'Revisie Service' },
        ]}
        height="lg"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/${locale}/contact`}
            className="flex items-center gap-2 bg-brand-accent px-6 py-3.5 text-sm font-bold text-bg-primary hover:bg-brand-accent/90 transition-colors">
            <Phone size={14} /> Bel voor een afspraak
          </Link>
          <Link href={`/${locale}/offerte`}
            className="flex items-center gap-2 bg-bg-primary/50 border border-brand-accent/40 px-6 py-3.5 text-sm font-bold hover:border-brand-accent transition-colors">
            Offerte aanvragen <ArrowRight size={14} />
          </Link>
        </div>
      </PageVideoHero>

      {/* USP balk */}
      <div className="border-b border-white/5 bg-bg-grey px-5 md:px-10 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 md:gap-10">
          {[
            { icon: Star,         text: '30+ jaar specialistische kennis' },
            { icon: ShieldCheck,  text: '2 jaar garantie op revisie' },
            { icon: Truck,        text: 'Verzending door heel Europa' },
            { icon: Clock,        text: 'Snelle doorlooptijd' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm text-text-muted">
              <Icon size={14} className="text-brand-accent flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-10 py-14">

        {/* Hoe werkt het */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Werkwijze</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.5px] mb-10">Hoe werkt het?</h2>

          <div className="relative">
            {/* Verticale lijn */}
            <div className="absolute left-[19px] top-8 bottom-8 w-px bg-brand-primary/40 hidden md:block" />

            <div className="space-y-0.5">
              {STEPS.map(step => {
                const Icon = step.icon
                return (
                  <div key={step.num} className="flex gap-5 p-5 bg-bg-grey-card border border-white/6 hover:border-brand-accent/30 transition-colors group">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand-primary/30 border border-brand-accent/20 group-hover:border-brand-accent/50 transition-colors">
                      <Icon size={16} className="text-brand-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-brand-accent/50">{step.num}</span>
                        <h3 className="text-sm font-bold">{step.title}</h3>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Prijsoverzicht */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Tarieven</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.5px] mb-2">Indicatieve prijzen</h2>
          <p className="text-sm text-text-muted mb-8">Definitieve prijs na diagnose. Prijzen exclusief verzendkosten.</p>

          <div className="border border-brand-primary/20 overflow-hidden">
            {REVISIES.map((r, i) => (
              <div key={r.name} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 ${i !== REVISIES.length - 1 ? 'border-b border-brand-primary/20' : ''} hover:bg-bg-card transition-colors`}>
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {r.types.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-brand-primary/20 border border-brand-accent/15 text-brand-accent/70 font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right flex-shrink-0">
                  <div>
                    <p className="text-[10px] text-text-subtle uppercase tracking-wide">Doorlooptijd</p>
                    <p className="text-sm font-semibold">{r.tijd}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-subtle uppercase tracking-wide">Prijs</p>
                    <p className="text-sm font-bold text-brand-accent">{r.prijs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-subtle mt-3">* Alle prijzen zijn inclusief BTW. Na ontvangst en diagnose ontvangt u een definitieve offerte.</p>
        </div>

        {/* CTA */}
        <div className="bg-bg-green border border-brand-primary/30 p-8 md:p-10 text-center">
          <h2 className="text-2xl font-extrabold tracking-[-0.5px] mb-2">Klaar om uw onderdeel in te sturen?</h2>
          <p className="text-text-muted text-sm mb-6">Neem contact op of vraag direct een offerte aan.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${locale}/offerte`}
              className="flex items-center justify-center gap-2 bg-brand-accent px-7 py-3.5 text-sm font-bold text-bg-primary hover:bg-brand-accent/90 transition-colors">
              Offerte aanvragen <ArrowRight size={14} />
            </Link>
            <Link href={`/${locale}/contact`}
              className="flex items-center justify-center gap-2 border border-white/20 px-7 py-3.5 text-sm font-bold hover:border-white/40 transition-colors">
              <Phone size={14} /> Contact opnemen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
