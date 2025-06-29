'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react' // Import ikon

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:bg-red-500/90 hover:text-white"
    >
      <LogOut className="h-5 w-5" />
      <span>Logout</span>
    </button>
  )
}