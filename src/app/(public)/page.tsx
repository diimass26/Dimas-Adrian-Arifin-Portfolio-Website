// /src/app/(portfolio)/page.tsx
import { getLatestArticles, getActivitiesByType, getOtherActivities } from "@/lib/data";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ArticleSection from "@/components/portfolio/ArticleSection";

export default async function HomePage() {
  // Ambil semua data yang diperlukan secara bersamaan
  const [
    latestArticles,
    internships,
    organizations,
    otherActivities
  ] = await Promise.all([
    getLatestArticles(3),
    getActivitiesByType(['Internship']),
    getActivitiesByType(['Organization']),
    getOtherActivities(['Internship', 'Organization'])
  ]);

  // Gabungkan dan urutkan semua aktivitas berdasarkan tanggal mulai
  const allActivities = [...internships, ...organizations, ...otherActivities]
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  return (
    // Menggunakan Fragment karena layout sudah ada di file terpisah
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection activities={allActivities} />
      <ArticleSection articles={latestArticles} />
      {/* Anda bisa menambahkan section lain di sini, misal: Kontak */}
    </>
  );
}