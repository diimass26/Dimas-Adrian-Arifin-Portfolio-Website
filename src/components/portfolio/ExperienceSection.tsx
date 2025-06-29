'use client'
import type { Activity } from "@/types/database"
import { motion, useScroll, useSpring } from "framer-motion"
import { useRef } from "react"
import Image from 'next/image'

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sekarang';
    return new Date(dateString).toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long' 
    });
}

const TimelineItem = ({ activity, isLeft }: { activity: Activity; isLeft: boolean }) => {
  const ref = useRef(null)
  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      // [DIUBAH] Mengganti items-start menjadi items-center
      className={`mb-8 flex justify-between items-center w-full ${isLeft ? 'flex-row-reverse' : ''}`}
    >
      <div className="order-1 w-5/12"></div>
      {/* [DIUBAH] Menghapus mt-4 agar alignment lebih baik */}
      <div className="z-20 flex items-center order-1 bg-slate-700 shadow-xl w-8 h-8 rounded-full">
        {/* Titik di tengah timeline */}
      </div>
      <div className="order-1 bg-slate-800/80 border border-slate-700 rounded-lg shadow-xl w-5/12">
        {activity.image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <Image
                    src={activity.image_url}
                    alt={`Gambar untuk ${activity.title}`}
                    width={500}
                    height={281}
                    className="w-full h-full object-cover"
                />
            </div>
        )}
        <div className="p-5">
            <h3 className="mb-1 font-bold text-slate-100 text-xl">{activity.title}</h3>
            <p className="text-sm leading-snug tracking-wide text-slate-300 font-medium">{activity.role} at {activity.organization}</p>
            <p className="text-xs text-slate-500 mt-2">{formatDate(activity.start_date)} - {formatDate(activity.end_date)}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ExperienceSection({ activities }: { activities: Activity[] }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!activities || activities.length === 0) return null;

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-16">Perjalanan Karir & Pengalaman</h2>
        <div ref={ref} className="relative max-w-2xl mx-auto">
          <motion.div style={{ scaleY }} className="absolute left-1/2 top-0 w-[2px] h-full bg-blue-500 origin-top"/>
          <div className="relative">
            {activities.map((activity, index) => (
              <TimelineItem key={activity.id} activity={activity} isLeft={index % 2 !== 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}