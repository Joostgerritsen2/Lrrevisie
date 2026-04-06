import Link from 'next/link'
import { BookOpen, ArrowRight, Clock, Tag, ChevronRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: 'Technische Gidsen — Land Rover Identificatie & Specificaties',
  description: 'Gratis technische handleidingen voor Land Rover versnellingsbakken, tussenbakken en motoren. Leer uw type herkennen aan de hand van kenmerken en nummers.',
}

const GUIDES = [
  {
    slug: 'versnellingsbak-identificatie',
    title: 'Versnellingsbak identificatie',
    description: 'Hoe herkent u welk type versnellingsbak uw Land Rover heeft? Met foto\'s en maatvoering van de LT76, LT77, LT85, LT95 en R380.',
    tags: ['LT76', 'LT77', 'LT85', 'LT95', 'R380'],
    leestijd: '8 min',
    featured: true,
    category: 'Versnellingsbak',
  },
  {
    slug: 'overzicht-versnellingsbakken',
    title: 'Overzicht versnellingsbakken per model',
    description: 'Welke versnellingsbak zit in uw Land Rover? Compleet overzicht per model én bouwjaar — van Series tot Defender, Discovery en Range Rover.',
    tags: ['Series', 'Defender', 'Discovery', 'Range Rover'],
    leestijd: '12 min',
    featured: false,
    category: 'Versnellingsbak',
  },
  {
    slug: 'rover-v8-motor-nummers',
    title: 'Rover V8 motor nummers uitgelegd',
    description: 'Stap-voor-stap uitleg over motor- en chassisnummers van de Rover V8. Achterhaal de exacte specificaties van uw motor aan de hand van de code.',
    tags: ['V8', 'Motorcode', 'Range Rover', 'Defender'],
    leestijd: '6 min',
    featured: false,
    category: 'Motor',
  },
]

const CATEGORIES = ['Alle', 'Versnellingsbak', 'Motor', 'Differentieel', 'Tussenbak']

export default async function GidsenPage({ params }: PageProps) {
  const { locale } = await params
  const featured = GUIDES.find(g => g.featured)
  const rest = GUIDES.filter(g => !g.featured)

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-warm border-b border-white/6 px-5 md:px-10 pt-24 pb-7 md:pt-28 md:pb-9">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-subtle mb-4">
            <a href={`/${locale}`} className="hover:text-white transition-colors">Home</a>
            <span className="text-white/20 mx-1">›</span>
            <span className="text-brand-accent">Gidsen</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">{GUIDES.length} gratis gidsen</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-1.5px] leading-tight mb-3">Technische Gidsen</h1>
          <p className="text-text-muted max-w-xl leading-relaxed">
            Identificeer uw versnellingsbak, motor of differentieel. Geschreven door onze specialisten op basis van 30+ jaar werkplaatservaring.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-16">

        {/* Uitgelichte gids */}
        {featured && (
          <div className="mb-12">
            <Link href={`/${locale}/gidsen/${featured.slug}`}
              className="group flex flex-col md:flex-row gap-0 border border-brand-primary/20 hover:border-brand-accent/40 transition-all bg-bg-grey-card overflow-hidden">
              {/* Groene accent kolom */}
              <div className="w-full md:w-1.5 h-1.5 md:h-auto bg-brand-accent flex-shrink-0" />
              <div className="p-7 md:p-10 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1">
                    Aanbevolen
                  </span>
                  <span className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide">{featured.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.5px] mb-3 group-hover:text-brand-accent transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-text-muted leading-relaxed mb-6 max-w-2xl">{featured.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {featured.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-brand-primary/20 text-brand-accent/80 border border-brand-accent/15">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-subtle ml-auto">
                    <Clock size={11} />
                    {featured.leestijd} leestijd
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-brand-accent group-hover:gap-2.5 transition-all">
                    Lees gids <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Overige gidsen */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-0.5 bg-brand-accent" />
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Alle gidsen</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 mb-16">
          {GUIDES.map(guide => (
            <Link key={guide.slug} href={`/${locale}/gidsen/${guide.slug}`}
              className="group flex flex-col p-6 bg-bg-grey-card border border-brand-primary/20 hover:border-brand-accent/40 transition-all accent-line-top">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 flex items-center justify-center bg-brand-primary/30 border border-brand-accent/15 group-hover:border-brand-accent/50 transition-colors">
                  <BookOpen size={14} className="text-brand-accent" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-text-subtle">
                  <Clock size={10} />
                  {guide.leestijd}
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-brand-accent/60 mb-2">{guide.category}</span>
              <h3 className="text-[15px] font-bold text-white mb-2 leading-tight group-hover:text-brand-accent transition-colors">{guide.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">{guide.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {guide.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-brand-primary/20 text-brand-accent/80 border border-brand-accent/15">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-accent/60 group-hover:text-brand-accent group-hover:gap-2 transition-all mt-auto pt-3 border-t border-white/5">
                Lees gids <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA — eigen onderdeel */}
        <div className="bg-bg-green border border-brand-primary/30 p-7 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-extrabold tracking-[-0.3px] mb-1">Weet u nog steeds niet wat u heeft?</h3>
            <p className="text-sm text-text-muted">Stuur ons een foto of het chassisnummer — wij identificeren het gratis.</p>
          </div>
          <Link href={`/${locale}/contact`}
            className="flex items-center gap-2 bg-brand-accent px-6 py-3 text-sm font-bold text-bg-primary hover:bg-brand-accent/90 transition-colors flex-shrink-0">
            Vraag het ons <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
