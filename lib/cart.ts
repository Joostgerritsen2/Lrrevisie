// lib/cart.ts (stub — will be replaced in Task 7)
import { create } from 'zustand'

interface CartItem {
  id: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
}

export const useCartStore = create<CartStore>()(() => ({
  items: [],
}))
