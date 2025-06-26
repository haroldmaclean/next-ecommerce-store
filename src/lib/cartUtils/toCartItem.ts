// src/lib/cartUtils/toCartItem.ts
import { Product } from '@/types/product'
import { CartItem } from '@/types/cart'

export function toCartItem(product: Product): CartItem {
  return {
    id: product.id || product._id || '',
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description,
    quantity: 1,
  }
}
