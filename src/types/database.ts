export interface Profile {
  id: string // UUID dari auth.users
  full_name: string | null
  avatar_url: string | null // URL gambar di Supabase Storage
  bio: string | null
  created_at: string
}

export interface Project {
  id: string // UUID
  title: string
  description: string | null
  tech_stack: string[] // array of string
  image_url: string | null // URL gambar
  link: string | null // GitHub atau demo
  created_at: string
}

export interface Article {
  id: string // UUID
  title: string
  slug: string // unik
  content: string // markdown atau html
  image_url: string | null // thumbnail
  published_at: string
  updated_at: string | null
}

export interface Activity {
  id: string // UUID
  title: string
  type: string // bisa: 'Experience', 'Volunteering', dll
  organization: string | null
  role: string | null
  start_date: string // format YYYY-MM-DD
  end_date: string | null
  description: string | null
  image_url: string | null
  created_at: string
}