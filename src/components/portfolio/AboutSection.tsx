import { GraduationCap, Code2, Cpu, Bot, Gamepad2, Database } from 'lucide-react';

const education = [
  {
    period: "2022 - Sekarang",
    institution: "Universitas Maritim Raja Ali Haji",
    major: "Teknik Informatika",
  },
  {
    period: "2019 - 2022",
    institution: "SMK Negeri 4 Tanjungpinang",
    major: "Rekayasa Perangkat Lunak",
  }
];

const skills = [
  { name: "Web Development", icon: Code2 },
  { name: "Artificial Intelligence", icon: Bot },
  { name: "Game Development", icon: Gamepad2 },
  { name: "Data Structures", icon: Cpu },
  { name: "Database Management", icon: Database },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Kolom Pendidikan */}
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-500"/> Pendidikan
          </h2>
          <div className="space-y-6 border-l-2 border-slate-700 pl-6">
            {education.map((edu, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-blue-500"></div>
                <p className="text-sm text-slate-400 mb-1">{edu.period}</p>
                <h3 className="text-lg font-semibold text-slate-100">{edu.institution}</h3>
                <p className="text-slate-300">{edu.major}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Kolom Skillset */}
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-8">Skillset</h2>
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div key={index} className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-slate-700 hover:border-blue-500 transition-colors">
                  <Icon className="h-7 w-7 text-blue-500" />
                  <span className="font-medium text-slate-200">{skill.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}