'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import LogoutButton from '@/components/LogoutButton'

// Product type definition
type Product = {
  _id: string
  name: string
  price: number
}

export default function AdminDashboard() {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        )
        if (!res.ok) throw new Error('Failed to fetch')
        const data: Product[] = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('❌ Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn) fetchProducts()
  }, [isLoggedIn])

  if (!isLoggedIn || loading) return null

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
      <LogoutButton />

      <div className='mt-6 space-y-4'>
        {/* Products */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>📦 Manage Products</h2>
          {products.length === 0 ? (
            <p className='text-gray-500'>No products found.</p>
          ) : (
            <ul className='space-y-2'>
              {products.map((p) => (
                <li key={p._id} className='border p-2 rounded'>
                  <strong>{p.name}</strong> – ${p.price}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Orders */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>🛒 View Orders</h2>
          <p>See recent customer orders</p>
        </section>

        {/* Users */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>👤 Manage Users</h2>
          <p>Promote users to admin, remove users, etc.</p>
        </section>
      </div>
    </div>
  )
}
