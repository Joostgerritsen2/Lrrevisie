'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function SortSelect({ current }: { current: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex justify-end mb-6">
      <select
        value={current}
        onChange={handleChange}
        className="bg-bg-card border border-border text-sm text-text-muted px-3 py-2 outline-none"
      >
        <option value="naam">Naam A–Z</option>
        <option value="prijs-asc">Prijs laag–hoog</option>
        <option value="prijs-desc">Prijs hoog–laag</option>
      </select>
    </div>
  )
}
