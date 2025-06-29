import type { Activity } from "@/types/database";
import { Briefcase, Users, Trophy, Milestone } from "lucide-react";

// Helper untuk memilih ikon berdasarkan tipe
const getIconForType = (type: string) => {
  switch(type) {
    case 'Internship': return <Briefcase className="h-5 w-5 text-slate-400" />;
    case 'Organization': return <Users className="h-5 w-5 text-slate-400" />;
    case 'Competition': return <Trophy className="h-5 w-5 text-slate-400" />;
    default: return <Milestone className="h-5 w-5 text-slate-400" />;
  }
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sekarang';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
}

export default function ExperienceSection({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) return null;

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-12">Pengalaman & Aktivitas</h2>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-700"></div>
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative mb-12">
              <div className="absolute left-1/2 -translate-x-1/2 -mt-1 h-4 w-4 rounded-full bg-blue-500 border-4 border-slate-900"></div>
              <div className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-[calc(50%-2rem)] p-6 bg-slate-800/50 border border-slate-700 rounded-lg ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <p className="text-sm text-slate-400 mb-2">{formatDate(activity.start_date)} - {formatDate(activity.end_date)}</p>
                  <h3 className="text-xl font-bold text-slate-100 mb-1">{activity.title}</h3>
                  <p className="text-blue-400 font-semibold mb-3">{activity.role} at {activity.organization}</p>
                  <p className="text-slate-300 text-sm">{activity.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}