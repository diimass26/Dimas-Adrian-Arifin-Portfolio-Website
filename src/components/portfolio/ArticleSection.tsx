'use client'
import type { Article } from '@/types/database';
import Link from 'next/link';
import { Newspaper, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function ArticleSection({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section id="articles" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-12">Artikel Terbaru</h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {articles.map(article => (
            <motion.div variants={cardVariants} key={article.id}>
              <Link href={`/articles/${article.slug}`} className="group block bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden h-full flex flex-col">
                <div className="h-48 w-full overflow-hidden relative">
                  {/* [GANTI GAMBAR] Ganti dengan gambar thumbnail artikel */}
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Newspaper className="w-16 h-16 text-slate-600"/></div>
                  )}
                  <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400">
                    Artikel
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-sm text-slate-400 mb-2">{formatDate(article.published_at)}</p>
                  <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors flex-grow">{article.title}</h3>
                  <div className="inline-flex items-center gap-2 text-blue-400 font-semibold mt-4">
                    Baca Selengkapnya <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}