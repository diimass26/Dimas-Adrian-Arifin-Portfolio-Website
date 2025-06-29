import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ActivityForm from '@/components/dashboard/ActivityForm'
import type { Activity } from '@/types/database'

interface Props {
  params: { id: string }
}

export default async function EditActivityPage({ params }: Props) {
  const { id } = params

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Aktivitas</h1>
      <ActivityForm initialData={data as Activity} />
    </div>
  )
}
