'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

interface ProductFilterProps {
  total: number
  filtered: number
}

export function ProductFilter({ total, filtered }: ProductFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const sort     = searchParams.get('sort') ?? 'naam'
  const voorraad = searchParams.get('voorraad') ?? 'all'
  const minParam = searchParams.get('min') ?? ''
  const maxParam = searchParams.get('max') ?? ''

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === '' || value === 'all' || value === 'naam') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function reset() {
    router.push(pathname, { scroll: false })
  }

  const activeCount = [
    sort !== 'naam',
    voorraad !== 'all',
    minParam !== '',
    maxParam !== '',
  ].filter(Boolean).length

  return (
    <div className="mb-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Toggle knop */}
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-3.5 py-2 bg-bg-card border border-brand-primary/30 hover:border-brand-accent/50 text-sm font-semibold transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 bg-brand-accent text-bg-primary text-[10px] font-black flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Sortering — altijd zichtbaar */}
        <select
          value={sort}
          onChange={e => update('sort', e.target.value)}
          className="px-3 py-2 bg-bg-card border border-brand-primary/30 hover:border-brand-accent/40 text-sm text-white outline-none cursor-pointer transition-colors"
        >
          <option value="naam">Naam A–Z</option>
          <option value="prijs-asc">Prijs laag–hoog</option>
          <option value="prijs-desc">Prijs hoog–laag</option>
        </select>

        {/* Op voorraad toggle */}
        <button
          onClick={() => update('voorraad', voorraad === 'op-voorraad' ? 'all' : 'op-voorraad')}
          className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold border transition-colors
            ${voorraad === 'op-voorraad'
              ? 'bg-brand-accent/15 border-brand-accent text-brand-accent'
              : 'bg-bg-card border-brand-primary/30 text-text-muted hover:border-brand-accent/40'
            }`}
        >
          <span className={`w-2 h-2 rounded-full ${voorraad === 'op-voorraad' ? 'bg-brand-accent' : 'bg-white/20'}`} />
          Op voorraad
        </button>

        {/* Reset */}
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-text-muted hover:text-white transition-colors"
          >
            <X size={12} /> Wis filters
          </button>
        )}

        {/* Resultaat teller */}
        <span className="ml-auto text-xs text-text-subtle">
          {filtered === total ? `${total} producten` : `${filtered} van ${total}`}
        </span>
      </div>

      {/* Uitklapbaar: prijsfilter */}
      {open && (
        <div className="flex flex-wrap gap-4 p-4 bg-bg-card border border-brand-primary/20 mb-4">
          <div>
            <label className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle block mb-1.5">Min. prijs (€)</label>
            <input
              type="number"
              min={0}
              placeholder="0"
              defaultValue={minParam}
              onBlur={e => update('min', e.target.value)}
              className="w-28 bg-bg-elevated border border-white/10 px-3 py-1.5 text-sm text-white outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[2px] uppercase text-text-subtle block mb-1.5">Max. prijs (€)</label>
            <input
              type="number"
              min={0}
              placeholder="Onbeperkt"
              defaultValue={maxParam}
              onBlur={e => update('max', e.target.value)}
              className="w-28 bg-bg-elevated border border-white/10 px-3 py-1.5 text-sm text-white outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  )
}
