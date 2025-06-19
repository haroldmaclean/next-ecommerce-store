'use client'

import { useCartStore } from '@/store/useCartStore'
import Link from 'next/link'
import { useState } from 'react'

export default function MiniCart() {
  const cart = useCartStore((state) => state.cart)
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 hover:text-blue-600 transition'
      >
        🛒
        {cart.length > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50 border'>
          <h3 className='text-lg font-semibold mb-2'>Cart Preview</h3>
          {cart.length === 0 ? (
            <p className='text-gray-500'>Your cart is empty.</p>
          ) : (
            <div className='space-y-3 max-h-64 overflow-y-auto'>
              {cart.map((item) => (
                <div key={item.id} className='flex justify-between text-sm'>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className='flex justify-between font-semibold'>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between gap-2 mt-3'>
                <Link
                  href='/cart'
                  className='w-1/2 text-center text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded'
                  onClick={() => setIsOpen(false)}
                >
                  View Cart
                </Link>
                <Link
                  href='/checkout'
                  className='w-1/2 text-center text-sm bg-blue-600 text-white hover:bg-blue-700 px-2 py-1 rounded'
                  onClick={() => setIsOpen(false)}
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
