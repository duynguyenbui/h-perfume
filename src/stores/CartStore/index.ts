import { create } from 'zustand'

interface LineItem {
  id: string
  name: string
  price: number
  discount: number
  quantity: number
}

interface CartState {
  lineItems: LineItem[]
  addLineItem: (lineItem: LineItem) => void
  plusLineItem: (id: string) => void
  minusLineItem: (id: string) => void
  removeLineItem: (id: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>((set) => ({
  lineItems: [],
  addLineItem: (lineItem) =>
    set((state) => {
      const existingItem = state.lineItems.find((item) => item.id === lineItem.id)
      if (existingItem) {
        return {
          lineItems: state.lineItems.map((item) =>
            item.id === lineItem.id
              ? { ...item, quantity: item.quantity + lineItem.quantity }
              : item,
          ),
        }
      }
      return { lineItems: [...state.lineItems, lineItem] }
    }),
  plusLineItem: (id) =>
    set((state) => ({
      lineItems: state.lineItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),
  minusLineItem: (id) =>
    set((state) => ({
      lineItems: state.lineItems
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    })),
  removeLineItem: (id) =>
    set((state) => ({ lineItems: state.lineItems.filter((item) => item.id !== id) })),
  clearCart: () => set({ lineItems: [] }),
}))
