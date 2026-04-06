'use client'
import { useState } from 'react'
import { PortableText } from '@portabletext/react'

interface ProductTabsProps {
  beschrijving?: unknown[]
  specificaties?: { label: string; waarde: string }[]
  compatibiliteit?: string[]
}

const tabs = [
  { key: 'beschrijving', label: 'Beschrijving' },
  { key: 'specificaties', label: 'Specificaties' },
  { key: 'compatibiliteit', label: 'Compatibiliteit' },
]

export function ProductTabs({ beschrijving, specificaties, compatibiliteit }: ProductTabsProps) {
  const [active, setActive] = useState('beschrijving')

  return (
    <div className="mt-12 border-t border-border">
      {/* Tab headers */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-6 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition-colors ${
              active === tab.key
                ? 'border-brand-accent text-white'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8">
        {active === 'beschrijving' && (
          <div className="prose prose-invert prose-sm max-w-none text-text-muted leading-relaxed">
            {beschrijving ? <PortableText value={beschrijving as Parameters<typeof PortableText>[0]['value']} /> : <p>Geen beschrijving beschikbaar.</p>}
          </div>
        )}
        {active === 'specificaties' && (
          <div className="max-w-lg">
            {specificaties && specificaties.length > 0 ? (
              <table className="w-full text-sm">
                <tbody>
                  {specificaties.map((s, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-2.5 pr-6 text-text-muted font-medium w-1/2">{s.label}</td>
                      <td className="py-2.5 text-white">{s.waarde}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-text-muted text-sm">Geen specificaties beschikbaar.</p>
            )}
          </div>
        )}
        {active === 'compatibiliteit' && (
          <div>
            {compatibiliteit && compatibiliteit.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2">
                {compatibiliteit.map((v, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="w-1 h-1 bg-brand-accent flex-shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted text-sm">Geen compatibiliteitsinformatie beschikbaar.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
