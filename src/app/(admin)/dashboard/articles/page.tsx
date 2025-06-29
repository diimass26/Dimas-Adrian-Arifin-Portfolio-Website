'use client'

import Link from 'next/link'
import Image from 'next/image' // [FIX] Mengimpor komponen Image dari Next.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/types/database'
import { Plus, Edit, Trash2, Calendar, Newspaper, FileText, LoaderCircle } from 'lucide-react'

// Helper functions
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Tanggal tidak tersedia'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const truncateText = (text: string | null, length: number) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const fetchArticles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Gagal fetch artikel:', error.message)
    } else {
      setArticles(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const openDeleteModal = (article: Article) => {
    setSelectedArticle(article)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedArticle) return
    
    setIsDeleting(true)
    const { id, image_url } = selectedArticle

    if (image_url) {
      const filename = new URL(image_url).pathname.split('/').pop()
      if (filename) await supabase.storage.from('articles').remove([filename])
    }

    const { error } = await supabase.from('articles').delete().eq('id', id)
    setIsDeleting(false)

    if (error) {
      console.error('Gagal menghapus artikel: ' + error.message)
    } else {
      setArticles(prev => prev.filter((a) => a.id !== id))
      setShowDeleteModal(false)
      setSelectedArticle(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">Daftar Artikel</h1>
          <p className="text-slate-400 mt-1">Buat dan kelola semua konten tulisan Anda.</p>
        </div>
        <Link href="/dashboard/articles/new" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          Artikel Baru
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : articles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} onEdit={() => router.push(`/dashboard/articles/${article.id}`)} onDelete={() => openDeleteModal(article)} />
          ))}
        </div>
      )}

      {showDeleteModal && selectedArticle && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          articleTitle={selectedArticle.title}
        />
      )}
    </div>
  )
}

// Komponen Kartu Artikel
function ArticleCard({ article, onEdit, onDelete }: { article: Article, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-blue-500/50 hover:-translate-y-1">
      <div className="h-48 w-full overflow-hidden relative">
        {article.image_url ? (
          // [FIX 1] Mengganti <img> dengan <Image /> untuk optimasi dan menghilangkan warning
          <Image 
            src={article.image_url} 
            alt={article.title} 
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <Newspaper className="w-16 h-16 text-slate-600" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-bold text-slate-100">{article.title}</h2>
        <div className="flex items-center text-xs text-slate-500 gap-2 mt-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>Dipublikasikan pada {formatDate(article.published_at)}</span>
        </div>
        <p className="text-slate-400 text-sm mt-3 flex-grow">{truncateText(article.content, 100)}</p>
      </div>
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
        <button onClick={onEdit} className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400 transition-colors"><Edit className="h-4 w-4" /> Edit</button>
        <button onClick={onDelete} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /> Hapus</button>
      </div>
    </div>
  )
}

// Komponen Skeleton
function CardSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg animate-pulse">
      <div className="h-48 bg-slate-700"></div>
      <div className="p-5">
        <div className="h-6 w-3/4 bg-slate-700 rounded mb-3"></div>
        <div className="h-4 w-1/2 bg-slate-700 rounded mb-4"></div>
        <div className="h-4 w-full bg-slate-700 rounded mb-1"></div>
        <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
      </div>
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
        <div className="h-5 w-16 bg-slate-700 rounded"></div>
        <div className="h-5 w-16 bg-slate-700 rounded"></div>
      </div>
    </div>
  )
}

// Komponen Empty State
function EmptyState() {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-slate-700 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
      <FileText className="mx-auto h-12 w-12 text-slate-600" />
      <h3 className="mt-4 text-xl font-semibold text-slate-200">Belum Ada Artikel</h3>
      <p className="mt-2 text-slate-400">Mulailah menulis dan bagikan ide-ide Anda kepada dunia.</p>
      <Link href="/dashboard/articles/new" className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors">
        <Plus className="h-5 w-5" />
        Tulis Artikel Pertama Anda
      </Link>
    </div>
  )
}

// Komponen Modal Konfirmasi Hapus
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting, articleTitle }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, isDeleting: boolean, articleTitle: string }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 sm:mx-0">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <div className="mt-0 text-left">
              <h3 className="text-lg leading-6 font-bold text-slate-100">Hapus Artikel</h3>
              <div className="mt-2">
                <p className="text-sm text-slate-400">
                  {/* [FIX 2] Mengganti tanda kutip dengan entitas HTML */}
                  Apakah Anda yakin ingin menghapus artikel <span className="font-bold text-slate-200">&ldquo;{articleTitle}&rdquo;</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 px-6 py-4 flex flex-row-reverse gap-3">
          <button type="button" onClick={onConfirm} disabled={isDeleting} className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-wait">
            {isDeleting ? <LoaderCircle className="animate-spin h-5 w-5"/> : 'Ya, Hapus'}
          </button>
          <button type="button" onClick={onClose} disabled={isDeleting} className="inline-flex justify-center rounded-md border border-slate-600 px-4 py-2 text-base font-medium text-slate-200 shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-800">
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}