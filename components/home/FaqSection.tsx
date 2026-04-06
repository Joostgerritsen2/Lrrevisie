'use client'

const FAQS = [
  {
    vraag: 'Welke versnellingsbakken kunt u reviseren?',
    antwoord: 'Wij reviseren alle gangbare Land Rover versnellingsbakken: LT76, LT77, LT85, LT95, R380 en de ZF-automaat. Ook tussenbakken (LT230, LT95T) en differentielen voor Series, Defender, Discovery en Range Rover.',
  },
  {
    vraag: 'Kan ik mijn eigen versnellingsbak opsturen voor revisie?',
    antwoord: 'Ja, u kunt uw eigen unit opsturen. Na ontvangst beoordelen we de staat en sturen we een vrijblijvende prijsopgave. Na akkoord reviseren we de bak volledig met nieuwe lagers, afdichtingen en slijtagedelen. Neem eerst contact op voor verzendspecificaties.',
  },
  {
    vraag: 'Hoe lang duurt een revisie?',
    antwoord: 'Standaard revisie duurt 5–10 werkdagen na ontvangst van uw onderdeel. In de meeste gevallen sturen we een gereviseerde unit retour nog voordat de uw eigen unit klaar is, zodat uw Land Rover zo min mogelijk stil staat.',
  },
  {
    vraag: 'Leveren jullie ook naar het buitenland?',
    antwoord: 'Ja, wij leveren door heel Europa. Producten uit onze webshop worden verzonden via DPD of UPS met track & trace. Contacteer ons voor tarieven buiten Europa.',
  },
  {
    vraag: 'Hoe weet ik welk type versnellingsbak mijn Land Rover heeft?',
    antwoord: 'Het type is te herkennen aan de behuizing, de afmetingen en het serienummer. Op onze gidsen-pagina vindt u een uitgebreide identificatiegids met foto\'s en maatvoering voor alle gangbare types. Twijfelt u? Stuur ons een foto — wij identificeren het gratis.',
  },
  {
    vraag: 'Geven jullie garantie op gereviseerde onderdelen?',
    antwoord: 'Ja, op alle door ons gereviseerde onderdelen geven wij 12 maanden garantie op materiaal- en arbeidsfouten, bij normaal gebruik en correcte montage. Op webshop-onderdelen geldt de wettelijke garantie.',
  },
]

export function FaqSection({ locale }: { locale: string }) {
  return (
    <section className="bg-bg-warm border-t border-white/6 py-16 md:py-24 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Left: header */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-brand-accent" />
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Veelgestelde vragen</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-1px] mb-4">
              Alles wat u wilt weten
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              Staat uw vraag er niet bij? Neem gerust contact op — wij helpen u persoonlijk verder.
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-accent hover:text-brand-accent/80 transition-colors"
            >
              Stel uw vraag →
            </a>
          </div>

          {/* Right: FAQ list */}
          <div className="lg:col-span-2 space-y-0">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group border-t border-white/10 last:border-b"
              >
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none select-none text-sm font-semibold text-white hover:text-brand-accent transition-colors">
                  {faq.vraag}
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center border border-white/20 group-open:border-brand-accent/40 group-open:bg-brand-accent/10 transition-colors text-xs text-text-subtle group-open:text-brand-accent">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform group-open:rotate-45" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 1v8M1 5h8" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-5 text-sm text-text-muted leading-relaxed pr-9">
                  {faq.antwoord}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* JSON-LD structured data for SEO / LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(faq => ({
              '@type': 'Question',
              name: faq.vraag,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.antwoord,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
