'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/types/database'

interface ArticleFormProps {
  initialData?: Article
}

export default function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const generateSlug = (value: string) => {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    setSlug(slug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let image_url = initialData?.image_url ?? null

    // Upload thumbnail jika ada
    if (imageFile) {
      if (initialData?.image_url) {
        const oldFile = new URL(initialData.image_url).pathname.split('/').pop()
        if (oldFile) {
          await supabase.storage.from('articles').remove([oldFile])
        }
      }

      const ext = imageFile.name.split('.').pop()
      const filename = `article-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('articles')
        .upload(filename, imageFile)

      if (uploadError) {
        alert('Gagal upload thumbnail: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: publicData } = supabase.storage
        .from('articles')
        .getPublicUrl(filename)

      image_url = publicData.publicUrl
    }

    if (initialData) {
      // Mode EDIT
      const { error } = await supabase
        .from('articles')
        .update({
          title,
          slug,
          content,
          image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', initialData.id)

      if (error) {
        alert('Gagal update artikel: ' + error.message)
        setSaving(false)
        return
      } else {
        alert('Artikel berhasil diperbarui.')
      }
    } else {
      // Mode CREATE
      const { error } = await supabase
        .from('articles')
        .insert([{ title, slug, content, image_url }])

      if (error) {
        alert('Gagal menyimpan artikel: ' + error.message)
        setSaving(false)
        return
      } else {
        alert('Artikel berhasil ditambahkan.')
      }
    }

    // ✅ Redirect langsung ke dashboard articles
    router.push('/dashboard/articles')
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Judul</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (!initialData) generateSlug(e.target.value)
          }}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Konten</label>
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Thumbnail</label>
        {initialData?.image_url && (
          <img
            src={initialData.image_url}
            alt="thumbnail"
            className="w-32 h-32 object-cover rounded mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Simpan Artikel'}
      </button>
    </form>
  )
}
