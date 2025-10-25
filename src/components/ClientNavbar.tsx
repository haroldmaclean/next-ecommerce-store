'use client'

import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import MiniCart from './MiniCart'
import { useAuthStore } from '@/store/useAuthStore'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
// You might need to install 'lucide-react' or similar for icons
// If not, you can use simple span/divs for the icon
import { Menu, X } from 'lucide-react'

export default function ClientNavbar() {
  const { isLoggedIn, logout } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false) // <-- NEW: State for mobile menu
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
    }
  }

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Furniture', slug: 'furniture' },
  ]

  // Helper function to close menu after navigation
  const closeMenuAndNavigate = (path: string) => {
    setIsMenuOpen(false)
    router.push(path)
  }

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />

      {/* Primary Navigation Bar (Top Level) */}
      <nav className='flex justify-between items-center px-4 md:px-6 py-3 bg-white shadow-lg border-b border-gray-200'>
        {/* --- LEFT SECTION: Logo/Home --- */}
        <Link
          href='/'
          className='text-xl sm:text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition'
        >
          NextShop
        </Link>

        {/* --- CENTER SECTION: Global Search Bar (Desktop Only) --- */}
        <form
          onSubmit={handleSearch}
          className='hidden md:flex flex-grow max-w-xl mx-4 lg:mx-8'
        >
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500'
          />
          <button
            type='submit'
            className='bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition'
          >
            🔍 Search
          </button>
        </form>

        {/* --- RIGHT SECTION: User/Cart/Menu Toggle --- */}
        <div className='flex items-center gap-4'>
          {/* Desktop User Links */}
          <div className='hidden md:flex items-center gap-4'>
            <Link
              href='/admin'
              className='text-gray-700 hover:text-blue-600 font-medium'
            >
              Admin
            </Link>
            {isLoggedIn ? (
              <button
                onClick={logout}
                className='text-red-600 hover:text-red-700 font-medium'
              >
                Logout
              </button>
            ) : (
              <Link
                href='/login'
                className='text-gray-700 hover:text-blue-600 font-medium'
              >
                Login
              </Link>
            )}
          </div>

          <MiniCart />

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            className='md:hidden p-1 text-gray-800'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle Menu'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Secondary Navigation Bar (Categories - Desktop Only) */}
      <div className='bg-gray-800 text-white hidden md:block'>
        <div className='max-w-6xl mx-auto flex gap-6 px-6 py-2'>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className='hover:text-blue-300 font-medium transition capitalize'
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href='/products'
            className='hover:text-blue-300 font-medium transition'
          >
            All Products
          </Link>
        </div>
      </div>

      {/* --- MOBILE MENU/SIDEBAR (NEW) --- */}
      {isMenuOpen && (
        <div className='md:hidden bg-white shadow-lg border-t border-gray-200'>
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className='p-4 border-b'>
            <div className='flex'>
              <input
                type='text'
                placeholder='Search products...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500'
              />
              <button
                type='submit'
                className='bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition'
              >
                Search
              </button>
            </div>
          </form>

          {/* Mobile Links */}
          <div className='flex flex-col p-4 space-y-2'>
            {/* Category Links */}
            <h3 className='text-sm font-semibold text-gray-500 pt-2'>
              Categories
            </h3>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => closeMenuAndNavigate(`/categories/${cat.slug}`)}
                className='text-left text-gray-800 hover:text-blue-600 py-1 transition capitalize'
              >
                {cat.name}
              </button>
            ))}

            <button
              onClick={() => closeMenuAndNavigate('/products')}
              className='text-left text-gray-800 hover:text-blue-600 py-1 transition'
            >
              All Products
            </button>

            {/* User Links */}
            <h3 className='text-sm font-semibold text-gray-500 pt-4'>
              Account
            </h3>
            <button
              onClick={() => closeMenuAndNavigate('/admin')}
              className='text-left text-gray-800 hover:text-blue-600 py-1 transition'
            >
              Admin
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }} // Logout closes menu
                className='text-left text-red-600 hover:text-red-700 py-1 transition'
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => closeMenuAndNavigate('/login')}
                className='text-left text-gray-800 hover:text-blue-600 py-1 transition'
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// 'use client'

// import Link from 'next/link'
// import { Toaster } from 'react-hot-toast'
// import MiniCart from './MiniCart'
// import { useAuthStore } from '@/store/useAuthStore'

// export default function ClientNavbar() {
//   const { isLoggedIn, logout } = useAuthStore()

//   return (
//     <>
//       <Toaster position='top-right' reverseOrder={false} />

//       <nav className='flex flex-wrap justify-between items-center p-4 bg-gray-100 shadow-md'>
//         {/* --- LEFT SECTION --- */}
//         <div className='flex flex-wrap items-center gap-6'>
//           {/* Main Navigation Links */}
//           <Link href='/' className='hover:underline font-medium'>
//             Home
//           </Link>
//           <Link href='/products' className='hover:underline font-medium'>
//             Products
//           </Link>

//           {/* --- CATEGORIES SECTION --- */}
//           <div className='flex items-center gap-4'>
//             <Link
//               href='/categories/electronics'
//               className='hover:underline font-medium text-gray-700'
//             >
//               Electronics
//             </Link>
//             <Link
//               href='/categories/fashion'
//               className='hover:underline font-medium text-gray-700'
//             >
//               Fashion
//             </Link>
//             <Link
//               href='/categories/furniture'
//               className='hover:underline font-medium text-gray-700'
//             >
//               Furniture
//             </Link>
//           </div>

//           {/* --- USER SECTION --- */}
//           <Link href='/cart' className='hover:underline font-medium'>
//             Cart
//           </Link>
//           {isLoggedIn ? (
//             <>
//               <Link href='/admin' className='hover:underline font-medium'>
//                 Admin
//               </Link>
//               <button
//                 onClick={logout}
//                 className='hover:underline font-medium text-red-600'
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link href='/login' className='hover:underline font-medium'>
//               Login
//             </Link>
//           )}
//         </div>

//         {/* --- RIGHT SECTION: MINI CART --- */}
//         <MiniCart />
//       </nav>
//     </>
//   )
// }
