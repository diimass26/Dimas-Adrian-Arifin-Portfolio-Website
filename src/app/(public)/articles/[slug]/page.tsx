// /src/app/(portfolio)/articles/[slug]/page.tsx

import { getArticleBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Calendar, ArrowLeft } from "lucide-react";
import type { Metadata } from 'next';

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Tanggal tidak valid';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Interface untuk props
interface Props {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// Fungsi untuk membuat metadata dinamis (penting untuk SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params since it's now a Promise in Next.js 15
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  // Membuat deskripsi singkat dari konten (tanpa Markdown)
  const description = article.content?.replace(/#/g, '').replace(/\*/g, '').substring(0, 155) || "Sebuah artikel oleh Dimas Adrian Arifin.";

  return {
    title: `${article.title} | Dimas Adrian Arifin`,
    description: description,
    openGraph: {
      title: article.title,
      description: description,
      images: [
        {
          url: article.image_url || '/default-og-image.png', // Sediakan gambar default di /public
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  // Await the params since it's now a Promise in Next.js 15
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  // Jika artikel tidak ditemukan berdasarkan slug, tampilkan halaman 404
  if (!article) {
    notFound();
  }

  return (
    <article className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-8">
          <Link href="/articles" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Semua Artikel
          </Link>
        </div>
        
        <header className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 leading-tight">{article.title}</h1>
          <div className="flex items-center justify-center text-sm text-slate-400 gap-2 mt-4">
            <Calendar className="h-4 w-4" />
            <span>Dipublikasikan pada {formatDate(article.published_at)}</span>
          </div>
        </header>

        {article.image_url && (
          <div className="max-w-5xl mx-auto mb-12">
            <Image 
              src={article.image_url} 
              alt={`Thumbnail untuk artikel ${article.title}`}
              width={1200}
              height={630}
              priority
              className="rounded-lg object-cover w-full h-auto aspect-video shadow-lg shadow-black/30"
            />
          </div>
        )}
        
        {/* Di sinilah konten Markdown akan ditampilkan */}
        <div className="prose prose-invert prose-lg max-w-3xl mx-auto
                        prose-p:leading-relaxed
                        prose-headings:text-slate-100
                        prose-p:text-slate-300
                        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-slate-200 
                        prose-blockquote:border-l-blue-500 prose-blockquote:text-slate-400
                        prose-code:text-yellow-300 prose-code:bg-slate-800 prose-code:p-1 prose-code:rounded-md
                        prose-pre:bg-slate-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}