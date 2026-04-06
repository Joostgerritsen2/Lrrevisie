'use client'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImageSource } from '@sanity/image-url'

interface Props {
  id: string
  naam: string
  artikelnummer: string
  slug: string
  categorie: string
  prijs: number
  afbeelding?: SanityImageSource
}

export function AddToCartButton({ id, naam, artikelnummer, slug, categorie, prijs, afbeelding }: Props) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = () => {
    addItem({
      id, naam, artikelnummer, slug, categorie, prijs,
      afbeeldingUrl: afbeelding ? urlFor(afbeelding).width(200).url() : undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className="flex items-center gap-3 w-full bg-brand-primary border-2 border-brand-accent px-8 py-4 text-sm font-bold tracking-wide hover:bg-brand-accent transition-colors"
    >
      {added ? <Check size={16} /> : <ShoppingCart size={16} />}
      {added ? 'Toegevoegd!' : 'In winkelwagen'}
    </button>
  )
}
