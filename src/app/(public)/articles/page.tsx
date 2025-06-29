// /src/app/(portfolio)/articles/page.tsx

import { getAllArticles } from "@/lib/data";
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

// Metadata untuk halaman ini (penting untuk SEO)
export const metadata: Metadata = {
  title: 'Artikel | Dimas Adrian Arifin',
  description: 'Kumpulan tulisan, ide, dan tutorial seputar pengembangan web, kecerdasan buatan, dan teknologi oleh Dimas Adrian Arifin.',
};

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Tanggal tidak valid';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Komponen Kartu khusus untuk halaman daftar artikel
function PortfolioArticleCard({ article }: { article: Awaited<ReturnType<typeof getAllArticles>>[0] }) {
  return (
    <Link 
      href={`/articles/${article.slug}`} 
      className="group bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-blue-500 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10"
    >
      <div className="h-56 w-full overflow-hidden relative">
        {article.image_url ? (
          <Image 
            src={article.image_url} 
            alt={article.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <Newspaper className="w-16 h-16 text-slate-600"/>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
          <Calendar className="h-4 w-4"/>
          {formatDate(article.published_at)}
        </p>
        <h3 className="text-xl font-semibold text-slate-100 group-hover:text-blue-400 transition-colors flex-grow">
          {article.title}
        </h3>
        <div className="inline-flex items-center gap-2 text-blue-400 font-semibold mt-4">
          Baca Selengkapnya <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
        </div>
      </div>
    </Link>
  );
}

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="py-12 md:py-16">
      <header className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
          Semua Artikel
        </h1>
        <p className="text-lg text-slate-400 mt-3 max-w-2xl mx-auto">
          Jelajahi semua tulisan, ide, dan tutorial yang telah saya bagikan.
        </p>
      </header>
      
      {articles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <PortfolioArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 mt-16 border-2 border-dashed border-slate-700 rounded-lg p-12">
            <Newspaper className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-4 text-xl font-semibold text-slate-200">Belum Ada Tulisan</h3>
            <p className="mt-2 text-slate-400">Saat ini belum ada artikel yang dipublikasikan. Cek kembali nanti!</p>
        </div>
      )}
    </div>
  );
}