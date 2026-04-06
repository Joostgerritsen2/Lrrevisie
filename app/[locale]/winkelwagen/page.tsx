'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'
import { useParams } from 'next/navigation'

export default function WinkelwagenPage() {
  const locale = (useParams()?.locale as string) ?? 'nl'
  const { items, removeItem, updateQuantity, total } = useCartStore()

  const subtotaal = total()
  const verzending = subtotaal > 0 && subtotaal < 15000 ? 895 : 0
  const totaal = subtotaal + verzending

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 flex items-center justify-center bg-brand-primary/20 border border-brand-accent/20 mb-6">
          <ShoppingBag size={28} className="text-brand-accent/60" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">Je winkelwagen is leeg</h1>
        <p className="text-text-muted text-sm mb-8">Voeg producten toe om hier te beginnen.</p>
        <Link
          href={`/${locale}/winkel`}
          className="flex items-center gap-2 bg-brand-primary border border-brand-accent/70 px-6 py-3 text-sm font-bold hover:bg-brand-accent transition-all"
        >
          <ArrowLeft size={14} /> Ga naar de winkel
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-bg-green border-b border-brand-primary/30 px-5 md:px-10 py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-brand-accent tracking-[2px] uppercase mb-2">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">Home</Link>
            <span className="mx-1.5">/</span>
            Winkelwagen
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-1px]">Winkelwagen</h1>
          <p className="text-text-muted text-sm mt-1">{items.reduce((n, i) => n + i.quantity, 0)} artikel{items.length !== 1 ? 'en' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Items */}
          <div className="lg:col-span-2 space-y-0.5">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-bg-card border border-brand-primary/20">
                {/* Afbeelding */}
                <div className="w-20 h-20 flex-shrink-0 bg-bg-elevated border border-white/5 overflow-hidden">
                  {item.afbeeldingUrl ? (
                    <Image src={item.afbeeldingUrl} alt={item.naam} width={80} height={80} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={20} className="text-white/10" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${locale}/winkel/${item.categorie}/${item.slug}`}
                    className="text-sm font-semibold text-white hover:text-brand-accent transition-colors line-clamp-2 leading-tight mb-1"
                  >
                    {item.naam}
                  </Link>
                  <div className="text-xs font-mono text-text-subtle mb-3">{item.artikelnummer}</div>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Aantal */}
                    <div className="flex items-center border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-extrabold text-brand-accent">{formatPrice(item.prijs * item.quantity)}</span>
                      {item.quantity > 1 && (
                        <span className="text-xs text-text-subtle">{formatPrice(item.prijs)} p/st</span>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-subtle hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href={`/${locale}/winkel`}
                className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-brand-accent transition-colors"
              >
                <ArrowLeft size={12} /> Verder winkelen
              </Link>
            </div>
          </div>

          {/* Sidebar — samenvatting */}
          <div className="lg:col-span-1">
            <div className="bg-bg-card border border-brand-primary/20 p-6 sticky top-20">
              <h2 className="text-sm font-bold tracking-[2px] uppercase text-text-subtle mb-5">Overzicht</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotaal</span>
                  <span className="font-semibold">{formatPrice(subtotaal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Verzending</span>
                  <span className={verzending === 0 ? 'text-brand-accent font-semibold' : 'font-semibold'}>
                    {verzending === 0 ? 'Gratis' : formatPrice(verzending)}
                  </span>
                </div>
                {verzending === 0 && subtotaal > 0 && (
                  <p className="text-xs text-brand-accent/70">Gratis verzending boven €150</p>
                )}
                {verzending > 0 && (
                  <p className="text-xs text-text-subtle">
                    Nog {formatPrice(15000 - subtotaal)} tot gratis verzending
                  </p>
                )}
              </div>

              <div className="border-t border-white/8 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Totaal</span>
                  <span className="text-xl font-extrabold text-brand-accent">{formatPrice(totaal)}</span>
                </div>
                <p className="text-[11px] text-text-subtle mt-1">Incl. BTW</p>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-brand-accent px-4 py-3.5 text-sm font-bold text-bg-primary hover:bg-brand-accent/90 transition-colors mb-3">
                Afrekenen <ArrowRight size={14} />
              </button>
              <p className="text-[11px] text-text-subtle text-center">Veilig betalen via iDEAL, Bancontact, Visa of Mastercard</p>

              {/* Trust badges */}
              <div className="mt-6 pt-5 border-t border-white/8 space-y-3">
                {[
                  { icon: ShieldCheck, text: '2 jaar garantie op revisie' },
                  { icon: Truck, text: 'Verzending naar heel Europa' },
                  { icon: RotateCcw, text: '14 dagen retourrecht' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-text-muted">
                    <Icon size={13} className="text-brand-accent flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
