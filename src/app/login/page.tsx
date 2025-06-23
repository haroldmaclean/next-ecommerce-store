'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Simulated login logic
    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem('token', 'admin-token')
      router.push('/dashboard') // Redirect to admin dashboard
    } else if (email && password) {
      localStorage.setItem('token', 'user-token')
      router.push('/checkout') // Redirect to checkout for regular users
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div className='p-8 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>

      <input
        type='email'
        placeholder='Email'
        className='w-full p-2 mb-4 border rounded'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type='password'
        placeholder='Password'
        className='w-full p-2 mb-4 border rounded'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full'
      >
        Login
      </button>
    </div>
  )
}
