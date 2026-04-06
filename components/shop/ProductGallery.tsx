'use client'
import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImageSource } from '@sanity/image-url'

export function ProductGallery({ images }: { images: SanityImageSource[] }) {
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) {
    return <div className="aspect-square bg-bg-card border border-border flex items-center justify-center text-text-subtle text-sm">Geen foto beschikbaar</div>
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Hoofdfoto */}
      <div className="relative aspect-square bg-bg-card border border-border overflow-hidden">
        <Image
          src={urlFor(images[active]).width(600).height(600).url()}
          alt="Product"
          fill
          className="object-contain p-6"
          priority
        />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 border-2 overflow-hidden flex-shrink-0 transition-colors ${
                i === active ? 'border-brand-accent' : 'border-border hover:border-brand-primary'
              }`}
            >
              <Image
                src={urlFor(img).width(64).height(64).url()}
                alt={`Foto ${i + 1}`}
                fill
                loading="lazy"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
