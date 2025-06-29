'use client'

import { useState, KeyboardEvent } from 'react'
import Image from 'next/image' // [FIX] Mengimpor komponen Image dari Next.js
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
// [FIX] Ikon yang tidak terpakai ('ImageIcon', 'LinkIcon', 'Code') telah dihapus
import { Save, LoaderCircle, UploadCloud, X } from 'lucide-react'

interface ProjectFormProps {
  initialData?: Project
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter()

  // Form states
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDesc] = useState(initialData?.description ?? '')
  const [link, setLink] = useState(initialData?.link ?? '')
  const [saving, setSaving] = useState(false)
  
  // Tech stack tag states
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack ?? [])
  const [currentTag, setCurrentTag] = useState('')

  // Image handling states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url ?? null)

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

  const handleTechStackKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim() !== '') {
      e.preventDefault()
      if (!techStack.includes(currentTag.trim())) {
        setTechStack([...techStack, currentTag.trim()])
      }
      setCurrentTag('')
    }
  }

  const removeTechTag = (tagToRemove: string) => {
    setTechStack(techStack.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let image_url = initialData?.image_url ?? null
    
    if (imageFile || (initialData?.image_url && !imagePreview)) {
      if (initialData?.image_url) {
        const oldFile = new URL(initialData.image_url).pathname.split('/').pop()
        if (oldFile) await supabase.storage.from('projects').remove([oldFile])
      }
      image_url = null;
    }

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const fileName = `project-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('projects').upload(fileName, imageFile)

      if (upErr) {
        alert(`Upload gambar gagal: ${upErr.message}`)
        setSaving(false)
        return
      }

      const { data } = supabase.storage.from('projects').getPublicUrl(fileName)
      image_url = data.publicUrl
    }

    const payload = {
      title,
      description,
      tech_stack: techStack,
      link,
      image_url,
    }

    const { error } = initialData
      ? await supabase.from('projects').update(payload).eq('id', initialData.id)
      : await supabase.from('projects').insert(payload)

    setSaving(false)

    if (error) {
      alert(`Gagal menyimpan project: ${error.message}`)
    } else {
      alert('Project berhasil disimpan!')
      router.push('/dashboard/projects')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm space-y-8">
        {/* Detail Proyek */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Judul Proyek</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Deskripsi</label>
            <textarea id="description" rows={4} value={description} onChange={e => setDesc(e.target.value)} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="tech-stack" className="block text-sm font-medium text-slate-300 mb-2">Tech Stack (tekan Enter untuk tambah)</label>
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-md border border-slate-700 bg-slate-900">
              {techStack.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-sm font-medium px-2.5 py-1 rounded">
                  {tag}
                  <button type="button" onClick={() => removeTechTag(tag)} className="text-blue-200 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
              <input 
                id="tech-stack"
                type="text"
                placeholder={techStack.length === 0 ? "Next.js, Tailwind..." : ""}
                value={currentTag}
                onChange={e => setCurrentTag(e.target.value)}
                onKeyDown={handleTechStackKeyDown}
                className="bg-transparent flex-grow p-1 focus:outline-none text-slate-200 min-w-[100px]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-slate-300 mb-2">Link (GitHub / Demo)</label>
            <input id="link" type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Thumbnail Proyek */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Thumbnail</label>
          {imagePreview ? (
            <div className="relative w-full max-w-lg">
              {/* [FIX] Mengganti <img> dengan <Image /> */}
              <Image 
                src={imagePreview} 
                alt="Pratinjau thumbnail" 
                width={800} 
                height={450}
                className="w-full h-auto object-cover rounded-lg border border-slate-700" 
              />
              <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-slate-500" />
                <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Klik untuk mengunggah</span> atau seret dan lepas</p>
                <p className="text-xs text-slate-500">PNG, JPG, WEBP</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-wait">
          {saving ? <LoaderCircle className="animate-spin h-5 w-5"/> : <Save className="h-5 w-5" />}
          {saving ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Tambah Proyek')}
        </button>
      </div>
    </form>
  )
}