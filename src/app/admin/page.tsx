'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import LogoutButton from '@/components/LogoutButton'
import Image from 'next/image'

// Product type definition
type Product = {
  _id: string
  name: string
  price: number
  description: string
  image: string
}

export default function AdminDashboard() {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  // State for products and loading/error handling
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form input state
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState<number>(0)
  const [newDescription, setNewDescription] = useState('')
  const [newImage, setNewImage] = useState('')

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  // Fetch all products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        )
        if (!res.ok) throw new Error('Failed to fetch products')
        const json = await res.json()

        // Handle different response shapes defensively
        if (Array.isArray(json)) {
          setProducts(json)
        } else if (Array.isArray(json.products)) {
          setProducts(json.products)
        } else {
          throw new Error('Invalid data format from API')
        }
      } catch (err) {
        console.error('❌ Error:', err)
        setError('Failed to load products.')
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn) fetchProducts()
  }, [isLoggedIn])

  // Handle new product creation
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            name: newName,
            price: newPrice,
            description: newDescription,
            image: newImage,
          }),
        }
      )

      if (!res.ok) throw new Error('Failed to create product')

      const created = await res.json()
      setProducts((prev) => [...prev, created])

      // Reset input fields after success
      setNewName('')
      setNewPrice(0)
      setNewDescription('')
      setNewImage('')
    } catch (err) {
      console.error('❌ Error creating product:', err)
      alert('Failed to create product.')
    }
  }

  if (!isLoggedIn || loading) return null

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
      <LogoutButton />

      <div className='mt-6 space-y-4'>
        {/* Manage Products Section */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>📦 Manage Products</h2>

          {/* Product creation form */}
          <form onSubmit={handleCreateProduct} className='space-y-2 mb-4'>
            <input
              type='text'
              placeholder='Product Name'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
            <input
              type='number'
              placeholder='Price'
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className='w-full border px-3 py-2 rounded'
              required
            />
            <input
              type='text'
              placeholder='Description'
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
            <input
              type='url'
              placeholder='Image URL'
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
            <button
              type='submit'
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
            >
              Add Product
            </button>
          </form>

          {/* Product list */}
          {error ? (
            <p className='text-red-500'>{error}</p>
          ) : products.length === 0 ? (
            <p className='text-gray-500'>No products found.</p>
          ) : (
            <ul className='space-y-2'>
              {products.map((p) => (
                <li key={p._id} className='border p-2 rounded'>
                  <strong>{p.name}</strong> – ${p.price}
                  <p className='text-sm text-gray-600'>{p.description}</p>
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={96}
                    height={96}
                    className='mt-2 rounded object-cover'
                    unoptimized
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* View Orders Section */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>🛒 View Orders</h2>
          <p>See recent customer orders</p>
        </section>

        {/* Manage Users Section */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>👤 Manage Users</h2>
          <p>Promote users to admin, remove users, etc.</p>
        </section>
      </div>
    </div>
  )
}
