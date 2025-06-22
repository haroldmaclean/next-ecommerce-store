'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('South Africa')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = cart.length > 0 ? 10 : 0
  const total = subtotal + shipping

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) newErrors.name = 'Name is required.'
    if (!email.includes('@')) newErrors.email = 'Valid email is required.'
    if (!address.trim()) newErrors.address = 'Address is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsPlacingOrder(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push('/thank-you')
    } catch {
      // ❌ Previous: catch (err) { alert('Order failed.') }
      // ✅ Fixed: remove unused variable or log it for debugging
      alert('Order failed.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className='p-8 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Checkout</h1>

      {/* ✅ Progress Indicator */}
      <div className='mb-6'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center text-gray-400'>
            <span className='w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm'>
              1
            </span>
            <span className='ml-2'>Cart</span>
          </div>
          <span className='text-gray-400'>→</span>
          <div className='flex items-center text-blue-600 font-semibold'>
            <span className='w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm'>
              2
            </span>
            <span className='ml-2'>Checkout</span>
          </div>
          <span className='text-gray-400'>→</span>
          <div className='flex items-center text-gray-400'>
            <span className='w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm'>
              3
            </span>
            <span className='ml-2'>Thank You</span>
          </div>
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold'>Order Summary</h2>
        <p>
          Subtotal: <strong>${subtotal.toFixed(2)}</strong>
        </p>
        <p>
          Shipping: <strong>${shipping.toFixed(2)}</strong>
        </p>
        <p>
          Total: <strong>${total.toFixed(2)}</strong>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='space-y-4 bg-white p-4 rounded shadow'
      >
        <div>
          <label className='block mb-1'>Full Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-2 border rounded'
          />
          {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
        </div>

        <div>
          <label className='block mb-1'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-2 border rounded'
          />
          {errors.email && (
            <p className='text-red-500 text-sm'>{errors.email}</p>
          )}
        </div>

        <fieldset className='p-4 border rounded space-y-4'>
          <legend className='text-lg font-semibold mb-2'>
            Shipping Details
          </legend>

          <div>
            <label className='block mb-1'>Shipping Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className='w-full p-2 border rounded'
            />
            {errors.address && (
              <p className='text-red-500 text-sm'>{errors.address}</p>
            )}
          </div>

          <div>
            <label className='block mb-1'>Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className='w-full p-2 border rounded'
            >
              <option value='South Africa'>South Africa</option>
              <option value='United States'>United States</option>
              <option value='United Kingdom'>United Kingdom</option>
              <option value='Germany'>Germany</option>
              <option value='India'>India</option>
            </select>
          </div>
        </fieldset>

        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
