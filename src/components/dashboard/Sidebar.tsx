'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { 
  LayoutDashboard, 
  Newspaper, 
  FolderKanban, 
  Activity, 
  User,
  PanelLeftClose, // Contoh ikon untuk judul
} from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

// Menambahkan properti icon ke dalam tipe navItems
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/articles', label: 'Articles', icon: Newspaper },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/activities', label: 'Activities', icon: Activity },
  { href: '/dashboard/profile', label: 'Edit Profile', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed flex h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-900 p-5">
      <div>
        <div className="mb-8 flex items-center gap-3">
          {/* Anda bisa mengganti ini dengan logo Anda */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
             <PanelLeftClose className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-wider text-slate-200">
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-50',
                  {
                    'bg-slate-800 text-slate-50 font-medium': pathname === item.href,
                  }
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  )
}