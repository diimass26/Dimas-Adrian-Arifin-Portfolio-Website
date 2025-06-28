import ArticleForm from '@/components/dashboard/ArticleForm'

export default function NewArticlePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Artikel</h1>
      <ArticleForm />
    </div>
  )
}
