'use client'

import { useEffect, useState, useMemo } from 'react' // <-- Import useMemo
import { useParams } from 'next/navigation'
import ClientNavbar from '@/components/ClientNavbar'
import Image from 'next/image'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'

export default function CategoryPage() {
  const { category } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [localSearchTerm, setLocalSearchTerm] = useState('') // <-- New State for local filtering

  // 1. FETCH LOGIC (UNCHANGED, fetches all category products)
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        // We still fetch all products for the category
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category}`
        )

        if (!res.ok) throw new Error('Failed to fetch category products')

        const data = await res.json()
        setProducts(data)
        setLoading(false)
      } catch (err) {
        console.error('❌ Error fetching category:', err)
        setError('Failed to load category products')
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [category])

  // 2. FILTER LOGIC (NEW: Filters products based on local search term)
  const filteredProducts = useMemo(() => {
    if (!localSearchTerm) return products // Return all if no search term

    const searchLower = localSearchTerm.toLowerCase()

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
    )
  }, [products, localSearchTerm])

  if (loading)
    return (
      // ... loading state ...
      <>
        <ClientNavbar />
        <main className='min-h-screen flex items-center justify-center'>
          <p className='text-gray-500 text-lg'>Loading products...</p>
        </main>
      </>
    )

  if (error)
    return (
      // ... error state ...
      <>
        <ClientNavbar />
        <main className='min-h-screen flex items-center justify-center'>
          <p className='text-red-500 text-lg'>{error}</p>
        </main>
      </>
    )

  return (
    <>
      <ClientNavbar />
      <main className='min-h-screen bg-gray-50 py-10 px-6'>
        <section className='max-w-6xl mx-auto'>
          <h1 className='text-3xl font-bold mb-6 text-center capitalize text-gray-800'>
            🏷️ {category} Products
          </h1>

          {/* --- NEW: Local Search Field for Category Page --- */}
          <div className='mb-8 flex justify-center'>
            <input
              type='text'
              placeholder={`Search within ${category} products...`}
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className='w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150'
            />
          </div>

          {/* 3. Render filteredProducts */}
          {filteredProducts.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className='bg-white rounded shadow hover:shadow-xl transition duration-300 overflow-hidden'
                >
                  {/* ... Product Card Content (unchanged) ... */}
                  <div className='relative w-full h-48'>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes='(max-width: 768px) 100vw, 33vw'
                      style={{ objectFit: 'cover' }}
                      className='rounded-t'
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
                      href={`/products/${product._id}`}
                      className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                    >
                      View Product
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-500 text-lg p-10 border border-dashed rounded-lg bg-white'>
              No products found in &quot;{category}&quot; matching &quot;
              {localSearchTerm}&quot;.
            </p>
          )}
        </section>
      </main>
    </>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import ClientNavbar from '@/components/ClientNavbar'
// import Image from 'next/image'
// import { Product } from '@/types/product'
// import { formatPrice } from '@/lib/utils'

// export default function CategoryPage() {
//   const { category } = useParams()
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchCategoryProducts = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category}`
//         )

//         if (!res.ok) throw new Error('Failed to fetch category products')

//         const data = await res.json()
//         setProducts(data)
//         setLoading(false)
//       } catch (err) {
//         console.error('❌ Error fetching category:', err)
//         setError('Failed to load category products')
//         setLoading(false)
//       }
//     }

//     fetchCategoryProducts()
//   }, [category])

//   if (loading)
//     return (
//       <>
//         <ClientNavbar />
//         <main className='min-h-screen flex items-center justify-center'>
//           <p className='text-gray-500 text-lg'>Loading products...</p>
//         </main>
//       </>
//     )

//   if (error)
//     return (
//       <>
//         <ClientNavbar />
//         <main className='min-h-screen flex items-center justify-center'>
//           <p className='text-red-500 text-lg'>{error}</p>
//         </main>
//       </>
//     )

//   return (
//     <>
//       <ClientNavbar />
//       <main className='min-h-screen bg-gray-50 py-10 px-6'>
//         <section className='max-w-6xl mx-auto'>
//           <h1 className='text-3xl font-bold mb-8 text-center capitalize text-gray-800'>
//             🏷️ {category} Products
//           </h1>
//           {products.length > 0 ? (
//             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className='bg-white rounded shadow hover:shadow-lg transition overflow-hidden'
//                 >
//                   <div className='relative w-full h-48'>
//                     <Image
//                       src={product.image}
//                       alt={product.name}
//                       fill
//                       sizes='(max-width: 768px) 100vw, 33vw'
//                       style={{ objectFit: 'cover' }}
//                       className='rounded-t'
//                     />
//                   </div>
//                   <div className='p-4 text-center'>
//                     <h3 className='text-lg font-semibold text-gray-800'>
//                       {product.name}
//                     </h3>
//                     <p className='text-blue-600 font-bold'>
//                       {formatPrice(product.price)}
//                     </p>
//                     <p className='text-sm text-gray-600 mb-3'>
//                       {product.description}
//                     </p>
//                     <a
//                       href={`/products/${product._id}`}
//                       className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
//                     >
//                       View Product
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className='text-center text-gray-500'>
//               No products found in this category.
//             </p>
//           )}
//         </section>
//       </main>
//     </>
//   )
// }
