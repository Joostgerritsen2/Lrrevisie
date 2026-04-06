import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: 'Gidsen',
  description: 'Technische gidsen en handleidingen voor Land Rover versnellingsbakken, tussenbakken en identificatie.',
}

const GUIDES = [
  {
    slug: 'versnellingsbak-identificatie',
    title: 'Versnellingsbak identificatie',
    description: 'Hoe herkent u welk type versnellingsbak uw Land Rover heeft? Lees over de identificatiekenmerken van LT76, LT77, LT85, LT95 en R380.',
    tags: ['LT76', 'LT77', 'LT85', 'LT95', 'R380'],
  },
  {
    slug: 'overzicht-versnellingsbakken',
    title: 'Overzicht versnellingsbakken',
    description: 'Een volledig overzicht van alle versnellingsbakken die Land Rover heeft gebruikt, per model en bouwjaar.',
    tags: ['Series', 'Defender', 'Discovery', 'Range Rover'],
  },
  {
    slug: 'rover-v8-motor-nummers',
    title: 'Rover V8 motor nummers',
    description: 'Uitleg over de motor- en chassisnummers van de Rover V8 motor en hoe u de specificaties van uw motor kunt achterhalen.',
    tags: ['V8', 'Motorcode', 'Range Rover'],
  },
]

export default async function GidsenPage({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-brand-accent tracking-[2px] uppercase mb-2">
            <a href={`/${locale}`} className="hover:text-white transition-colors">Home</a>
            <span className="mx-1.5">/</span>
            Gidsen
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-1px]">Technische Gidsen</h1>
          <p className="text-text-muted mt-2">Identificatie, specificaties en handleidingen voor Land Rover</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-14">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-0.5 bg-brand-accent" />
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">{GUIDES.length} gidsen</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-[-0.5px] mb-10">Alle gidsen</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {GUIDES.map(guide => (
            <Link
              key={guide.slug}
              href={`/${locale}/gidsen/${guide.slug}`}
              className="group flex flex-col p-6 bg-bg-card border border-brand-primary/20 hover:bg-bg-elevated hover:border-brand-accent/40 transition-all accent-line-top"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-brand-primary/30 border border-brand-accent/15 mb-4 group-hover:border-brand-accent/50 transition-colors">
                <BookOpen size={15} className="text-brand-accent" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2 leading-tight">{guide.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">{guide.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {guide.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-brand-primary/20 text-brand-accent/80 border border-brand-accent/15">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-accent/60 group-hover:text-brand-accent transition-colors mt-auto pt-3 border-t border-white/5">
                Lees gids
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
