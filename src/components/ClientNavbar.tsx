'use client'

import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import MiniCart from './MiniCart'

export default function ClientNavbar() {
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
        </div>
        <MiniCart />
      </nav>
    </>
  )
}
