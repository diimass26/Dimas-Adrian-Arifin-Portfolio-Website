// /src/lib/data.ts
import { supabase } from './supabase';
import type { Article } from '@/types/database'; 

// Mengambil profil (meskipun kita hardcode bio, ini untuk masa depan)
export async function getProfile() {
  const { data } = await supabase.from('profiles').select('*').single();
  return data;
}

// Mengambil artikel terbaru
export async function getLatestArticles(limit = 3) {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

// Mengambil aktivitas berdasarkan tipe (misal: ['Internship', 'Organization'])
export async function getActivitiesByType(types: string[]) {
  const { data } = await supabase
    .from('activities')
    .select('*')
    .in('type', types)
    .order('start_date', { ascending: false });
  return data ?? [];
}

// Mengambil aktivitas SELAIN tipe yang disebutkan
export async function getOtherActivities(typesToExclude: string[]) {
    const { data } = await supabase
      .from('activities')
      .select('*')
      .not('type', 'in', `(${typesToExclude.join(',')})`)
      .order('start_date', { ascending: false });
    return data ?? [];
}

export async function getLatestProjects(limit = 2) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

/**
 * Mengambil semua artikel dari database, diurutkan dari yang terbaru.
 * @returns {Promise<Article[]>} Sebuah promise yang resolve ke array artikel.
 */
export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error("Error fetching all articles:", error.message);
    return [];
  }
  
  return data ?? [];
}

/**
 * Mengambil satu artikel spesifik berdasarkan slug-nya.
 * @param {string} slug - Slug dari artikel yang ingin diambil.
 * @returns {Promise<Article | null>} Sebuah promise yang resolve ke data artikel, atau null jika tidak ditemukan.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single(); // .single() untuk mengambil hanya satu baris

  // Abaikan error 'PGRST116' yang berarti 'No rows found' (tidak ada baris ditemukan)
  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching article by slug:", error.message);
  }
  
  return data;
}