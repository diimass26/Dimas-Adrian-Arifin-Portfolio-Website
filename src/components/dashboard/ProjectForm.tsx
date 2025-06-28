'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'

interface ProjectFormProps {
  initialData?: Project
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter()

  const [title, setTitle]           = useState(initialData?.title        ?? '')
  const [description, setDesc]      = useState(initialData?.description  ?? '')
  const [techStack, setTechStack]   = useState(
    initialData?.tech_stack.join(', ') ?? ''
  )
  const [link, setLink]             = useState(initialData?.link         ?? '')
  const [imageFile, setImageFile]   = useState<File | null>(null)
  const [saving, setSaving]         = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    /* ---------- thumbnail upload ---------- */
    let image_url = initialData?.image_url ?? null

    if (imageFile) {
      /* hapus file lama jika ada */
      if (initialData?.image_url) {
        const old = new URL(initialData.image_url).pathname.split('/').pop()
        if (old) await supabase.storage.from('projects').remove([old])
      }

      const ext       = imageFile.name.split('.').pop()
      const fileName  = `project-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('projects')
        .upload(fileName, imageFile)

      if (upErr) {
        alert(`Upload gambar gagal: ${upErr.message}`)
        setSaving(false)
        return
      }

      const { data } = supabase.storage.from('projects').getPublicUrl(fileName)
      image_url = data.publicUrl
    }

    /* ---------- insert / update ---------- */
    const payload = {
      title,
      description,
      tech_stack : techStack.split(',').map(t => t.trim()),
      link,
      image_url,
    }

    const { error } = initialData
      ? await supabase.from('projects').update(payload).eq('id', initialData.id)
      : await supabase.from('projects').insert(payload)

    setSaving(false)

    if (error) {
      alert(`Gagal menyimpan project: ${error.message}`)
      return
    }

    alert('Project berhasil disimpan!')
    router.push('/dashboard/projects')    // ✅ redirect di sini
  }

  /* ---------- UI ---------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* judul */}
      <div>
        <label className="block font-medium mb-1">Judul</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* deskripsi */}
      <div>
        <label className="block font-medium mb-1">Deskripsi</label>
        <textarea
          rows={4}
          value={description}
          onChange={e => setDesc(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* tech stack */}
      <div>
        <label className="block font-medium mb-1">Tech Stack</label>
        <input
          placeholder="Next.js, Tailwind, Supabase"
          value={techStack}
          onChange={e => setTechStack(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* link */}
      <div>
        <label className="block font-medium mb-1">Link (GitHub / Demo)</label>
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* thumbnail */}
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
          onChange={e => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Menyimpan…' : initialData ? 'Simpan Perubahan' : 'Tambah Project'}
      </button>
    </form>
  )
}
