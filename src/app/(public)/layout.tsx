// /src/app/(portfolio)/layout.tsx (Layout BARU untuk publik)
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-20 pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}