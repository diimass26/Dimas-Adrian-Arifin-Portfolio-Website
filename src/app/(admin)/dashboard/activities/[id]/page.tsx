// /src/app/(admin)/dashboard/activities/[id]/page.tsx

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ActivityForm from '@/components/dashboard/ActivityForm'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditActivityPage({ params }: PageProps) {
  // Await the params since it's now a Promise in Next.js 15
  const { id } = await params

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()

  // [FIX] Logika error diperbaiki untuk lebih spesifik.
  // Ini menangani error database yang sebenarnya (selain dari "tidak ditemukan").
  if (error && error.code !== 'PGRST116') {
    console.error('Database Error:', error.message)
    // Kita bisa melempar error atau menampilkan halaman notFound sebagai fallback.
    notFound()
  }

  // Jika tidak ada data (artinya slug tidak valid), tampilkan halaman 404.
  if (!data) {
    notFound()
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-slate-100 mb-6">Edit Aktivitas</h1>
      {/* Tidak perlu type assertion `as Activity` karena jika `data` ada, 
        TypeScript seharusnya bisa menyimpulkan tipenya dengan benar dari query Supabase.
      */}
      <ActivityForm initialData={data} />
    </div>
  )
}