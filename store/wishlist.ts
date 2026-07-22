import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggle: (productId: string) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) =>
        set((s) => ({
          items: s.items.includes(productId) ? s.items : [...s.items, productId],
        })),
      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((id) => id !== productId) })),
      isInWishlist: (productId) => get().items.includes(productId),
      toggle: (productId) => {
        const { items } = get()
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) })
        } else {
          set({ items: [...items, productId] })
        }
      },
    }),
    { name: 'cloakyard-wishlist' }
  )
)
