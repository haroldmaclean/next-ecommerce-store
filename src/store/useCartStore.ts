// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// // ✅ Define and export the CartItem type
// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// // ✅ Define the store's state shape
// interface CartState {
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
//   increaseQuantity: (id: string) => void;
//   decreaseQuantity: (id: string) => void;
// }

// // ✅ Create Zustand store
// export const useCartStore = create<CartState>()(
//   persist(
//     (set) => ({
//       cart: [],

//       addToCart: (item) =>
//         set((state) => {
//           const existing = state.cart.find((i) => i.id === item.id);
//           if (existing) {
//             const updatedCart = state.cart.map((i) =>
//               i.id === item.id
//                 ? { ...i, quantity: i.quantity + item.quantity }
//                 : i
//             );
//             console.log("Updated existing item in cart:", updatedCart);
//             return { cart: updatedCart };
//           }
//           const newCart = [...state.cart, item];
//           console.log("Added new item to cart:", newCart);
//           return { cart: newCart };
//         }),

//       removeFromCart: (id) =>
//         set((state) => {
//           const filteredCart = state.cart.filter((item) => item.id !== id);
//           console.log(`Removed item with id=${id} from cart:`, filteredCart);
//           return { cart: filteredCart };
//         }),

//       clearCart: () => {
//         console.log("Cleared cart");
//         return set({ cart: [] });
//       },

//       increaseQuantity: (id) =>
//         set((state) => ({
//           cart: state.cart.map((item) =>
//             item.id === id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           ),
//         })),

//       decreaseQuantity: (id) =>
//         set((state) => ({
//           cart: state.cart
//             .map((item) =>
//               item.id === id
//                 ? { ...item, quantity: item.quantity - 1 }
//                 : item
//             )
//             .filter((item) => item.quantity > 0),
//         })),
//     }),
//     {
//       name: "cart-storage",
//     }
//   )
// );

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id)
          if (existing) {
            const updatedCart = state.cart.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
            console.log('Updated existing item in cart:', updatedCart)
            return { cart: updatedCart }
          }
          const newCart = [...state.cart, item]
          console.log('Added new item to cart:', newCart)
          return { cart: newCart }
        }),

      removeFromCart: (id) =>
        set((state) => {
          const filteredCart = state.cart.filter((item) => item.id !== id)
          console.log(`Removed item with id=${id} from cart:`, filteredCart)
          return { cart: filteredCart }
        }),

      clearCart: () => {
        console.log('Cleared cart')
        return set({ cart: [] })
      },

      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        })),

      // ✅ Add these two:
      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
)
