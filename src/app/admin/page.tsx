'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LogoutButton from '@/components/LogoutButton'
import Image from 'next/image'

type Product = {
  _id: string
  name: string
  price: number
  description: string
  image: string
  category: string
}

type Order = {
  _id: string
  user: {
    name: string
    email: string
  }
  totalPrice: number
  isPaid: boolean
  isDelivered: boolean
  createdAt: string
  orderItems: {
    name: string
    qty: number
  }[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState(0)
  const [newDescription, setNewDescription] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newCategory, setNewCategory] = useState('electronics')
  const [editingId, setEditingId] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  // ✅ Check Admin Role

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token')
      if (!token) return router.push('/login')

      try {
        const res = await fetch(`${baseUrl}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (!res.ok || !data.isAdmin) {
          console.warn('🚫 Not an admin user:', data)
          return router.push('/login')
        }

        setIsAdmin(true)
      } catch (err) {
        console.error('❌ Auth error:', err)
        router.push('/login')
      }
    }

    checkAdmin()
  }, [router, baseUrl])

  useEffect(() => {
    if (!isAdmin) return

    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/products`)
        if (!res.ok) throw new Error('Failed to fetch products')
        const json = await res.json()
        const productsArray = Array.isArray(json) ? json : json.products || []
        setProducts(productsArray)
      } catch (err) {
        console.error('❌ Error fetching products:', err)
        setError('Failed to load products.')
      }
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const json: Order[] = await res.json()
        setOrders(json)
      } catch (err) {
        console.error('❌ Error fetching orders:', err)
        setError('Failed to load orders.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    fetchOrders()
  }, [isAdmin, baseUrl, router])

  // ✅ Add / Edit Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: newName,
      price: newPrice,
      description: newDescription,
      image: newImage,
      category: newCategory,
    }

    try {
      const endpoint = editingId
        ? `${baseUrl}/api/products/${editingId}`
        : `${baseUrl}/api/products`

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
      setNewCategory('electronics')
      setEditingId(null)
    } catch (err) {
      console.error('❌ Error submitting product:', err)
      alert('Failed to submit product.')
    }
  }

  // ✅ Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`${baseUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (!res.ok) throw new Error('Failed to delete')
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      console.error('❌ Delete error:', err)
      alert('Delete failed.')
    }
  }

  // ✅ Edit Product
  const handleEdit = (product: Product) => {
    setNewName(product.name)
    setNewPrice(product.price)
    setNewDescription(product.description)
    setNewImage(product.image)
    setNewCategory(product.category)
    setEditingId(product._id)
  }

  if (!isAdmin || loading) return null

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
      <LogoutButton />

      <div className='mt-6 space-y-8'>
        {/* ✅ Manage Products */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>📦 Manage Products</h2>

          <form onSubmit={handleSubmit} className='space-y-2 mb-4'>
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
              placeholder='e.g. 99.99'
              step='0.01'
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
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            >
              <option value='electronics'>Electronics</option>
              <option value='fashion'>Fashion</option>
              <option value='furniture'>Furniture</option>
            </select>
            <button
              type='submit'
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </form>

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
                    <span className='text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded'>
                      {p.category}
                    </span>
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

        {/* ✅ View Orders */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-4'>
            🛒 View Orders ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <p className='text-gray-500'>No recent customer orders found.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      User
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Paid
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Delivered
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {order._id.substring(18)}...
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {order.user.name} ({order.user.email})
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.isPaid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.isPaid ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.isDelivered
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.isDelivered ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ✅ Manage Users (Coming Soon) */}
        <section className='p-4 border rounded shadow'>
          <h2 className='font-semibold text-xl mb-2'>👤 Manage Users</h2>
          <p>Promote users to admin, remove users, etc.</p>
        </section>
      </div>
    </div>
  )
}
