// export interface Product {
//   _id?: string
//   id?: string
//   name: string
//   price: number
//   image: string
//   description: string // ✅ Add this line
// }

// export const fetchProducts = async (): Promise<{ products: Product[] }> => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
//   if (!res.ok) throw new Error('Failed to fetch products')
//   return await res.json()
// }

export interface Product {
  _id?: string
  id?: string
  name: string
  price: number
  image: string
  description: string
}

export const fetchProducts = async (): Promise<{ products: Product[] }> => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const res = await fetch(`${baseURL}/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return await res.json()
}
