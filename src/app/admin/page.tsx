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

  // State
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState<number>(0)
  const [newDescription, setNewDescription] = useState('')
  const [newImage, setNewImage] = useState('')

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        )
        if (!res.ok) throw new Error('Failed to fetch products')
        const json = await res.json()
        setProducts(Array.isArray(json) ? json : json.products || [])
      } catch (err) {
        console.error('❌ Error:', err)
        setError('Failed to load products.')
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn) fetchProducts()
  }, [isLoggedIn])

  // Handle product creation or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: newName,
      price: newPrice,
      description: newDescription,
      image: newImage,
    }

    try {
      const endpoint = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/products`

      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to submit product')

      const result = await res.json()

      setProducts((prev) =>
        editingId
          ? prev.map((p) => (p._id === editingId ? result : p))
          : [...prev, result]
      )

      setNewName('')
      setNewPrice(0)
      setNewDescription('')
      setNewImage('')
      setEditingId(null)
    } catch (err) {
      console.error('❌ Error submitting product:', err)
      alert('Failed to submit product.')
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (!res.ok) throw new Error('Failed to delete')
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      console.error('❌ Delete error:', err)
      alert('Delete failed.')
    }
  }

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setNewName(product.name)
    setNewPrice(product.price)
    setNewDescription(product.description)
    setNewImage(product.image)
    setEditingId(product._id)
  }

  if (!isLoggedIn || loading) return null

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
      <LogoutButton />

      <div className='mt-6 space-y-4'>
        {/* Products Section */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>📦 Manage Products</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-2 mb-4'>
            <input
              type='text'
              placeholder='Product Name'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
            <label className='block'>
              <span className='text-sm font-medium text-gray-700'>Price</span>
              <input
                type='number'
                placeholder='e.g. 99.99'
                step='0.01'
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className='w-full border px-3 py-2 rounded mt-1'
                required
              />
            </label>
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
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </form>

          {/* Product List */}
          {error ? (
            <p className='text-red-500'>{error}</p>
          ) : products.length === 0 ? (
            <p className='text-gray-500'>No products found.</p>
          ) : (
            <ul className='space-y-2'>
              {products.map((p) => (
                <li
                  key={p._id}
                  className='border p-3 rounded flex gap-4 items-start'
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={96}
                    height={96}
                    className='rounded object-cover'
                    unoptimized
                  />
                  <div className='flex-1'>
                    <strong>{p.name}</strong> – ${p.price.toFixed(2)}
                    <p className='text-sm text-gray-600'>{p.description}</p>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <button
                      onClick={() => handleEdit(p)}
                      className='text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className='text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Orders Section */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>🛒 View Orders</h2>
          <p>See recent customer orders</p>
        </section>

        {/* Users Section */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>👤 Manage Users</h2>
          <p>Promote users to admin, remove users, etc.</p>
        </section>
      </div>
    </div>
  )
}
