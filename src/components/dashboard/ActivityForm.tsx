'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Activity } from '@/types/database'

interface Props {
  initialData?: Activity
}

export default function ActivityForm({ initialData }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [title, setTitle]           = useState(initialData?.title ?? '')
  const [type, setType]             = useState(initialData?.type ?? 'Experience')
  const [organization, setOrg]      = useState(initialData?.organization ?? '')
  const [role, setRole]             = useState(initialData?.role ?? '')
  const [startDate, setStart]       = useState(initialData?.start_date ?? '')
  const [endDate, setEnd]           = useState(initialData?.end_date ?? '')
  const [description, setDesc]      = useState(initialData?.description ?? '')
  const [imageFile, setImageFile]   = useState<File | null>(null)

  const activityTypes = [
    'Experience', 'Volunteering', 'Organization', 'Competition', 'Internship', 'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let image_url = initialData?.image_url ?? null

    if (imageFile) {
      // Remove old image if exists
      if (initialData?.image_url) {
        const old = new URL(initialData.image_url).pathname.split('/').pop()
        if (old) await supabase.storage.from('activities').remove([old])
      }

      const ext = imageFile.name.split('.').pop()
      const filename = `activity-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('activities')
        .upload(filename, imageFile)

      if (uploadError) {
        alert(`Upload gagal: ${uploadError.message}`)
        setSaving(false)
        return
      }

      const { data } = supabase.storage.from('activities').getPublicUrl(filename)
      image_url = data.publicUrl
    }

    const payload = {
      title,
      type,
      organization,
      role,
      start_date: startDate,
      end_date: endDate || null,
      description,
      image_url,
    }

    const { error } = initialData
      ? await supabase.from('activities').update(payload).eq('id', initialData.id)
      : await supabase.from('activities').insert(payload)

    setSaving(false)

    if (error) {
      alert('Gagal menyimpan aktivitas: ' + error.message)
      return
    }

    alert('Aktivitas berhasil disimpan!')
    router.push('/dashboard/activities')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Judul</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Jenis Aktivitas</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          {activityTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Organisasi</label>
        <input
          value={organization}
          onChange={e => setOrg(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Peran</label>
        <input
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium">Tanggal Mulai</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStart(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium">Tanggal Selesai</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEnd(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Deskripsi</label>
        <textarea
          rows={4}
          value={description}
          onChange={e => setDesc(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Gambar (opsional)</label>
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
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Menyimpan…' : initialData ? 'Simpan Perubahan' : 'Tambah Aktivitas'}
      </button>
    </form>
  )
}
