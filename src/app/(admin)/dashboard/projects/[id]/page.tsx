import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProjectForm from '@/components/dashboard/ProjectForm'
import type { Project } from '@/types/database'

interface Props {
  params: { id: string }
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = params

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
