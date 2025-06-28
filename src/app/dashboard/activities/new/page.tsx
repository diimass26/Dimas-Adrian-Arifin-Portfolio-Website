import ActivityForm from '@/components/dashboard/ActivityForm'

export default function NewActivityPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Aktivitas</h1>
      <ActivityForm />
    </div>
  )
}
