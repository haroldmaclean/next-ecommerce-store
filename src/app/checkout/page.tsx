'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [])

  const cart = useCartStore((state) => state.cart)
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = cart.length > 0 ? 10 : 0
  const total = subtotal + shipping

  return (
    <div className='p-8 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Checkout</h1>

      <h2 className='text-lg font-semibold mb-2'>Order Summary</h2>
      <div className='mb-6 bg-white p-4 rounded shadow space-y-2'>
        <p>
          Subtotal: <strong>{formatPrice(subtotal)}</strong>
        </p>
        <p>
          Shipping: <strong>{formatPrice(shipping)}</strong>
        </p>
        <p>
          Total: <strong>{formatPrice(total)}</strong>
        </p>
      </div>

      <form
        className='space-y-4 bg-white p-4 rounded shadow'
        onSubmit={(e) => {
          e.preventDefault()
          router.push('/thank-you')
        }}
      >
        <div>
          <label className='block mb-1'>Full Name</label>
          <input
            type='text'
            required
            className='w-full p-2 border rounded'
            placeholder='John Doe'
          />
        </div>

        <div>
          <label className='block mb-1'>Email</label>
          <input
            type='email'
            required
            className='w-full p-2 border rounded'
            placeholder='john@example.com'
          />
        </div>

        <div>
          <label className='block mb-1'>Shipping Address</label>
          <textarea
            required
            className='w-full p-2 border rounded'
            placeholder='123 Street Name, City'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Place Order
        </button>
      </form>
    </div>
  )
}
