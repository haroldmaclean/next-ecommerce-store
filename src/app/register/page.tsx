'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function RegisterPage() {
  const router = useRouter()
  const register = useAuthStore((state) => state.register)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Register failed')
      }

      // Save token and mark as logged in
      localStorage.setItem('token', data.token)
      register()

      // Redirect to admin
      router.push('/admin')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong')
      }
    }
  }

  return (
    <div className='p-8 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Register</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full border px-3 py-2 rounded'
          required
        />
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
          Register
        </button>
      </form>
    </div>
  )
}
