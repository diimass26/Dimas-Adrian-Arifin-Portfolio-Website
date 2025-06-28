import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ArticleForm from '@/components/dashboard/ArticleForm'
import type { Article } from '@/types/database'

interface Props {
  params: { id: string }
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = params

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Artikel</h1>
      <ArticleForm initialData={data as Article} />
    </div>
  )
}
