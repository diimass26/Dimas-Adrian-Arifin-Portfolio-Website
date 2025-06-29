'use client'

import { useState } from 'react' // [FIX] 'useEffect' dihapus karena tidak digunakan
import Image from 'next/image' // [FIX] Mengimpor komponen Image dari Next.js
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/types/database'
// [FIX] 'ImageIcon' dan 'ArrowLeft' dihapus karena tidak digunakan
import { Save, LoaderCircle, UploadCloud, X, Lock, Unlock } from 'lucide-react' 
import Link from 'next/link'

interface ArticleFormProps {
  initialData?: Article
}

export default function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter()

  // Form states
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [saving, setSaving] = useState(false)
  
  // Slug lock state
  const [isSlugLocked, setIsSlugLocked] = useState(!!initialData)

  // Image handling states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url ?? null)

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word chars
      .replace(/\s+/g, '-')     // replace spaces with -
      .replace(/-+/g, '-')      // replace multiple - with single -
  }
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!isSlugLocked) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let image_url = initialData?.image_url ?? null
    
    if (imageFile || (initialData?.image_url && !imagePreview)) {
      if (initialData?.image_url) {
        const oldFile = new URL(initialData.image_url).pathname.split('/').pop()
        if (oldFile) await supabase.storage.from('articles').remove([oldFile])
      }
      image_url = null
    }

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const filename = `article-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('articles').upload(filename, imageFile)

      if (uploadError) {
        alert('Gagal upload thumbnail: ' + uploadError.message)
        setSaving(false)
        return
      }
      const { data: publicData } = supabase.storage.from('articles').getPublicUrl(filename)
      image_url = publicData.publicUrl
    }

    const payload = {
      title, slug, content, image_url,
      updated_at: initialData ? new Date().toISOString() : undefined,
    }

    const { error } = initialData
      ? await supabase.from('articles').update(payload).eq('id', initialData.id)
      : await supabase.from('articles').insert([payload])
      
    setSaving(false)
    if (error) {
      alert('Gagal menyimpan artikel: ' + error.message)
    } else {
      alert(initialData ? 'Artikel berhasil diperbarui.' : 'Artikel berhasil ditambahkan.')
      router.push('/dashboard/articles')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Utama (Konten) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Judul Artikel</label>
            <input id="title" type="text" value={title} onChange={handleTitleChange} required className="w-full text-2xl font-bold rounded-md border-0 bg-transparent px-0 py-2 text-slate-100 focus:outline-none focus:ring-0" placeholder="Judul Artikel Anda..."/>
          </div>
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">Konten</label>
            <textarea id="content" rows={20} value={content} onChange={e => setContent(e.target.value)} required className="w-full rounded-md border-0 bg-transparent p-0 text-slate-300 focus:outline-none focus:ring-0" placeholder="Mulai tulis cerita Anda..."/>
          </div>
        </div>

        {/* Kolom Samping (Pengaturan) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Pengaturan</h3>
            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
              <div className="relative">
                <input id="slug" type="text" value={slug} onChange={e => setSlug(e.target.value)} required disabled={isSlugLocked} className="w-full rounded-md border border-slate-700 bg-slate-900 pr-10 pl-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-800 disabled:text-slate-400" />
                <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white rounded-md">
                  {isSlugLocked ? <Lock className="h-4 w-4"/> : <Unlock className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Thumbnail</label>
              {imagePreview ? (
                <div className="relative w-full">
                  {/* [FIX] Mengganti <img> dengan <Image /> untuk optimasi */}
                  <Image src={imagePreview} alt="Pratinjau thumbnail" width={500} height={281} className="w-full h-auto object-cover rounded-lg border border-slate-700" />
                  <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-3 text-slate-500" />
                    <p className="text-xs text-slate-400">Unggah Gambar</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-4 mt-8">
        <Link href="/dashboard/articles" className="text-slate-400 hover:text-white transition-colors">Batal</Link>
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait">
          {saving ? <LoaderCircle className="animate-spin h-5 w-5"/> : <Save className="h-5 w-5" />}
          {saving ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Terbitkan Artikel')}
        </button>
      </div>
    </form>
  )
}