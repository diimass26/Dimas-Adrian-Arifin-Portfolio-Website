'use client'

import { useEffect, useState, Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Activity } from '@/types/database'
import { Plus, Edit, Trash2, Calendar, Briefcase, Award, LoaderCircle, Info } from 'lucide-react'

// ... (Helper function formatDate tetap sama)
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}


export default function ActivitiesDashboardPage() {
  // ... (Seluruh logika state dan fungsi di dalam komponen ini tetap sama)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
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

  const openDeleteModal = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedActivity) return
    
    setIsDeleting(true)
    const { id, image_url } = selectedActivity

    if (image_url) {
      const filename = new URL(image_url).pathname.split('/').pop()
      if (filename) await supabase.storage.from('activities').remove([filename])
    }

    const { error } = await supabase.from('activities').delete().eq('id', id)
    setIsDeleting(false)

    if (error) {
      alert('Gagal menghapus aktivitas: ' + error.message)
    } else {
      setActivities(prev => prev.filter((a) => a.id !== id))
      setShowDeleteModal(false)
      setSelectedActivity(null)
    }
  }


  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">Daftar Aktivitas</h1>
          <p className="text-slate-400 mt-1">Kelola semua pengalaman, proyek, dan pencapaian Anda.</p>
        </div>
        {/* [BERUBAH] Mengganti bg-blue-600 menjadi bg-yellow-500 */}
        <Link href="/dashboard/activities/new" className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-md font-semibold hover:bg-yellow-600 transition-colors">
          <Plus className="h-5 w-5" />
          Tambah Aktivitas
        </Link>
      </div>

      {/* ... (logika loading, empty state, dan mapping tetap sama) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : activities.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onEdit={() => router.push(`/dashboard/activities/${activity.id}`)} onDelete={() => openDeleteModal(activity)} />
          ))}
        </div>
      )}


      {showDeleteModal && selectedActivity && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          activityTitle={selectedActivity.title}
        />
      )}
    </div>
  )
}

// Komponen Kartu Aktivitas
function ActivityCard({ activity, onEdit, onDelete }: { activity: Activity, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-yellow-500/50 hover:-translate-y-1">
      <div className="h-48 w-full overflow-hidden">
        {activity.image_url ? (
          <img src={activity.image_url} alt={activity.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <Briefcase className="w-16 h-16 text-slate-600" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        {/* [BERUBAH] Mengganti warna tag dari biru ke kuning */}
        <span className="inline-block bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">{activity.type}</span>
        <h2 className="text-lg font-bold text-slate-100 flex-grow">{activity.title}</h2>
        <p className="text-slate-400 text-sm mt-1">{activity.organization}</p>
        <p className="text-slate-400 text-sm font-medium">{activity.role}</p>
        <div className="border-t border-slate-700 my-4"></div>
        <div className="flex items-center text-sm text-slate-500 gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(activity.start_date)} → {activity.end_date ? formatDate(activity.end_date) : 'Sekarang'}</span>
        </div>
      </div>
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
        {/* [BERUBAH] Menambahkan hover warna kuning pada tombol Edit */}
        <button onClick={onEdit} className="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors"><Edit className="h-4 w-4" /> Edit</button>
        <button onClick={onDelete} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /> Hapus</button>
      </div>
    </div>
  )
}

// ... (Komponen CardSkeleton tetap sama)
function CardSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg animate-pulse">
      <div className="h-48 bg-slate-700"></div>
      <div className="p-5">
        <div className="h-5 w-24 bg-slate-700 rounded-full mb-3"></div>
        <div className="h-6 w-3/4 bg-slate-700 rounded mb-2"></div>
        <div className="h-5 w-1/2 bg-slate-700 rounded"></div>
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
    <div className="text-center py-16 px-6 border-2 border-dashed border-slate-700 rounded-lg">
      <Award className="mx-auto h-12 w-12 text-slate-600" />
      <h3 className="mt-4 text-xl font-semibold text-slate-200">Belum Ada Aktivitas</h3>
      <p className="mt-2 text-slate-400">Mulai tambahkan pengalaman dan pencapaian Anda.</p>
      {/* [BERUBAH] Mengganti bg-blue-600 menjadi bg-yellow-500 */}
      <Link href="/dashboard/activities/new" className="mt-6 inline-flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-md font-semibold hover:bg-yellow-600 transition-colors">
        <Plus className="h-5 w-5" />
        Tambah Aktivitas Pertama Anda
      </Link>
    </div>
  )
}

// ... (Komponen DeleteConfirmationModal tetap sama)
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting, activityTitle }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, isDeleting: boolean, activityTitle: string }) {
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
              <h3 className="text-lg leading-6 font-bold text-slate-100">Hapus Aktivitas</h3>
              <div className="mt-2">
                <p className="text-sm text-slate-400">
                  Apakah Anda yakin ingin menghapus aktivitas <span className="font-bold text-slate-200">"{activityTitle}"</span>? Tindakan ini tidak dapat dibatalkan.
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