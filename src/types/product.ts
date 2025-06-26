export interface Product {
  _id?: string // ✅ optional to support both _id from MongoDB and id from dummy data
  id?: string
  name: string
  description: string
  price: number
  image: string
}
