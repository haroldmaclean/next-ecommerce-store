// 'use client'

// import Link from 'next/link'
// import { useCartStore, CartItem } from '@/store/useCartStore'

// export default function CartIcon() {
//   const cart = useCartStore((state) => state.cart)

//   const totalItems = cart.reduce(
//     (sum: number, item: CartItem) => sum + item.quantity,
//     0
//   )

//   return (
//     <Link href='/cart' className='relative p-2 block'>
//       <svg
//         xmlns='http://www.w3.org/2000/svg'
//         className='h-6 w-6 text-gray-700 hover:text-blue-600 transition'
//         fill='none'
//         viewBox='0 0 24 24'
//         stroke='currentColor'
//       >
//         <path
//           strokeLinecap='round'
//           strokeLinejoin='round'
//           strokeWidth={2}
//           d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8m13.2-8l1.6 8M7 13L5.4 5M16 21a1 1 0 11-2 0 1 1 0 012 0zm-8 0a1 1 0 11-2 0 1 1 0 012 0z'
//         />
//       </svg>

//       {totalItems > 0 && (
//         <span className='absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
//           {totalItems}
//         </span>
//       )}
//     </Link>
//   )
// }
