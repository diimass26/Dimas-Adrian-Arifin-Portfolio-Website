'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardHomePage() {
  const [articlesCount, setArticlesCount] = useState(0)
  const [projectsCount, setProjectsCount] = useState(0)
  const [activitiesCount, setActivitiesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      const [articles, projects, activities] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('activities').select('*', { count: 'exact', head: true }),
      ])

      if (!articles.error) setArticlesCount(articles.count || 0)
      if (!projects.error) setProjectsCount(projects.count || 0)
      if (!activities.error) setActivitiesCount(activities.count || 0)

      setLoading(false)
    }

    fetchCounts()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      {loading ? (
        <p>Memuat statistik...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <DashboardCard
            title="Artikel"
            count={articlesCount}
            link="/dashboard/articles"
            color="bg-blue-100 text-blue-800"
          />
          <DashboardCard
            title="Proyek"
            count={projectsCount}
            link="/dashboard/projects"
            color="bg-green-100 text-green-800"
          />
          <DashboardCard
            title="Aktivitas"
            count={activitiesCount}
            link="/dashboard/activities"
            color="bg-yellow-100 text-yellow-800"
          />
        </div>
      )}
    </div>
  )
}

function DashboardCard({
  title,
  count,
  link,
  color,
}: {
  title: string
  count: number
  link: string
  color: string
}) {
  return (
    <Link href={link} className={`block p-6 rounded shadow hover:shadow-md transition ${color}`}>
      <p className="text-sm uppercase font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold">{count}</p>
    </Link>
  )
}
