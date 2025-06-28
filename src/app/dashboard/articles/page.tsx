'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/types/database'

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const fetchArticles = async () => {
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

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Yakin ingin menghapus artikel ini?')
    if (!confirm) return

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Gagal menghapus artikel: ' + error.message)
    } else {
      setArticles(articles.filter((a) => a.id !== id))
      alert('Artikel berhasil dihapus.')
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Artikel</h1>
        <Link
          href="/dashboard/articles/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Artikel Baru
        </Link>
      </div>

      {loading ? (
        <p>Memuat artikel...</p>
      ) : articles.length === 0 ? (
        <p>Tidak ada artikel.</p>
      ) : (
        <table className="w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Judul</th>
              <th className="p-2 border">Slug</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="p-2 border">{article.title}</td>
                <td className="p-2 border">{article.slug}</td>
                <td className="p-2 border">
                  {new Date(article.published_at).toLocaleDateString('id-ID')}
                </td>
                <td className="p-2 border flex gap-2">
                  <Link
                    href={`/dashboard/articles/${article.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
