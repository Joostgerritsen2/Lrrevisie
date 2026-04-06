'use client'
import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/lib/sanity/image'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  _id: string
  naam: string
  artikelnummer: string
  slug: string
  prijs: number
  afbeelding?: SanityImageSource
  categorie: { naam: string; slug: string }
}

export function NavSearch({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', down)
    return () => document.removeEventListener('mousedown', down)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
      setOpen(true)
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 bg-white/6 border border-white/10 px-3 py-2 min-w-[200px]">
        <Search size={14} className="text-white/40" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('search')}
          className="bg-transparent text-sm text-white placeholder-white/40 outline-none w-full"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 min-w-[320px] bg-bg-card border border-border z-50 shadow-xl">
          {results.map(r => (
            <Link
              key={r._id}
              href={`/${locale}/winkel/${r.categorie.slug}/${r.slug}`}
              onClick={() => { setOpen(false); setQuery('') }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors border-b border-border last:border-0"
            >
              {r.afbeelding && (
                <Image
                  src={urlFor(r.afbeelding).width(48).height(48).url()}
                  alt={r.naam}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{r.naam}</div>
                <div className="text-xs text-text-muted">{r.artikelnummer}</div>
              </div>
              <div className="text-sm font-bold text-brand-accent">{formatPrice(r.prijs)}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
