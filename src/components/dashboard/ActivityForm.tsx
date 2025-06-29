'use client'

import { useState } from 'react' // [FIX] 'useEffect' dihapus karena tidak digunakan
import Image from 'next/image' // [FIX] Mengimpor komponen Image dari Next.js
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Activity } from '@/types/database'
// [FIX] 'Image as ImageIcon' dihapus karena tidak digunakan
import { Save, LoaderCircle, ChevronsUpDown, UploadCloud, X } from 'lucide-react'

interface Props {
  initialData?: Activity
}

export default function ActivityForm({ initialData }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // States for form fields
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [type, setType] = useState(initialData?.type ?? 'Experience')
  const [organization, setOrg] = useState(initialData?.organization ?? '')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [startDate, setStart] = useState(initialData?.start_date ?? '')
  const [endDate, setEnd] = useState(initialData?.end_date ?? null)
  const [description, setDesc] = useState(initialData?.description ?? '')
  
  // States for file handling
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url ?? null)

  const activityTypes = [
    'Experience', 'Volunteering', 'Organization', 'Competition', 'Internship', 'Other'
  ]

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
        if (oldFile) await supabase.storage.from('activities').remove([oldFile])
      }
      image_url = null;
    }

    if (imageFile) {
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
      title, type, organization, role,
      start_date: startDate,
      end_date: endDate || null,
      description, image_url,
    }

    const { error } = initialData
      ? await supabase.from('activities').update(payload).eq('id', initialData.id)
      : await supabase.from('activities').insert(payload)

    setSaving(false)
    if (error) {
      alert('Gagal menyimpan aktivitas: ' + error.message)
    } else {
      alert('Aktivitas berhasil disimpan!')
      router.push('/dashboard/activities')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Judul */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Judul Aktivitas</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Jenis Aktivitas */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-2">Jenis Aktivitas</label>
            <div className="relative">
              <select id="type" value={type} onChange={e => setType(e.target.value)} className="w-full appearance-none rounded-md border border-slate-700 bg-slate-900 px-4 py-3 pr-10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {activityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Organisasi */}
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">Organisasi / Penyelenggara</label>
            <input id="organization" type="text" value={organization} onChange={e => setOrg(e.target.value)} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Peran */}
          <div className="md:col-span-2">
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">Peran</label>
            <input id="role" type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Tanggal Mulai & Selesai */}
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-slate-300 mb-2">Tanggal Mulai</label>
            <input id="start-date" type="date" value={startDate} onChange={e => setStart(e.target.value)} required className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ colorScheme: 'dark' }} />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-slate-300 mb-2">Tanggal Selesai (opsional)</label>
            <input id="end-date" type="date" value={endDate ?? ''} onChange={e => setEnd(e.target.value)} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ colorScheme: 'dark' }} />
          </div>

          {/* Deskripsi */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Deskripsi</label>
            <textarea id="description" rows={5} value={description} onChange={e => setDesc(e.target.value)} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Pengunggah Gambar */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">Gambar (opsional)</label>
            {imagePreview ? (
              <div className="relative w-full max-w-sm">
                {/* [FIX] Mengganti <img> dengan <Image /> untuk optimasi */}
                <Image src={imagePreview} alt="Pratinjau aktivitas" width={500} height={281} className="w-full h-auto object-cover rounded-lg border border-slate-700" />
                <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-slate-500" />
                  <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Klik untuk mengunggah</span> atau seret dan lepas</p>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF (MAX. 800x400px)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-md font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-wait">
          {saving ? <LoaderCircle className="animate-spin h-5 w-5"/> : <Save className="h-5 w-5" />}
          {saving ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Tambah Aktivitas')}
        </button>
      </div>
    </form>
  )
}