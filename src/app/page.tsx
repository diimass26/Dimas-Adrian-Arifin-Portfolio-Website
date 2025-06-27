// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Project } from '@/types/database'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('projects').select('*')
      setProjects(data || [])
    }
    fetchData()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Project List</h1>
      <ul className="space-y-2">
        {projects.map((p: any) => (
          <li key={p.id} className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold">{p.title}</h2>
            <p>{p.description}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
