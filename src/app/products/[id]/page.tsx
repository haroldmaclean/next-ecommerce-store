'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { toCartItem } from '@/lib/cartUtils/toCartItem'
import { Product } from '@/types/product'
import ClientNavbar from '@/components/ClientNavbar'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
        )
        if (!res.ok) throw new Error('Failed to fetch product details')

        const data = await res.json()
        setProduct(data)
        setError('')
      } catch (err) {
        console.error('❌ Error fetching product:', err)
        setError('Unable to load product details. Please try again later.')
      }
    }

    fetchProduct()
  }, [id])

  if (error) {
    return (
      <>
        <ClientNavbar />
        <main className='min-h-screen flex items-center justify-center p-6'>
          <p className='text-red-600 text-lg'>{error}</p>
        </main>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <ClientNavbar />
        <main className='min-h-screen flex items-center justify-center p-6'>
          <p className='text-gray-600 text-lg'>Loading product details...</p>
        </main>
      </>
    )
  }

  const handleAddToCart = () => {
    const cartItem = toCartItem(product)
    addToCart(cartItem)
  }

  return (
    <>
      <ClientNavbar />
      <main className='max-w-4xl mx-auto py-10 px-6'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='md:w-1/2'>
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={400}
                className='w-full h-auto rounded-lg object-cover'
                priority
              />
            </div>

            <div className='md:w-1/2'>
              <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                {product.name}
              </h1>
              <p className='text-gray-600 mb-4'>{product.description}</p>
              <p className='text-2xl font-semibold text-blue-600 mb-6'>
                ${product.price.toFixed(2)}
              </p>

              <button
                onClick={handleAddToCart}
                className='bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition'
              >
                Add to Cart
              </button>

              <div className='mt-4'>
                <Link href='/' className='text-blue-500 hover:underline'>
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
