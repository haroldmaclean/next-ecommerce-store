// lib/fetchProducts.ts

export interface Product {
  _id?: string
  id?: string
  name: string
  price: number
  image: string
  description: string
}

export const fetchProducts = async (): Promise<{ products: Product[] }> => {
  // ⛔ SSR-safe guard: return empty list during build/static rendering
  if (typeof window === 'undefined') {
    return { products: [] }
  }

  try {
    const envURL = process.env.NEXT_PUBLIC_API_URL?.trim()
    const baseURL = envURL || 'http://localhost:5000'

    const fullURL = `${baseURL}/api/products`
    console.log('🌐 fetchProducts from:', fullURL) // ✅ Remove in final production

    const res = await fetch(fullURL)

    if (!res.ok) {
      console.error(`❌ Failed to fetch products. Status: ${res.status}`)
      return { products: [] } // fallback instead of crashing
    }

    const data = await res.json()
    return { products: data.products || [] }
  } catch (error) {
    console.error('❌ fetchProducts error:', error)
    return { products: [] }
  }
}
