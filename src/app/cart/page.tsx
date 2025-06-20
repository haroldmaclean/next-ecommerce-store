'use client'

import toast from 'react-hot-toast'
import { useCartStore } from '@/store/useCartStore'
// import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { getStripe } from '@/lib/stripe'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CartPage() {
  const cart = useCartStore((state) => state.cart as CartItem[])
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const increaseQuantity = useCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = cart.length > 0 ? 10 : 0
  const total = subtotal + shipping

  // 👇✅ Progress indicator goes RIGHT BELOW the page heading <h1>
  const progressIndicator = (
    <div className='mb-6'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center text-blue-600 font-semibold'>
          <span className='w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm'>
            1
          </span>
          <span className='ml-2'>Cart</span>
        </div>
        <span className='text-gray-400'>→</span>
        <div className='flex items-center text-gray-400'>
          <span className='w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm'>
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
  )

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Your Cart</h1>
      {progressIndicator}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className='space-y-6'>
          {cart.map((item) => (
            <div
              key={item.id}
              className='flex items-center justify-between border p-4 rounded'
            >
              <div className='flex items-center gap-4'>
                <Image
                  src={item.image || '/images/fallback.png'}
                  alt={item.name}
                  width={80}
                  height={80}
                  className='rounded object-cover'
                />
                <div>
                  <h2 className='text-lg font-semibold'>{item.name}</h2>
                  <div className='flex items-center gap-2 mt-1'>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300'
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300'
                    >
                      +
                    </button>
                  </div>
                  <p className='text-sm text-gray-500 mt-1'>
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  removeFromCart(item.id)
                  toast.success('Item removed from cart.')
                }}
                className='text-red-600 hover:underline'
              >
                Remove
              </button>
            </div>
          ))}

          <div className='flex justify-end'>
            <button
              onClick={() => {
                clearCart()
                toast.success('Cart cleared.')
              }}
              className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
            >
              Clear Cart
            </button>
          </div>

          <div className='mt-8 p-4 border-t'>
            <div className='flex justify-between text-lg'>
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className='flex justify-between text-lg'>
              <span>Shipping:</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className='flex justify-between text-xl font-bold mt-2'>
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className='flex justify-end mt-4'>
            <button
              onClick={async () => {
                const stripe = await getStripe()

                const response = await fetch('/api/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ items: cart }),
                })

                const data = await response.json()

                if (data.sessionId) {
                  await stripe?.redirectToCheckout({
                    sessionId: data.sessionId,
                  })
                } else {
                  alert('Checkout failed.')
                }
              }}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
