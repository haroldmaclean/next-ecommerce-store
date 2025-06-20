// 'use client'

// import { useEffect } from 'react'
// import { useCartStore } from '@/store/useCartStore'
// import { useRouter } from 'next/navigation'
// import { loadStripe } from '@stripe/stripe-js'

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// )

// export default function CheckoutPage() {
//   const router = useRouter()
//   const cart = useCartStore((state) => state.cart)

//   const subtotal = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   )
//   const shipping = cart.length > 0 ? 10 : 0
//   const total = subtotal + shipping

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       router.push('/login')
//     }
//   }, [])

//   const handleCheckout = async () => {
//     const stripe = await stripePromise

//     const response = await fetch('/api/checkout', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ items: cart }),
//     })

//     // const data = await response.json()
//     // if (data.url) {
//     //   stripe?.redirectToCheckout({ url: data.url })
//     // } else {
//     //   alert('Checkout failed.')
//     // }
//     const data = await response.json()
//     if (data.sessionId) {
//       stripe?.redirectToCheckout({ sessionId: data.sessionId })
//     } else {
//       alert('Checkout failed.')
//     }
//   }

//   return (
//     <div className='p-8'>
//       <h1 className='text-2xl font-bold mb-4'>Checkout</h1>
//       <h2 className='text-lg font-semibold mb-2'>Order Summary</h2>

//       <div className='mb-4'>
//         <p>
//           Subtotal: <strong>${subtotal.toFixed(2)}</strong>
//         </p>
//         <p>
//           Shipping: <strong>${shipping.toFixed(2)}</strong>
//         </p>
//         <p>
//           Total: <strong>${total.toFixed(2)}</strong>
//         </p>
//       </div>

//       <form
//         className='space-y-4 bg-white p-4 rounded shadow'
//         onSubmit={(e) => {
//           e.preventDefault()
//           handleCheckout()
//         }}
//       >
//         <div>
//           <label className='block mb-1'>Full Name</label>
//           <input
//             type='text'
//             required
//             className='w-full p-2 border rounded'
//             placeholder='John Doe'
//           />
//         </div>

//         <div>
//           <label className='block mb-1'>Email</label>
//           <input
//             type='email'
//             required
//             className='w-full p-2 border rounded'
//             placeholder='john@example.com'
//           />
//         </div>

//         <div>
//           <label className='block mb-1'>Shipping Address</label>
//           <textarea
//             required
//             className='w-full p-2 border rounded'
//             placeholder='123 Street Name, City'
//           />
//         </div>

//         <button
//           type='submit'
//           className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
//         >
//           Place Order
//         </button>
//       </form>
//     </div>
//   )
// }

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    router.push('/thank-you')
  }

  return (
    <div className='p-8 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Checkout</h1>

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
