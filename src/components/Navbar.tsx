'use client' // Kita gunakan 'use client' agar bisa memakai hook usePathname untuk menandai link aktif

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Code2 } from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'Contact Me', href: '/contact' }, // Mengarah ke section 'contact' di halaman utama
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-sm z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Bagian Kiri: Logo dan Nama */}
        <Link href="/" className="flex items-center gap-2 group">
          <Code2 className="h-8 w-8 text-blue-500 group-hover:animate-pulse" />
          <span className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
            Dimas Adrian Arifin
          </span>
        </Link>

        {/* Bagian Kanan: Navigasi dan Tombol Login */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    'text-sm font-medium transition-colors',
                    {
                      'text-white': isActive,
                      'text-slate-400 hover:text-white': !isActive,
                    }
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
          
          <Link
            href="/login"
            className="bg-slate-800 text-sm text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors border border-slate-700"
          >
            Login
          </Link>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
    </header>
  )
}