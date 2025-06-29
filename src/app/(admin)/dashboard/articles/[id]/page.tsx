import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ArticleForm from '@/components/dashboard/ArticleForm'
import type { Article } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditArticlePage({ params }: Props) {
  // Await the params since it's now a Promise in Next.js 15
  const { id } = await params

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