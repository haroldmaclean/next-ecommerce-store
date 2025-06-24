'use client'

import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import MiniCart from './MiniCart'
import { useAuthStore } from '@/store/useAuthStore'

export default function ClientNavbar() {
  const { isLoggedIn, logout } = useAuthStore()

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />

      <nav className='flex justify-between items-center p-4 bg-gray-100 shadow-md'>
        <div className='flex gap-6'>
          <Link href='/' className='hover:underline font-medium'>
            Home
          </Link>
          <Link href='/products' className='hover:underline font-medium'>
            Products
          </Link>
          <Link href='/cart' className='hover:underline font-medium'>
            Cart
          </Link>
          {isLoggedIn ? (
            <>
              <Link href='/admin' className='hover:underline font-medium'>
                Admin
              </Link>
              <button
                onClick={logout}
                className='hover:underline font-medium text-red-600'
              >
                Logout
              </button>
            </>
          ) : (
            <Link href='/login' className='hover:underline font-medium'>
              Login
            </Link>
          )}
        </div>

        <MiniCart />
      </nav>
    </>
  )
}
