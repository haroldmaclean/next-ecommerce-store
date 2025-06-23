// src/app/admin/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import LogoutButton from '@/components/LogoutButton'

export default function AdminDashboard() {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
      <LogoutButton />

      <div className='mt-6 space-y-4'>
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>📦 Manage Products</h2>
          <p>CRUD operations for your product listings</p>
        </section>

        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>🛒 View Orders</h2>
          <p>See recent customer orders</p>
        </section>

        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>👤 Manage Users</h2>
          <p>Promote users to admin, remove users, etc.</p>
        </section>
      </div>
    </div>
  )
}
