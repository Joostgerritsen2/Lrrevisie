import { ChevronDown } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: 'FAQ — Veelgestelde vragen',
  description: 'Antwoorden op veelgestelde vragen over bestellen, verzending, retour en revisie bij LR Revisie.',
}

const FAQS = [
  {
    v: 'Kan ik ook mijn eigen onderdeel opsturen voor revisie?',
    a: 'Ja, dat kan. Neem eerst contact op via e-mail of telefoon. U ontvangt dan instructies voor het opsturen en een prijsopgave voor de revisie van uw onderdeel.',
  },
  {
    v: 'Wordt er exclusief of inclusief BTW vermeld?',
    a: 'Alle prijzen op de website zijn exclusief 21% BTW, tenzij anders vermeld. BTW wordt toegevoegd bij het afrekenen.',
  },
  {
    v: 'Wat zijn de verzendkosten?',
    a: 'Verzendkosten zijn afhankelijk van het gewicht en de bestemming. U ziet de exacte kosten bij het afrekenen. Zware onderdelen zoals complete versnellingsbakken worden op maat geprijsd.',
  },
  {
    v: 'Hoe lang duurt levering?',
    a: 'Voorraadartikelen worden normaal gesproken binnen 1-3 werkdagen geleverd in Nederland en België. Voor grotere onderdelen of internationaal kan dit langer duren.',
  },
  {
    v: 'Kan ik een artikel retourneren?',
    a: 'Ja, u heeft 14 dagen bedenktijd. Het artikel moet ongebruikt en in originele verpakking zijn. Neem contact op voor retourinstructies. Let op: gereviseerde onderdelen die geïnstalleerd zijn, kunnen niet worden geretourneerd.',
  },
  {
    v: 'Welke Land Rover modellen worden ondersteund?',
    a: 'LR Revisie is gespecialiseerd in Series I/II/III, Defender 90/110/130, Discovery 1/2, Range Rover Classic en Range Rover P38. Neem contact op als u twijfelt of uw model ondersteund wordt.',
  },
  {
    v: 'Hoe weet ik welk type versnellingsbak ik heb?',
    a: 'Bekijk onze technische gidsen voor identificatiekenmerken van de LT76, LT77, LT85, LT95, LT230, R380 en ZF automaat. U kunt ook het chassisnummer meesturen bij uw vraag.',
  },
  {
    v: 'Kan ik betalen met iDEAL?',
    a: 'Ja, we accepteren iDEAL, Bancontact, Mastercard en Visa. Betaling verloopt veilig via Mollie.',
  },
]

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 pt-28 pb-10 md:pt-32 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-subtle mb-4 flex-wrap">
            <a href={`/${locale}`} className="hover:text-white transition-colors">Home</a>
            <span className="text-white/20 mx-1">›</span>
            <span className="text-brand-accent">FAQ</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Klantenservice</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-1.5px] leading-tight text-white mb-3">Veelgestelde vragen</h1>
          <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed">Antwoorden op de meest gestelde vragen over bestellen, verzending, retour en revisie.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-14">
        <div className="space-y-0.5">
          {FAQS.map((faq, i) => (
            <details key={i} className="group bg-bg-card border border-brand-primary/20 open:border-brand-accent/30">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-bg-elevated transition-colors">
                <span className="text-sm font-semibold text-white pr-4">{faq.v}</span>
                <ChevronDown size={16} className="text-brand-accent flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 pt-0 text-sm text-text-muted leading-relaxed border-t border-white/5">
                <p className="pt-4">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 p-6 bg-bg-card border border-brand-primary/20 border-l-2 border-l-brand-accent">
          <h3 className="text-sm font-bold text-white mb-2">Staat uw vraag er niet bij?</h3>
          <p className="text-sm text-text-muted mb-4">Neem direct contact op — we helpen u graag persoonlijk.</p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-brand-primary border border-brand-accent px-5 py-2.5 text-sm font-bold hover:bg-brand-accent transition-colors"
          >
            Contact opnemen
          </a>
        </div>
      </div>
    </div>
  )
}
