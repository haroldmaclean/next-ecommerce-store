import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  register: () => void // ✅ Add this
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
      register: () => set({ isLoggedIn: true }), // ✅ Just like login
    }),
    {
      name: 'auth-storage',
    }
  )
)
