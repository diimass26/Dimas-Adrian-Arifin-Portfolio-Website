'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
      } else {
        setSessionChecked(true)
      }
    }

    checkSession()
  }, [router])

  if (!sessionChecked) return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Memeriksa sesi login...</p>
    </div>
  ) // atau ganti dengan <LoadingSpinner />

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full min-h-screen bg-gray-900 p-6">
        {children}
      </main>
    </div>
  )
}
