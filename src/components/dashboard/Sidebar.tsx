'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import LogoutButton from '@/components/LogoutButton'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/articles', label: 'Articles' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/activities', label: 'Activities' },
  { href: '/dashboard/profile', label: 'Edit Profile' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white h-screen border-r p-4 fixed flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'block px-3 py-2 rounded hover:bg-blue-100',
                pathname === item.href && 'bg-blue-200 font-semibold'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  )
}