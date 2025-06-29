// /src/app/layout.tsx (Versi BARU yang minimal)
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider' // Pindahkan AuthProvider ke sini

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dimas Adrian Arifin',
  description: 'Portofolio dan blog personal Dimas Adrian Arifin.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900`}>
        {/* AuthProvider bisa diletakkan di sini untuk membungkus seluruh aplikasi */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}