import { describe, it, expect } from 'vitest'
import { formatPrice } from '../utils'

// Note: Intl.NumberFormat (nl-NL) uses U+00A0 (non-breaking space) between € and amount
describe('formatPrice', () => {
  it('formats cents to euro string', () => {
    expect(formatPrice(2495)).toBe('€\u00A024,95')
  })
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('€\u00A00,00')
  })
  it('handles large amounts', () => {
    expect(formatPrice(125000)).toBe('€\u00A01.250,00')
  })
})
