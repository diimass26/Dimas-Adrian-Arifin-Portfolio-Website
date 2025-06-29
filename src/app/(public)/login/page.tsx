// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogIn } from 'lucide-react'

// Fungsi checkProfile tidak perlu diubah
const checkProfile = async (userId: string, email: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (!data) {
    await supabase.from('profiles').insert([
      {
        id: userId,
        full_name: email.split('@')[0],
        avatar_url: '',
        bio: '',
      },
    ])
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const user = data.user
    if (user) {
      await checkProfile(user.id, user.email!)
    }
    
    router.refresh()
    router.push('/dashboard')
    // Tidak perlu mematikan loading di sini karena halaman akan berganti
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-slate-400" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-100">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 shadow-sm space-y-6"
        >
          {/* Input untuk Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input untuk Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-semibold transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}