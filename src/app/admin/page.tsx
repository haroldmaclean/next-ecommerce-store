'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import LogoutButton from '@/components/LogoutButton'

export default function AdminDashboard() {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login') // redirect if NOT logged in
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null // prevent flash

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
      <LogoutButton />
      <p className='text-lg text-gray-600'>Welcome, Admin! 🎉</p>

      <div className='mt-6 space-y-4'>
        📦 Manage Products
        <div className='p-4 border rounded shadow'>
          🛒 View Orders
          <div className='p-4 border rounded shadow'>
            👤 Manage Users
            <div className='p-4 border rounded shadow'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
