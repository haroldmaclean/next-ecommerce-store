'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import LogoutButton from '@/components/LogoutButton'
import Image from 'next/image'

type Product = {
  _id: string
  name: string
  price: number
  description: string
  image: string
  category: string // Add category type
}

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState(0)
  const [newDescription, setNewDescription] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newCategory, setNewCategory] = useState('electronics') // <-- ADDED: Category State
  const [editingId, setEditingId] = useState<string | null>(null) // Check token and verify if user is admin

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token')
      if (!token) return router.push('/login')

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const data = await res.json()

        if (!res.ok || !data.isAdmin) {
          return router.push('/login') // not admin or token invalid
        }

        setIsAdmin(true)
      } catch (err) {
        console.error('❌ Auth error:', err)
        router.push('/login')
      }
    }

    checkAdmin()
  }, [router]) // Fetch products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        ) // NOTE: The API route /api/products returns { products: [...] } but you are
        // expecting an array or { products: [] }. Fixing the logic here:
        const json = await res.json()
        const productsArray = Array.isArray(json) ? json : json.products || []

        if (!res.ok) throw new Error('Failed to fetch products')
        setProducts(productsArray) // Corrected line
      } catch (err) {
        console.error('❌ Error:', err)
        setError('Failed to load products.')
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) fetchProducts()
  }, [isAdmin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: newName,
      price: newPrice,
      description: newDescription,
      image: newImage,
      category: newCategory, // <-- ADDED: Category to payload
    }

    try {
      const endpoint = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/products`

      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json', // NOTE: Admin routes must be protected! Assuming you need the token
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to submit product')
      const result = await res.json()

      setProducts((prev) =>
        editingId
          ? prev.map((p) => (p._id === editingId ? result : p))
          : [...prev, result]
      ) // Reset form fields

      setNewName('')
      setNewPrice(0)
      setNewDescription('')
      setNewImage('')
      setNewCategory('electronics') // <-- RESET Category
      setEditingId(null)
    } catch (err) {
      console.error('❌ Error submitting product:', err)
      alert('Failed to submit product.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (!res.ok) throw new Error('Failed to delete')
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      console.error('❌ Delete error:', err)
      alert('Delete failed.')
    }
  }

  const handleEdit = (product: Product) => {
    setNewName(product.name)
    setNewPrice(product.price)
    setNewDescription(product.description)
    setNewImage(product.image)
    setNewCategory(product.category) // <-- SET Category for edit
    setEditingId(product._id)
  }

  if (!isAdmin || loading) return null

  return (
    <div className='p-8'>
            <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
            <LogoutButton />     {' '}
      <div className='mt-6 space-y-4'>
               {' '}
        <section className='p-4 border rounded shadow'>
                   {' '}
          <h2 className='font-semibold text-xl mb-2'>📦 Manage Products</h2>   
               {' '}
          <form onSubmit={handleSubmit} className='space-y-2 mb-4'>
                       {' '}
            <input
              type='text'
              placeholder='Product Name'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
                       {' '}
            <input
              type='number'
              placeholder='e.g. 99.99'
              step='0.01'
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className='w-full border px-3 py-2 rounded'
              required
            />
                       {' '}
            <input
              type='text'
              placeholder='Description'
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
                       {' '}
            <input
              type='url'
              placeholder='Image URL'
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
            {/* <-- ADDED: Category Select Input --> */}
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            >
              <option value='electronics'>Electronics</option>
              <option value='fashion'>Fashion</option>
              <option value='furniture'>Furniture</option>
            </select>
            {/* <-- END ADDED --> */}           {' '}
            <button
              type='submit'
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
            >
                            {editingId ? 'Update Product' : 'Add Product'}     
                   {' '}
            </button>
                     {' '}
          </form>
                   {' '}
          {error ? (
            <p className='text-red-500'>{error}</p>
          ) : products.length === 0 ? (
            <p className='text-gray-500'>No products found.</p>
          ) : (
            <ul className='space-y-2'>
                           {' '}
              {products.map((p) => (
                <li
                  key={p._id}
                  className='border p-3 rounded flex gap-4 items-start'
                >
                                   {' '}
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={96}
                    height={96}
                    className='rounded object-cover'
                    unoptimized
                  />
                                   {' '}
                  <div className='flex-1'>
                                        <strong>{p.name}</strong> – $
                    {p.price.toFixed(2)}                   {' '}
                    <p className='text-sm text-gray-600'>{p.description}</p>
                    <span className='text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded'>
                      {p.category} {/* Display category */}
                    </span>
                                     {' '}
                  </div>
                                   {' '}
                  <div className='flex flex-col gap-2'>
                                       {' '}
                    <button
                      onClick={() => handleEdit(p)}
                      className='text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'
                    >
                                            Edit                    {' '}
                    </button>
                                       {' '}
                    <button
                      onClick={() => handleDelete(p._id)}
                      className='text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                    >
                                            Delete                    {' '}
                    </button>
                                     {' '}
                  </div>
                                 {' '}
                </li>
              ))}
                         {' '}
            </ul>
          )}
                 {' '}
        </section>
               {' '}
        <section className='p-4 border rounded shadow'>
                   {' '}
          <h2 className='font-semibold text-xl mb-2'>🛒 View Orders</h2>       
            <p>See recent customer orders</p>       {' '}
        </section>
               {' '}
        <section className='p-4 border rounded shadow'>
                   {' '}
          <h2 className='font-semibold text-xl mb-2'>👤 Manage Users</h2>       
            <p>Promote users to admin, remove users, etc.</p>       {' '}
        </section>
             {' '}
      </div>
         {' '}
    </div>
  )
}

// 'use client'

// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// import LogoutButton from '@/components/LogoutButton'
// import Image from 'next/image'

// type Product = {
//   _id: string
//   name: string
//   price: number
//   description: string
//   image: string
// }

// export default function AdminDashboard() {
//   const router = useRouter()
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [isAdmin, setIsAdmin] = useState(false)

//   const [newName, setNewName] = useState('')
//   const [newPrice, setNewPrice] = useState(0)
//   const [newDescription, setNewDescription] = useState('')
//   const [newImage, setNewImage] = useState('')
//   const [editingId, setEditingId] = useState<string | null>(null)

//   // Check token and verify if user is admin
//   useEffect(() => {
//     const checkAdmin = async () => {
//       const token = localStorage.getItem('token')
//       if (!token) return router.push('/login')

//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )

//         const data = await res.json()

//         if (!res.ok || !data.isAdmin) {
//           return router.push('/login') // not admin or token invalid
//         }

//         setIsAdmin(true)
//       } catch (err) {
//         console.error('❌ Auth error:', err)
//         router.push('/login')
//       }
//     }

//     checkAdmin()
//   }, [router])

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/products`
//         )
//         if (!res.ok) throw new Error('Failed to fetch products')
//         const json = await res.json()
//         setProducts(Array.isArray(json) ? json : json.products || [])
//       } catch (err) {
//         console.error('❌ Error:', err)
//         setError('Failed to load products.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (isAdmin) fetchProducts()
//   }, [isAdmin])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const payload = {
//       name: newName,
//       price: newPrice,
//       description: newDescription,
//       image: newImage,
//     }

//     try {
//       const endpoint = editingId
//         ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingId}`
//         : `${process.env.NEXT_PUBLIC_API_URL}/api/products`

//       const method = editingId ? 'PUT' : 'POST'

//       const res = await fetch(endpoint, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(payload),
//       })

//       if (!res.ok) throw new Error('Failed to submit product')
//       const result = await res.json()

//       setProducts((prev) =>
//         editingId
//           ? prev.map((p) => (p._id === editingId ? result : p))
//           : [...prev, result]
//       )

//       setNewName('')
//       setNewPrice(0)
//       setNewDescription('')
//       setNewImage('')
//       setEditingId(null)
//     } catch (err) {
//       console.error('❌ Error submitting product:', err)
//       alert('Failed to submit product.')
//     }
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       )
//       if (!res.ok) throw new Error('Failed to delete')
//       setProducts((prev) => prev.filter((p) => p._id !== id))
//     } catch (err) {
//       console.error('❌ Delete error:', err)
//       alert('Delete failed.')
//     }
//   }

