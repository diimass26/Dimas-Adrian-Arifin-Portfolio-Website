// /src/app/(portfolio)/layout.tsx

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FlashlightEffect from '@/components/ui/FlashlightEffect'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 2. TAMBAHKAN KOMPONEN EFEK DI SINI */}
      <FlashlightEffect />

      {/* 3. Bungkus semua konten lain dalam div dengan z-index */}
      <div className="relative z-40">
        <Navbar />
        <main className="container mx-auto px-10 pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}