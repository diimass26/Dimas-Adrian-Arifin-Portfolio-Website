import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProjectForm from '@/components/dashboard/ProjectForm'
import type { Project } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditProjectPage({ params }: Props) {
  // Await the params since it's now a Promise in Next.js 15
  const { id } = await params

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <ProjectForm initialData={data as Project} />
    </div>
  )
}