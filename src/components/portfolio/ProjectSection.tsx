'use client'

import Image from 'next/image' // [FIX] Mengimpor komponen Image
// [FIX] 'Link' dihapus dari import karena tidak digunakan
import { Code, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Project } from '@/types/database'

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function ProjectSection({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-12">Proyek Terbaru</h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map(project => (
            <motion.div variants={cardVariants} key={project.id}>
              <div className="group bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden h-full flex flex-col">
                <div className="h-48 w-full overflow-hidden relative">
                  {project.image_url ? (
                     // [FIX] Mengganti <img> dengan <Image /> untuk optimasi
                     <Image 
                        src={project.image_url} 
                        alt={project.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <Code className="w-16 h-16 text-slate-600"/>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400">
                    Proyek
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-100">{project.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 flex-grow">{project.description ? project.description.substring(0, 100) + '...' : ''}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-400 font-semibold mt-4 hover:text-green-300 transition-colors">
                      Lihat Proyek <ArrowRight className="h-4 w-4"/>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}