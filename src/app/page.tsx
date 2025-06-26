'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { fetchProducts, Product } from '@/lib/fetchProducts'
import { formatPrice } from '@/lib/utils'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { products = [] } = await fetchProducts()
        console.log('✅ Fetched products:', products)
        setProducts(products)
        setError(null)
      } catch (err) {
        console.error('❌ Error loading products:', err)
        setError('Failed to load products.')
      }
    }

    loadProducts()
  }, [])

  if (error) {
    return (
      <main className='min-h-screen flex items-center justify-center p-6'>
        <p className='text-red-600 text-lg'>{error}</p>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-gray-50 py-10 px-6'>
      <section className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-center text-gray-800'>
          🛍️ Welcome to Next E-Commerce
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id || product.id}
                className='bg-white rounded shadow hover:shadow-lg transition overflow-hidden'
              >
                <div className='relative w-full h-48'>
                  <Image
                    src={product.image}
                    alt={product.name || 'Product Image'}
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                    style={{ objectFit: 'cover' }}
                    className='rounded-t'
                    priority
                  />
                </div>
                <div className='p-4 text-center'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {product.name}
                  </h3>
                  <p className='text-blue-600 font-bold'>
                    {formatPrice(product.price)}
                  </p>
                  <p className='text-sm text-gray-600 mb-3'>
                    {product.description}
                  </p>
                  <a
                    href={`/products/${product._id || product.id}`}
                    className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                  >
                    View Product
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className='text-center col-span-3 text-gray-500'>
              Loading products...
            </p>
          )}
        </div>
      </section>
    </main>
  )
}


