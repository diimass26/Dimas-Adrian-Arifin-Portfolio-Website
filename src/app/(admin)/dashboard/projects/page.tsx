'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
import { Plus, Edit, Trash2, Code, Link as LinkIcon, FolderKanban, LoaderCircle } from 'lucide-react'

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        alert('Gagal mengambil data proyek: ' + error.message)
      } else {
        setProjects(data)
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedProject) return
    
    setIsDeleting(true)
    const { id, image_url } = selectedProject

    if (image_url) {
      const filename = new URL(image_url).pathname.split('/').pop()
      if (filename) await supabase.storage.from('projects').remove([filename])
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)
    setIsDeleting(false)

    if (error) {
      alert('Gagal menghapus proyek: ' + error.message)
    } else {
      setProjects(prev => prev.filter((p) => p.id !== id))
      setShowDeleteModal(false)
      setSelectedProject(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">Daftar Proyek</h1>
          <p className="text-slate-400 mt-1">Kelola semua portofolio proyek Anda di sini.</p>
        </div>
        <Link href="/dashboard/projects/new" className="flex items-center gap-2 bg-green-500 text-black px-5 py-2.5 rounded-md font-semibold hover:bg-green-600 transition-colors">
          <Plus className="h-5 w-5" />
          Tambah Proyek
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={() => router.push(`/dashboard/projects/${project.id}`)} onDelete={() => openDeleteModal(project)} />
          ))}
        </div>
      )}

      {showDeleteModal && selectedProject && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          projectTitle={selectedProject.title}
        />
      )}
    </div>
  )
}

// Komponen Kartu Proyek
function ProjectCard({ project, onEdit, onDelete }: { project: Project, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-green-500/50 hover:-translate-y-1">
      <div className="h-48 w-full overflow-hidden">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <Code className="w-16 h-16 text-slate-600" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-bold text-slate-100">{project.title}</h2>
        <p className="text-slate-400 text-sm mt-2 flex-grow">{project.description}</p>
        
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs uppercase font-semibold text-slate-500 mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 4).map(tech => (
                <span key={tech} className="bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">{tech}</span>
              ))}
              {project.tech_stack.length > 4 && (
                <span className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">+{project.tech_stack.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
        <div className="flex gap-4">
          <button onClick={onEdit} className="flex items-center gap-2 text-sm text-slate-300 hover:text-green-400 transition-colors"><Edit className="h-4 w-4" /> Edit</button>
          <button onClick={onDelete} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /> Hapus</button>
        </div>
        {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors font-semibold">
              <LinkIcon className="h-4 w-4" />
              Lihat
            </a>
        )}
      </div>
    </div>
  )
}

// Komponen Skeleton
function CardSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg animate-pulse">
      <div className="h-48 bg-slate-700"></div>
      <div className="p-5">
        <div className="h-6 w-3/4 bg-slate-700 rounded mb-3"></div>
        <div className="h-4 w-full bg-slate-700 rounded mb-1"></div>
        <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="h-6 w-16 bg-slate-700 rounded-full"></div>
          <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
          <div className="h-6 w-14 bg-slate-700 rounded-full"></div>
        </div>
      </div>
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
        <div className="flex gap-4">
            <div className="h-5 w-16 bg-slate-700 rounded"></div>
            <div className="h-5 w-16 bg-slate-700 rounded"></div>
        </div>
        <div className="h-5 w-14 bg-slate-700 rounded"></div>
      </div>
    </div>
  )
}

// Komponen Empty State
function EmptyState() {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-slate-700 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
      <FolderKanban className="mx-auto h-12 w-12 text-slate-600" />
      <h3 className="mt-4 text-xl font-semibold text-slate-200">Belum Ada Proyek</h3>
      <p className="mt-2 text-slate-400">Saatnya membangun dan memamerkan portofolio Anda.</p>
      <Link href="/dashboard/projects/new" className="mt-6 inline-flex items-center gap-2 bg-green-500 text-black px-5 py-2.5 rounded-md font-semibold hover:bg-green-600 transition-colors">
        <Plus className="h-5 w-5" />
        Tambah Proyek Pertama Anda
      </Link>
    </div>
  )
}

// Komponen Modal Konfirmasi Hapus
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting, projectTitle }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, isDeleting: boolean, projectTitle: string }) {
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
              <h3 className="text-lg leading-6 font-bold text-slate-100">Hapus Proyek</h3>
              <div className="mt-2">
                <p className="text-sm text-slate-400">
                  Apakah Anda yakin ingin menghapus proyek <span className="font-bold text-slate-200">"{projectTitle}"</span>? Tindakan ini tidak dapat dibatalkan.
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