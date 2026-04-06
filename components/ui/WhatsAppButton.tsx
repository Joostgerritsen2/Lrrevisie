'use client'
import { MessageCircle } from 'lucide-react'

const WA_NUMBER = '31612345678' // ← vervang door echt nummer

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=Hallo%2C%20ik%20heb%20een%20vraag%20over%20een%20onderdeel.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Stuur ons een WhatsApp bericht"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white pl-4 pr-5 py-3.5 shadow-2xl shadow-black/40 transition-all duration-200 hover:scale-105 group"
    >
      <MessageCircle size={20} fill="white" strokeWidth={0} />
      <span className="text-sm font-bold hidden sm:block">WhatsApp</span>
    </a>
  )
}
