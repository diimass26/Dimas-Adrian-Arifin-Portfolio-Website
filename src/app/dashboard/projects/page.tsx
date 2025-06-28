'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        alert('Gagal mengambil data project: ' + error.message)
      } else {
        setProjects(data)
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const handleDelete = async (id: string, imageUrl: string | null) => {
    const confirm = window.confirm('Yakin ingin menghapus project ini?')
    if (!confirm) return

    if (imageUrl) {
      const fileName = new URL(imageUrl).pathname.split('/').pop()
      if (fileName) {
        await supabase.storage.from('projects').remove([fileName])
      }
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      alert('Gagal menghapus project: ' + error.message)
    } else {
      setProjects(projects.filter((p) => p.id !== id))
      alert('Project berhasil dihapus!')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Project
        </Link>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : projects.length === 0 ? (
        <p>Tidak ada project ditemukan.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded p-4 shadow hover:shadow-lg transition"
            >
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-lg font-semibold mb-1">{project.title}</h2>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline"
                >
                  Lihat Project
                </a>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.image_url)}
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
