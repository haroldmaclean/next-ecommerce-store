// 'use client'

// import { useRouter } from 'next/navigation'
// import { useAuthStore } from '@/store/useAuthStore'
// import { useState } from 'react'

// export default function LoginPage() {
//   const router = useRouter()
//   const login = useAuthStore((state) => state.login)

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const handleLogin = () => {
//     // Basic logic to detect admin
//     if (email === 'admin@example.com' && password === 'admin123') {
//       localStorage.setItem('token', 'admin-token')
//       login()
//       router.push('/admin') // ✅ Redirect to admin dashboard
//     } else if (email && password) {
//       localStorage.setItem('token', 'user-token')
//       login()
//       router.push('/checkout') // ✅ Regular user
//     } else {
//       alert('Invalid credentials')
//     }
//   }

//   return (
//     <div className='p-8'>
//       <h1 className='text-2xl font-bold mb-4'>Login</h1>
//       <input
//         type='email'
//         placeholder='Email'
//         className='border p-2 mb-2 block w-full'
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type='password'
//         placeholder='Password'
//         className='border p-2 mb-4 block w-full'
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button
//         onClick={handleLogin}
//         className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
//       >
//         Login
//       </button>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Save token and mark as logged in
      localStorage.setItem('token', data.token)
      login()

      // Redirect to admin
      router.push('/admin')
    }catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message)
  } else {
    setError('Something went wrong')
  }
  }

  return (
    <div className='p-8 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border px-3 py-2 rounded'
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full border px-3 py-2 rounded'
          required
        />
        {error && <p className='text-red-500'>{error}</p>}
        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Login
        </button>
      </form>
    </div>
  );
}
