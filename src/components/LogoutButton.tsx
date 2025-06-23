'use client'
import { useAuthStore } from '@/store/useAuthStore'

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout)

  return (
    <button
      onClick={logout}
      className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
    >
      Logout
    </button>
  )
}
