'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Basic logic to detect admin
    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem('token', 'admin-token')
      login()
      router.push('/admin') // ✅ Redirect to admin dashboard
    } else if (email && password) {
      localStorage.setItem('token', 'user-token')
      login()
      router.push('/checkout') // ✅ Regular user
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      <input
        type='email'
        placeholder='Email'
        className='border p-2 mb-2 block w-full'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        className='border p-2 mb-4 block w-full'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
      >
        Login
      </button>
    </div>
  )
}
