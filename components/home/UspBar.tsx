import { Truck, Zap, Wrench, ShieldCheck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function UspBar() {
  const t = await getTranslations('usp')

  const items = [
    { icon: Truck,       title: t('shipping_title'),  sub: t('shipping_sub') },
    { icon: Zap,         title: t('delivery_title'),  sub: t('delivery_sub') },
    { icon: Wrench,      title: t('expertise_title'), sub: t('expertise_sub') },
    { icon: ShieldCheck, title: t('payment_title'),   sub: t('payment_sub') },
  ]

  return (
    <div className="bg-bg-green border-b border-brand-primary/30 grid grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3.5 px-5 lg:px-6 py-4 lg:py-5 border-r border-b border-white/5 last:border-r-0 odd:last:border-r lg:border-b-0 lg:odd:last:border-r-0"
        >
          <item.icon size={20} className="text-brand-accent flex-shrink-0" />
          <div>
            <strong className="block text-sm font-semibold text-white">{item.title}</strong>
            <span className="text-xs text-text-muted">{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
