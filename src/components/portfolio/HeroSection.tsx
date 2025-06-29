'use client'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { TextGenerateEffect } from '../ui/TextGenerateEffect'
import Image from 'next/image' // [BARU] Import komponen Image

const bio = `Saya adalah mahasiswa Teknik Informatika di Universitas Maritim Raja Ali Haji yang memiliki minat dalam kecerdasan buatan, pengembangan game, dan pengembangan website. Dengan kemampuan berpikir analitis dan pendekatan berbasis data, saya terus berupaya mengembangkan diri serta berkontribusi di bidang teknologi.`

export default function HeroSection() {
  return (
    <section className="py-24 md:py-32 flex items-center">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center md:justify-start"
        >
          {/* [DIUBAH] Mengganti div placeholder dengan komponen Image */}
          <Image
            src="/profile.jpg" // Pastikan nama file ini sesuai dengan file Anda di folder /public
            alt="Foto profil Dimas Adrian Arifin"
            width={512}  // Lebar gambar dalam pixel
            height={512} // Tinggi gambar dalam pixel
            priority={true} // Memberitahu Next.js untuk memprioritaskan pemuatan gambar ini
            className="w-48 h-48 md:w-80 md:h-80 rounded-full border-4 border-slate-700 object-cover shadow-lg"
          />
        </motion.div>
        
        <div className="md:col-span-2 text-center md:text-left">
          {/* Sisa kode tetap sama */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-slate-100 mb-4"
          >
            Dimas Adrian Arifin
          </motion.h1>

          <TextGenerateEffect words={bio} className="max-w-3xl mx-auto md:mx-0" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="flex justify-center md:justify-start gap-4 mt-8"
          >
            <a href="#projects" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
              Lihat Proyek
            </a>
            <a href="https://github.com/diimass26" target="_blank" rel="noopener noreferrer" className="bg-slate-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-2">
              <Github className="h-5 w-5"/> GitHub
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}