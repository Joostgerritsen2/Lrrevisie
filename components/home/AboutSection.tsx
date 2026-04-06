import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImageSource } from '@sanity/image-url'

interface AboutSectionProps {
  eigenaarNaam?: string
  eigenaarBio?: string
  eigenaarFoto?: SanityImageSource
}

export function AboutSection({ eigenaarNaam, eigenaarBio, eigenaarFoto }: AboutSectionProps) {
  return (
    <section className="bg-[#020806] py-20 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-20 items-center">
        {/* Tekst + stats */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-0.5 bg-brand-accent" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-brand-accent">Over ons</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-[-1px] mb-4">
            De Land Rover specialist in Nederland
          </h2>
          <p className="text-sm text-text-muted leading-[1.85] mb-9">
            {eigenaarBio || 'Al meer dan 30 jaar reviseren wij versnellingsbakken, tussenbakken, differentielen en stuurhuizen voor Land Rover en Range Rover voertuigen. Elk onderdeel wordt vakkundig gereviseerd en getest voordat het de deur uitgaat.'}
          </p>
          {/* Stats grid */}
          <div className="grid grid-cols-2 border border-brand-primary/20">
            {[
              { num: '30+', label: 'Jaar ervaring' },
              { num: '418', label: 'Op voorraad' },
              { num: 'NL & BE', label: 'Levering' },
              { num: '100%', label: 'Gereviseerd' },
            ].map(s => (
              <div key={s.num} className="p-6 border-r border-b border-brand-primary/20 last:border-r-0 [&:nth-child(2)]:border-r-0 [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0">
                <div className="text-4xl font-extrabold text-brand-accent tracking-[-1px]">{s.num}</div>
                <div className="text-[11px] text-text-muted tracking-[1px] mt-1 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Eigenaarsfoto + werkplaatsfotos */}
        <div className="grid grid-cols-2 gap-1">
          {eigenaarFoto && (
            <div className="col-span-2 relative aspect-[16/7] overflow-hidden bg-bg-card">
              <Image
                src={urlFor(eigenaarFoto).width(800).height(350).url()}
                alt={eigenaarNaam || 'Eigenaar LR Revisie'}
                fill
                className="object-cover object-top saturate-75"
              />
              {eigenaarNaam && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary/90 to-transparent px-6 py-4">
                  <span className="text-sm font-semibold text-white">{eigenaarNaam}</span>
                  <span className="text-xs text-text-muted ml-2">— Eigenaar LR Revisie</span>
                </div>
              )}
            </div>
          )}
          <div className="relative aspect-square overflow-hidden bg-bg-card">
            <Image src="https://lr-revisie.nl/wp-content/uploads/2023/01/UKC75L-scaled.jpg" alt="Onderdeel" fill className="object-cover saturate-75" />
          </div>
          <div className="relative aspect-square overflow-hidden bg-bg-card">
            <Image src="https://lr-revisie.nl/wp-content/uploads/2023/01/RTC2914-scaled.jpg" alt="Onderdeel" fill className="object-cover saturate-75" />
          </div>
        </div>
      </div>
    </section>
  )
}
