import type { Article } from '@/types/database';
import Link from 'next/link';
import { Newspaper, ArrowRight } from 'lucide-react';

const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ArticleSection({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section id="articles" className="py-20 bg-slate-800/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-12">Artikel Terbaru</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map(article => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-blue-500 hover:-translate-y-1">
              <div className="h-48 w-full overflow-hidden">
                {article.image_url ? (
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Newspaper className="w-16 h-16 text-slate-600"/></div>
                )}
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-400 mb-2">{formatDate(article.published_at)}</p>
                <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">{article.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}