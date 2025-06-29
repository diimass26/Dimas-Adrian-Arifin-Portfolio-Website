'use client'

import { useState, useEffect, useRef, type ElementType } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, Trash2, User, ImageOff, Save, LoaderCircle } from 'lucide-react'

type Profile = {
  id: string
  full_name: string
  bio: string
  avatar_url: string | null
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Logika untuk fetch, update, upload, dan delete tidak diubah,
  // hanya state loading yang disesuaikan namanya untuk kejelasan.
  // (Semua fungsi handleUpdate, handleFileChange, handleDeleteAvatar, dll. tetap sama)

  const fetchProfile = async () => {
    setInitialLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setInitialLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) setProfile(data)
    setInitialLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      bio: profile.bio,
    }).eq('id', profile.id)
    setSaving(false)
    if (error) alert('Gagal memperbarui profil: ' + error.message)
    else alert('Profil berhasil diperbarui!')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const uniqueFileName = `${profile.id}_${new Date().getTime()}.${fileExt}`

    if (profile.avatar_url) {
      const urlObject = new URL(profile.avatar_url)
      const oldFileName = urlObject.pathname.split('/').pop()
      if (oldFileName) {
        await supabase.storage.from('avatars').remove([oldFileName])
      }
    }

    const { error: uploadError } = await supabase.storage.from('avatars').upload(uniqueFileName, file)
    if (uploadError) {
      alert('Gagal mengunggah avatar: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(uniqueFileName)
    const newAvatarUrl = publicUrlData.publicUrl

    const { error: updateDbError } = await supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', profile.id)
    if (updateDbError) {
      alert('Gagal memperbarui URL avatar: ' + updateDbError.message)
    } else {
      setProfile({ ...profile, avatar_url: newAvatarUrl })
      alert('Avatar berhasil diunggah!')
    }
    setUploading(false)
  }

  const handleDeleteAvatar = async () => {
    if (!profile || !profile.avatar_url) return
    setDeleting(true)
    const urlObject = new URL(profile.avatar_url)
    const fileName = urlObject.pathname.split('/').pop()
    if (!fileName) {
      alert('Nama file avatar tidak ditemukan.')
      setDeleting(false)
      return
    }
    await supabase.storage.from('avatars').remove([fileName])
    const { error } = await supabase.from('profiles').update({ avatar_url: null }).eq('id', profile.id)
    if (error) {
      alert('Gagal menghapus avatar: ' + error.message)
    } else {
      setProfile({ ...profile, avatar_url: null })
      alert('Avatar berhasil dihapus.')
    }
    setDeleting(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (initialLoading) return <ProfileFormSkeleton />
  if (!profile) return <p className="text-slate-400">Profil tidak ditemukan. Pastikan Anda sudah login.</p>

  const isActionInProgress = saving || uploading || deleting;

  return (
    <form onSubmit={handleUpdate} className="max-w-3xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm">
        {/* Bagian Informasi Personal */}
        <div className="p-6 space-y-6">
          <h3 className="text-xl font-semibold text-slate-100">Informasi Personal</h3>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
            <input
              id="fullName"
              type="text"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
            <textarea
              id="bio"
              rows={4}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>
        </div>

        {/* Bagian Avatar */}
        <div className="p-6 border-t border-slate-700 space-y-4">
          <h3 className="text-xl font-semibold text-slate-100">Avatar</h3>
          <div className="flex items-center gap-6">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 object-cover rounded-full border-2 border-slate-600" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                <ImageOff className="w-10 h-10 text-slate-500" />
              </div>
            )}
            <div className="flex items-center gap-3">
              {/* Tombol palsu yang memicu input file asli */}
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-wait">
                {uploading ? <LoaderCircle className="animate-spin h-5 w-5"/> : <Upload className="h-5 w-5" />}
                {uploading ? 'Mengunggah...' : 'Ubah Foto'}
              </button>
              {/* Input file asli yang disembunyikan */}
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
              
              {profile.avatar_url && (
                <button type="button" onClick={handleDeleteAvatar} disabled={deleting} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-wait">
                  {deleting ? <LoaderCircle className="animate-spin h-5 w-5"/> : <Trash2 className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Bagian Footer Tombol Simpan */}
        <div className="p-6 border-t border-slate-700 flex justify-end">
          <button type="submit" disabled={isActionInProgress} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait">
            {saving ? <LoaderCircle className="animate-spin h-5 w-5"/> : <Save className="h-5 w-5" />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </form>
  )
}

function ProfileFormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg animate-pulse">
        <div className="p-6 space-y-6">
          <div className="h-6 w-1/3 rounded bg-slate-700"></div>
          <div className="space-y-4">
            <div className="h-4 w-1/4 rounded bg-slate-700"></div>
            <div className="h-12 w-full rounded bg-slate-700"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-1/4 rounded bg-slate-700"></div>
            <div className="h-24 w-full rounded bg-slate-700"></div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 space-y-4">
          <div className="h-6 w-1/4 rounded bg-slate-700"></div>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-700"></div>
            <div className="flex gap-3">
              <div className="h-10 w-32 rounded-md bg-slate-700"></div>
              <div className="h-10 w-10 rounded-md bg-slate-700"></div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end">
          <div className="h-11 w-40 rounded-md bg-slate-700"></div>
        </div>
      </div>
    </div>
  )
}