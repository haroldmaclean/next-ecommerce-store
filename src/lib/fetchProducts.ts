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
  // 🧠 Prevent SSR-side fetch errors (e.g., during static build)
  if (typeof window === 'undefined') {
    return { products: [] }
  }

  try {
    const envURL = process.env.NEXT_PUBLIC_API_URL?.trim()
    const baseURL = envURL || 'http://localhost:5000/api'

    console.log('🌐 fetchProducts from:', baseURL) // Optional: remove in production

    const res = await fetch(`${baseURL}/products`)

    if (!res.ok) throw new Error('Failed to fetch products')

    const data = await res.json()
    return { products: data.products || [] } // 👈 adjusts to match the API shape
  } catch (error) {
    console.error('❌ fetchProducts error:', error)
    return { products: [] } // Safe fallback
  }
}
