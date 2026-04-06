import Link from 'next/link'
import { ChevronRight, Send, Clock, ShieldCheck } from 'lucide-react'

interface PageProps { params: Promise<{ locale: string }> }

export const metadata = {
  title: 'Offerte aanvragen',
  description: 'Vraag een offerte aan voor een specifiek Land Rover onderdeel of revisie.',
}

export default async function OffertePage({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen pt-16 bg-bg-primary">
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-subtle mb-3">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={11} className="text-white/20" />
            <span className="text-brand-accent">Offerte aanvragen</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-1px] mb-2">Offerte aanvragen</h1>
          <p className="text-text-muted max-w-xl">Staat het onderdeel dat u zoekt niet in de winkel, of wilt u een prijs op maat? Vul het formulier in en wij nemen zo snel mogelijk contact op.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Formulier */}
          <div className="lg:col-span-2">
            <form className="space-y-5" action="#" method="post">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle block mb-1.5">Naam *</label>
                  <input required name="naam" type="text" placeholder="Uw naam"
                    className="w-full bg-bg-card border border-brand-primary/30 focus:border-brand-accent/60 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle block mb-1.5">E-mail *</label>
                  <input required name="email" type="email" placeholder="uw@email.nl"
                    className="w-full bg-bg-card border border-brand-primary/30 focus:border-brand-accent/60 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle block mb-1.5">Telefoon</label>
                  <input name="telefoon" type="tel" placeholder="+31 6..."
                    className="w-full bg-bg-card border border-brand-primary/30 focus:border-brand-accent/60 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle block mb-1.5">Land Rover model</label>
                  <select name="model"
                    className="w-full bg-bg-card border border-brand-primary/30 focus:border-brand-accent/60 px-4 py-3 text-sm text-white outline-none transition-colors cursor-pointer">
                    <option value="">Selecteer model</option>
                    <option>Defender 90/110/130</option>
                    <option>Discovery 1</option>
                    <option>Discovery 2</option>
                    <option>Range Rover Classic</option>
                    <option>Range Rover P38a</option>
                    <option>Series I / II / III</option>
                    <option>Anders</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle block mb-1.5">Artikelnummer / onderdeel *</label>
                <input required name="artikelnummer" type="text" placeholder="Bijv. FRC1780, of omschrijving van het onderdeel"
                  className="w-full bg-bg-card border border-brand-primary/30 focus:border-brand-accent/60 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle block mb-1.5">Aanvullende informatie</label>
                <textarea name="bericht" rows={4} placeholder="Bouwjaar, chassisnummer, hoeveelheid of andere relevante details..."
                  className="w-full bg-bg-card border border-brand-primary/30 focus:border-brand-accent/60 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors resize-none" />
              </div>

              <button type="submit"
                className="flex items-center gap-2 bg-brand-accent px-7 py-3.5 text-sm font-bold text-bg-primary hover:bg-brand-accent/90 transition-colors">
                <Send size={14} /> Offerte aanvragen
              </button>

              <p className="text-xs text-text-subtle">* Verplichte velden. Wij reageren binnen 1 werkdag.</p>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {[
              { icon: Clock, title: 'Reactie binnen 24 uur', body: 'Op werkdagen reageren wij doorgaans binnen een werkdag op uw aanvraag.' },
              { icon: ShieldCheck, title: 'Eerlijke prijzen', body: 'Geen verborgen kosten. U ontvangt een heldere offerte met alle details.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-3 p-4 bg-bg-card border border-brand-primary/20">
                <Icon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold mb-1">{title}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{body}</p>
                </div>
              </div>
            ))}

            <div className="p-4 bg-bg-card border border-brand-primary/20">
              <p className="text-xs font-bold mb-2">Of direct bellen</p>
              <a href="tel:+31612345678" className="text-brand-accent font-bold text-sm hover:underline">+31 6 12 34 56 78</a>
              <p className="text-xs text-text-muted mt-1">Ma–Vr 08:30–17:00</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
