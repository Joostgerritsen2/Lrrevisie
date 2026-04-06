import { describe, it, expect, beforeEach, beforeAll } from 'vitest'

// Mock localStorage for node environment (required by zustand/persist middleware)
beforeAll(() => {
  const store: Record<string, string> = {}
  global.localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
    length: 0,
    key: () => null,
  } as Storage
})

import { useCartStore } from '../cart'

const testItem = {
  id: 'prod-1',
  naam: 'Oil Seal',
  artikelnummer: 'FRC1780',
  slug: 'frc1780-oil-seal',
  categorie: 'onderdelen',
  prijs: 2495,
}

beforeEach(() => useCartStore.getState().clearCart())

describe('cart store', () => {
  it('adds an item', () => {
    useCartStore.getState().addItem(testItem)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('increments quantity for existing item', () => {
    useCartStore.getState().addItem(testItem)
    useCartStore.getState().addItem(testItem)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('removes an item', () => {
    useCartStore.getState().addItem(testItem)
    useCartStore.getState().removeItem('prod-1')
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('calculates total correctly', () => {
    useCartStore.getState().addItem(testItem)
    useCartStore.getState().updateQuantity('prod-1', 3)
    expect(useCartStore.getState().total()).toBe(7485) // 3 * 2495
  })
})
