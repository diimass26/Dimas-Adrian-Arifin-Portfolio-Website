// /src/app/(portfolio)/page.tsx

import { getLatestArticles, getLatestProjects, getActivitiesByType } from "@/lib/data";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ProjectSection from "@/components/portfolio/ProjectSection";
import ArticleSection from "@/components/portfolio/ArticleSection";

export default async function HomePage() {
  const [
    latestArticles,
    latestProjects,
    allActivities
  ] = await Promise.all([
    getLatestArticles(3), // Ambil 3 artikel terbaru
    getLatestProjects(3), // Ambil 3 proyek terbaru
    getActivitiesByType(['Internship', 'Organization', 'Competition', 'Volunteering', 'Other']),
  ]);

  const sortedActivities = allActivities
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection activities={sortedActivities} />
      
      {/* Memanggil komponen Project dan Artikel secara terpisah */}
      <ProjectSection projects={latestProjects} />
      <ArticleSection articles={latestArticles} />
    </>
  );
}