import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Tag, Clock, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

// ─── Guide content ────────────────────────────────────────────────────────────

const GUIDES = {
  'versnellingsbak-identificatie': {
    title: 'Versnellingsbak identificatie',
    description: 'Hoe herkent u welk type versnellingsbak uw Land Rover heeft?',
    readTime: '8 min',
    tags: ['LT76', 'LT77', 'LT85', 'LT95', 'R380'],
    sections: [
      {
        heading: 'Waarom is identificatie belangrijk?',
        body: `Een juiste identificatie van uw versnellingsbak is essentieel voordat u onderdelen bestelt of een revisie uitvoert. Land Rover heeft door de jaren heen vele typen versnellingsbakken gebruikt, en onderdelen zijn vaak niet uitwisselbaar tussen modellen. Een verkeerd besteld onderdeel kost tijd en geld.

De eenvoudigste manier om uw versnellingsbak te identificeren is via het typeplaatje of de casting nummers op de behuizing. Hieronder vindt u een overzicht van de meest voorkomende types.`,
      },
      {
        heading: 'LT76 — Series I, II en IIA (1948–1971)',
        body: `De LT76 (ook wel bekend als de "Series gearbox") is een vierbak met overdrive-optie. Hij werd gebruikt in alle Series I, II en IIA modellen tot 1971.

**Herkenning:** Aluminium behuizing met een plat deksel boven op de bak. De shifter zit direct op de behuizing. Geen synchronized eerste versnelling in vroege versies.

**Typenummer:** Te vinden op een plaatje aan de zijkant van de behuizing, of gegoten in het aluminium.`,
      },
      {
        heading: 'LT77 — Defender, Discovery, Range Rover (1983–1994)',
        body: `De LT77 is een vijfbak die werd geïntroduceerd in 1983. Hij werd gebruikt in de Defender (90/110), eerste generatie Discovery en de classic Range Rover.

**Herkenning:** Grotere aluminium behuizing. De versnellingsknuppel zit hoog en centraal. Er zijn meerdere suffixen (A t/m H) die kleine modificaties aanduiden.

**Suffix identificatie:**
- Suffix A–C: vroege modellen, gladde eerste versnelling
- Suffix D–E: verbeterde synchronisatie
- Suffix F–H: finale versies, meest betrouwbaar

**Casting nummer:** Gegoten in de zijkant van de behuizing, typisch beginnend met FTC of RTC.`,
      },
      {
        heading: 'LT85 — Range Rover V8 (1983–1986)',
        body: `De LT85 werd uitsluitend gebruikt in de Range Rover met de 3.5L V8 motor in de vroege jaren 80. Het is een vijfbak met andere afmetingen dan de LT77.

**Herkenning:** Vergelijkbaar uiterlijk als LT77 maar met een ander typeplaatje. De LT85 had bekende betrouwbaarheidsproblemen en werd snel vervangen door de LT77.

**Let op:** Onderdelen van de LT77 en LT85 zijn NIET uitwisselbaar.`,
      },
      {
        heading: 'LT95 — Gecombineerde bak (1970–1985)',
        body: `De LT95 is uniek: het combineert een vierbak én tussenbak in één behuizing. Gebruikt in de Range Rover Classic (1970–1985) en sommige Defender modellen.

**Herkenning:** Zeer lange behuizing die doorloopt tot de aandrijfassen. Twee shifters: één voor de versnellingen, één voor de tussenbak (High/Low).

**Voordeel:** Compact en sterk. **Nadeel:** Als één component faalt, moet vaak de hele bak eruit.`,
      },
      {
        heading: 'R380 — Defender, Discovery, Range Rover (1994–2007)',
        body: `De R380 verving de LT77 in 1994 en is de meest voorkomende handgeschakelde versnellingsbak in Land Rovers. Hij werd gebruikt in de Defender (1994–2007), Discovery 1 (1994–1999), Discovery 2 (1999–2004) en Range Rover Classic (1994–1995).

**Herkenning:** Vergelijkbaar uiterlijk als LT77 maar met een andere selector-mechanisme. De R380 heeft een typisch kabelbediende koppeling in latere versies.

**Versies:**
- TDI-versie: voor de 2.5 TDI motor
- TD5-versie: voor de 2.5 TD5 motor
- V8-versie: voor de 3.9/4.0L V8

**Casting nummer:** Begint met STC of PRC, te vinden op de bovenste behuizing.`,
      },
      {
        heading: 'MT82 — Defender (2012–2016)',
        body: `De MT82 werd gebruikt in de laatste Defender modellen (2012–2016) met de 2.2L TD4 motor. Het is een zessbak geleverd door Ford/Getrag.

**Herkenning:** Moderne behuizing met 6 versnellingen. De shifter heeft een afwijkende positie vergeleken met oudere modellen.

**Let op:** Onderdelen voor de MT82 zijn beperkt beschikbaar als los onderdeel. Bij slijtage of schade is revisie de aangewezen route.`,
      },
      {
        heading: 'Tabel: snel overzicht',
        body: `| Type  | Versnellingen | Periode    | Modellen                          |
|-------|--------------|------------|-----------------------------------|
| LT76  | 4            | 1948–1971  | Series I, II, IIA                |
| LT77  | 5            | 1983–1994  | Defender, Discovery 1, RR Classic |
| LT85  | 5            | 1983–1986  | Range Rover V8                    |
| LT95  | 4 + transfer | 1970–1985  | Range Rover, Defender             |
| R380  | 5            | 1994–2007  | Defender, Discovery 1&2, RR       |
| MT82  | 6            | 2012–2016  | Defender TD4                      |`,
      },
    ],
  },

  'overzicht-versnellingsbakken': {
    title: 'Overzicht versnellingsbakken per model',
    description: 'Welke versnellingsbak zit in welk Land Rover model en bouwjaar?',
    readTime: '6 min',
    tags: ['Series', 'Defender', 'Discovery', 'Range Rover'],
    sections: [
      {
        heading: 'Series I, II en IIA (1948–1971)',
        body: `Alle Series modellen tot 1971 werden geleverd met de LT76 vierbak. In combinatie met de LT230-tussenbak (of oudere equivalenten) was dit een robuust en onderhoudsvriendelijk systeem.

**Motoren:** 1.6L benzine, 2.0L benzine, 2.25L benzine, 2.25L diesel
**Versnellingsbak:** LT76 (4-versnellingen, gesynchroniseerd vanaf 2e versnelling)
**Tussenbak:** Aparte unit, handmatig te vergrendelen 4WD`,
      },
      {
        heading: 'Series III (1971–1985)',
        body: `De Series III behield de LT76-basis maar met verbeteringen. Een gesynchroniseerde eerste versnelling werd standaard.

**Motoren:** 2.25L benzine, 2.25L diesel, 3.5L V8 (in sommige markten)
**Versnellingsbak:** LT76 (verbeterde versie)
**Tussenbak:** LT230 in latere versies`,
      },
      {
        heading: 'Defender 90/110/130 (1983–2016)',
        body: `De Defender is het model met de meeste versnellingsbak-variaties door zijn lange productietijd.

**1983–1994:** LT77 vijfbak (met LT230 tussenbak)
**1994–2007:** R380 vijfbak (met LT230 tussenbak)
**2007–2011:** R380 (TD4/V8) of automatische gearbox
**2012–2016:** MT82 zessbak (2.2 TD4)

De LT230 tussenbak bleef gedurende de gehele productieperiode grotendeels ongewijzigd — een bewijs van de robuustheid van het ontwerp.`,
      },
      {
        heading: 'Discovery 1 (1989–1998)',
        body: `De Discovery 1 deelde zijn platformonderdelen grotendeels met de Range Rover Classic en Defender.

**1989–1994:** LT77 vijfbak
**1994–1998:** R380 vijfbak
**Automaat:** ZF 4HP22 automaat (optioneel bij V8)
**Tussenbak:** LT230T (met differential lock)`,
      },
      {
        heading: 'Discovery 2 (1999–2004)',
        body: `De Discovery 2 introduceerde een volledig nieuwe carrosserie maar behield bewezen aandrijflijntechnologie.

**Handgeschakeld:** R380 vijfbak (TD5 en V8)
**Automaat:** ZF 4HP22 (V8) of Jatco (TD5 automatisch)
**Tussenbak:** LT230 (verbeterd met viscous coupling)`,
      },
      {
        heading: 'Range Rover Classic (1970–1996)',
        body: `De Range Rover Classic had de langste productierun en daarmee de meeste versnellingsbak-variaties.

**1970–1985:** LT95 gecombineerde bak (exclusief voor RR)
**1983–1986:** LT85 vijfbak (V8, korte periode)
**1986–1994:** LT77 vijfbak
**1994–1996:** R380 vijfbak
**Automaat:** ZF 4HP22 of BorgWarner 65 (V8)`,
      },
    ],
  },

  'rover-v8-motor-nummers': {
    title: 'Rover V8 motor nummers & identificatie',
    description: 'Motorblok nummers, slagvolumes en modificaties van de Rover 3.5–4.6L V8.',
    readTime: '10 min',
    tags: ['V8', 'Motorcode', 'Range Rover', '3.5L', '4.6L'],
    sections: [
      {
        heading: 'Geschiedenis van de Rover V8',
        body: `De Rover V8 heeft zijn wortels in de Buick 215 V8 die Rover in 1965 aankocht. Rover produceerde dit motorblok van 1967 tot 2004 — bijna 40 jaar. In die periode werd het slagvolume vergroot van 3.5L naar 4.6L en werden talloze verbeteringen doorgevoerd.

De motor werd gebruikt in:
- Range Rover Classic (1970–1996)
- Defender (1983–1994, in sommige markten)
- Discovery 1 (1989–1994)
- Range Rover P38a (1994–2002)
- Range Rover L322 (2002–2005, later BMW)`,
      },
      {
        heading: 'Motorblok identificatie — prefix systeem',
        body: `Het motornummer bevindt zich gegoten in het aluminium blok, aan de voorzijde links naast de distributiekast (bezijden de bestuurder).

**Prefix formaat:** [Slagvolume][Specificatie][Revisieletter]

**Slagvolume prefixen:**
- **35D:** 3.5L (3528cc)
- **38D:** 3.9L (3947cc)
- **42D:** 4.2L (4278cc) — alleen Range Rover P38a
- **46D:** 4.6L (4554cc)

**Voorbeeld:** \`46D12345A\` = 4.6L motor, serienummer 12345, suffix A`,
      },
      {
        heading: '3.5L (3528cc) — 1967–1991',
        body: `Het originele slagvolume, direct afgeleid van de Buick 215. Bore 88.9mm × Stroke 71.1mm.

**Versies:**
- **Carburateur (1967–1986):** SU of Zenith-Stromberg carburateurs, 130–150 pk
- **Injectie EFI (1985–1991):** Lucas 14CUX EFI systeem, 165 pk (Range Rover)
- **Federal (USA, 1987–1991):** Strengere emissie-eisen, lager vermogen

**Onderscheid aan blok:** Vroege blokken hebben kleinere waterkanalen. Blokken met "suffix A" of later zijn verbeterd voor betere koeling.`,
      },
      {
        heading: '3.9L (3947cc) — 1989–2002',
        body: `Het 3.9L blok verving het 3.5L in de meeste toepassingen vanaf 1989. Bore vergroot naar 94mm, stroke ongewijzigd 71.1mm.

**Versies:**
- **Lucas 14CUX (1989–1995):** 185 pk, gebruikt in Discovery 1 en Range Rover Classic
- **GEMS (1995–2002):** GEMS motormanagement (Rover-ontwikkeld), 190 pk
- **Thor/Bosch Motronic:** Latere versies voor P38a

**Blok identificatie:** 3.9L blokken zijn te herkennen aan het grotere boring-diameter. Het prefix "38D" is gegoten in het blok.`,
      },
      {
        heading: '4.0L (3950cc) — Range Rover P38a (1994–2002)',
        body: `Technisch identiek aan het 3.9L maar met aangepaste specificaties voor de nieuwe motormanagement-systemen van de P38a.

**GEMS-systeem:** Rover's eigen motormanagement, gevoelig voor condensatie in de ECU (bekend probleem bij P38a)
**Thor-versie (1999–2002):** Bosch Motronic 5.2.1 systeem, betrouwbaarder dan GEMS`,
      },
      {
        heading: '4.6L (4554cc) — Range Rover P38a (1994–2002)',
        body: `Het grootste slagvolume van de Rover V8. Stroke vergroot naar 82mm, bore 94mm.

**Vermogen:** 225 pk (GEMS) / 218 pk (Thor)
**Herkenning:** Langere slagarm in het kijkglas van de olievuldop. Het prefix "46D" is in het blok gegoten.

**Let op:** 4.6L pistons en krukas zijn NIET uitwisselbaar met 3.5/3.9L onderdelen. Controleer altijd het motorprefix voordat u onderdelen bestelt.`,
      },
      {
        heading: 'Veelgemaakte fouten bij identificatie',
        body: `**1. Motorcode vs. chassisnummer**
De motorcode geeft het slagvolume en het type aan. Het chassisnummer (VIN) geeft informatie over het voertuig. Ze zijn beide nodig voor een correcte identificatie.

**2. Blok vervangen**
Een motor kan zijn vervangen in de geschiedenis van het voertuig. Verifieer altijd het motornummer aan het blok zelf, niet alleen de kentekenpapieren.

**3. GEMS vs. Thor**
De GEMS-motormanagement ECU ziet er vergelijkbaar uit als de Thor-ECU maar is NIET uitwisselbaar. Controleer het bouwjaar: vóór 1999 = GEMS, na 1999 = Thor (P38a).

**4. Slagvolume op afstand beoordelen**
Zonder het motornummer is het vrijwel onmogelijk om een 3.9L van een 4.6L te onderscheiden. De buitenkant is nagenoeg identiek.`,
      },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(GUIDES).flatMap(slug =>
    ['nl', 'en'].map(locale => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = GUIDES[slug as keyof typeof GUIDES]
  if (!guide) return {}
  return { title: guide.title, description: guide.description }
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const guide = GUIDES[slug as keyof typeof GUIDES]
  if (!guide) notFound()

  return (
    <div className="min-h-screen pt-16 bg-bg-primary">
      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-bg-card/50">
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-3">
          <div className="flex items-center gap-1.5 text-xs text-text-subtle">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={11} className="text-white/20" />
            <Link href={`/${locale}/gidsen`} className="hover:text-white transition-colors">Gidsen</Link>
            <ChevronRight size={11} className="text-white/20" />
            <span className="text-white/50 truncate">{guide.title}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold px-2.5 py-1 bg-brand-primary/30 text-brand-accent border border-brand-accent/20 tracking-[1.5px] uppercase">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-1px] mb-3">{guide.title}</h1>
          <p className="text-text-muted text-base mb-4 max-w-2xl">{guide.description}</p>
          <div className="flex items-center gap-1.5 text-xs text-text-subtle">
            <Clock size={12} />
            <span>{guide.readTime} leestijd</span>
          </div>
        </div>
      </div>

      {/* Inhoudsopgave + content */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Inhoudsopgave — sticky sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-[10px] font-bold tracking-[2.5px] uppercase text-text-subtle mb-3">Inhoudsopgave</h2>
              <nav className="space-y-1">
                {guide.sections.map((s, i) => (
                  <a key={i} href={`#sectie-${i}`}
                    className="block text-xs text-text-muted hover:text-brand-accent transition-colors py-1 border-l-2 border-transparent hover:border-brand-accent pl-3 leading-tight">
                    {s.heading}
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/8">
                <p className="text-xs text-text-subtle mb-3">Hulp nodig?</p>
                <Link href={`/${locale}/contact`}
                  className="block text-xs text-center py-2.5 px-3 bg-brand-primary/30 border border-brand-accent/20 text-brand-accent hover:bg-brand-primary/50 transition-colors font-semibold">
                  Contacteer ons
                </Link>
              </div>
            </div>
          </aside>

          {/* Artikel */}
          <article className="lg:col-span-3">
            {guide.sections.map((s, i) => (
              <section key={i} id={`sectie-${i}`} className="mb-10 scroll-mt-24">
                <h2 className="text-xl font-extrabold tracking-[-0.5px] mb-4 flex items-center gap-3">
                  <span className="text-[11px] font-bold text-brand-accent/60 w-6 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  {s.heading}
                </h2>
                <div className="text-[15px] text-text-muted leading-relaxed space-y-3 pl-9">
                  {s.body.split('\n\n').map((para, j) => {
                    // Tabel detectie
                    if (para.startsWith('|')) {
                      const rows = para.split('\n').filter(r => r.trim() && !r.match(/^\|[-\s|]+\|$/))
                      return (
                        <div key={j} className="overflow-x-auto -ml-9">
                          <table className="text-xs w-full border-collapse">
                            {rows.map((row, ri) => {
                              const cells = row.split('|').filter(c => c.trim())
                              const Tag = ri === 0 ? 'th' : 'td'
                              return (
                                <tr key={ri} className={ri === 0 ? 'bg-brand-primary/20 text-white' : 'border-t border-white/5 hover:bg-white/3'}>
                                  {cells.map((cell, ci) => (
                                    <Tag key={ci} className={`px-3 py-2 text-left ${ri === 0 ? 'font-bold tracking-wide' : 'text-text-muted'}`}>
                                      {cell.trim()}
                                    </Tag>
                                  ))}
                                </tr>
                              )
                            })}
                          </table>
                        </div>
                      )
                    }
                    // Bold detectie
                    const formatted = para.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                    return <p key={j} dangerouslySetInnerHTML={{ __html: formatted }} />
                  })}
                </div>
              </section>
            ))}

            {/* Tags footer */}
            <div className="pt-8 mt-8 border-t border-white/8 flex flex-wrap items-center gap-2">
              <Tag size={13} className="text-text-subtle" />
              {guide.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-bg-card border border-white/8 text-text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </div>

        {/* Terug naar gidsen */}
        <div className="mt-12 pt-8 border-t border-white/8">
          <Link href={`/${locale}/gidsen`}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-accent transition-colors">
            <ArrowLeft size={14} /> Alle gidsen
          </Link>
        </div>
      </div>
    </div>
  )
}
