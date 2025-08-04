import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

// ✅ SSR-safe storage fallback with proper types & no-unused-vars
const storage: StateStorage =
  typeof window !== 'undefined'
    ? localStorage
    : {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getItem: (_key: string): string | null => null,

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setItem: (_key: string, _value: string): void => {},

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        removeItem: (_key: string): void => {},
      }

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item: CartItem) =>
        set((state: CartState) => {
          const existing = state.cart.find((i) => i.id === item.id)
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { cart: [...state.cart, item] }
        }),
      removeFromCart: (id: string) =>
        set((state: CartState) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
      increaseQuantity: (id: string) =>
        set((state: CartState) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      decreaseQuantity: (id: string) =>
        set((state: CartState) => ({
          cart: state.cart
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        })),
      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => storage),
    }
  )
)
