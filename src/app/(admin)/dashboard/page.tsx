'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Newspaper, FolderKanban, Activity, ArrowRight } from 'lucide-react'
import type { ElementType } from 'react'

// Tipe untuk data statistik
type StatData = {
  title: string
  count: number
  link: string
  icon: ElementType
  accentColor: string
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState<StatData[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('Admin')

  useEffect(() => {
    const fetchUserDataAndCounts = async () => {
      // 1. Ambil data user (contoh: nama)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (profile) {
          setUserName(profile.full_name || 'Admin')
        }
      }

      // 2. Ambil jumlah data dari setiap tabel
      const [articles, projects, activities] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('activities').select('*', { count: 'exact', head: true }),
      ])
      
      const statsData: StatData[] = [
        { 
          title: "Artikel", 
          count: articles.count || 0, 
          link: "/dashboard/articles", 
          icon: Newspaper, 
          accentColor: "border-t-blue-500"
        },
        { 
          title: "Proyek", 
          count: projects.count || 0, 
          link: "/dashboard/projects", 
          icon: FolderKanban, 
          accentColor: "border-t-green-500"
        },
        { 
          title: "Aktivitas", 
          count: activities.count || 0, 
          link: "/dashboard/activities", 
          icon: Activity, 
          accentColor: "border-t-yellow-500"
        },
      ]

      setStats(statsData)
      setLoading(false)
    }

    fetchUserDataAndCounts()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-slate-100 mb-2">Selamat Datang, {userName}!</h1>
      <p className="text-slate-400 mb-8">Berikut adalah ringkasan dari konten Anda.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Skeleton loader ditampilkan saat data dimuat
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          // Data aktual ditampilkan setelah dimuat
          stats.map((stat) => (
            <DashboardCard
              key={stat.title}
              title={stat.title}
              count={stat.count}
              link={stat.link}
              icon={stat.icon}
              accentColor={stat.accentColor}
            />
          ))
        )}
      </div>
    </div>
  )
}

// Komponen Kartu Statistik yang sudah direfaktor
function DashboardCard({ title, count, link, icon: Icon, accentColor }: StatData) {
  return (
    <Link 
      href={link} 
      className={`group block rounded-lg border border-slate-800 bg-slate-800/50 p-6 transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 ${accentColor} border-t-4`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <p className="text-sm font-medium uppercase text-slate-400">{title}</p>
          <p className="mt-1 text-4xl font-bold text-slate-100">{count}</p>
        </div>
        <Icon className="h-10 w-10 text-slate-500 transition-transform group-hover:scale-110" />
      </div>
      <div className="mt-4 flex items-center text-sm font-medium text-blue-400">
        <span>Lihat Semua</span>
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

// Komponen Skeleton untuk efek loading
function DashboardCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div>
          <div className="h-4 w-24 rounded bg-slate-700"></div>
          <div className="mt-2 h-10 w-16 rounded bg-slate-700"></div>
        </div>
        <div className="h-10 w-10 rounded-full bg-slate-700"></div>
      </div>
      <div className="mt-4 h-4 w-28 rounded bg-slate-700"></div>
    </div>
  )
}