//   const handleEdit = (product: Product) => {
//     setNewName(product.name)
//     setNewPrice(product.price)
//     setNewDescription(product.description)
//     setNewImage(product.image)
//     setEditingId(product._id)
//   }

//   if (!isAdmin || loading) return null

//   return (
//     <div className='p-8'>
//       <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
//       <LogoutButton />

//       <div className='mt-6 space-y-4'>
//         <section className='p-4 border rounded shadow'>
//           <h2 className='font-semibold text-xl mb-2'>📦 Manage Products</h2>
//           <form onSubmit={handleSubmit} className='space-y-2 mb-4'>
//             <input
//               type='text'
//               placeholder='Product Name'
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               className='w-full border px-3 py-2 rounded'
//               required
//             />
//             <input
//               type='number'
//               placeholder='e.g. 99.99'
//               step='0.01'
//               value={newPrice}
//               onChange={(e) => setNewPrice(Number(e.target.value))}
//               className='w-full border px-3 py-2 rounded'
//               required
//             />
//             <input
//               type='text'
//               placeholder='Description'
//               value={newDescription}
//               onChange={(e) => setNewDescription(e.target.value)}
//               className='w-full border px-3 py-2 rounded'
//               required
//             />
//             <input
//               type='url'
//               placeholder='Image URL'
//               value={newImage}
//               onChange={(e) => setNewImage(e.target.value)}
//               className='w-full border px-3 py-2 rounded'
//               required
//             />
//             <button
//               type='submit'
//               className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
//             >
//               {editingId ? 'Update Product' : 'Add Product'}
//             </button>
//           </form>

//           {error ? (
//             <p className='text-red-500'>{error}</p>
//           ) : products.length === 0 ? (
//             <p className='text-gray-500'>No products found.</p>
//           ) : (
//             <ul className='space-y-2'>
//               {products.map((p) => (
//                 <li
//                   key={p._id}
//                   className='border p-3 rounded flex gap-4 items-start'
//                 >
//                   <Image
//                     src={p.image}
//                     alt={p.name}
//                     width={96}
//                     height={96}
//                     className='rounded object-cover'
//                     unoptimized
//                   />
//                   <div className='flex-1'>
//                     <strong>{p.name}</strong> – ${p.price.toFixed(2)}
//                     <p className='text-sm text-gray-600'>{p.description}</p>
//                   </div>
//                   <div className='flex flex-col gap-2'>
//                     <button
//                       onClick={() => handleEdit(p)}
//                       className='text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(p._id)}
//                       className='text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         <section className='p-4 border rounded shadow'>
//           <h2 className='font-semibold text-xl mb-2'>🛒 View Orders</h2>
//           <p>See recent customer orders</p>
//         </section>

//         <section className='p-4 border rounded shadow'>
//           <h2 className='font-semibold text-xl mb-2'>👤 Manage Users</h2>
//           <p>Promote users to admin, remove users, etc.</p>
//         </section>
//       </div>
//     </div>
//   )
// }
