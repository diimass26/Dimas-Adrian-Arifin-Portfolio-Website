'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Activity } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function ActivitiesDashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) {
        alert('Gagal mengambil data aktivitas: ' + error.message)
      } else {
        setActivities(data)
      }
      setLoading(false)
    }

    fetchActivities()
  }, [])

  const handleDelete = async (id: string, imageUrl: string | null) => {
    const confirm = window.confirm('Yakin ingin menghapus aktivitas ini?')
    if (!confirm) return

    if (imageUrl) {
      const filename = new URL(imageUrl).pathname.split('/').pop()
      if (filename) {
        await supabase.storage.from('activities').remove([filename])
      }
    }

    const { error } = await supabase.from('activities').delete().eq('id', id)
    if (error) {
      alert('Gagal menghapus aktivitas: ' + error.message)
    } else {
      setActivities(activities.filter((a) => a.id !== id))
      alert('Aktivitas berhasil dihapus!')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Aktivitas</h1>
        <Link
          href="/dashboard/activities/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Aktivitas
        </Link>
      </div>

      {loading ? (
        <p>Memuat data aktivitas...</p>
      ) : activities.length === 0 ? (
        <p>Belum ada aktivitas.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border rounded p-4 shadow hover:shadow-md transition"
            >
              {activity.image_url && (
                <img
                  src={activity.image_url}
                  alt={activity.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-lg font-semibold mb-1">{activity.title}</h2>
              <p className="text-sm text-gray-600">
                {activity.type} | {activity.organization} | {activity.role}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                {activity.start_date} → {activity.end_date || 'Sekarang'}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/dashboard/activities/${activity.id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(activity.id, activity.image_url)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
