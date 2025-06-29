// /src/app/(portfolio)/contactme/page.tsx
'use client'

import { useState, FormEvent } from 'react';
import type { Metadata } from 'next';
import { Mail, MapPin, Send, LoaderCircle } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Metadata tidak bisa digunakan di Client Component, 
// jadi ini hanya sebagai contoh jika Anda memisahkannya nanti.
// export const metadata: Metadata = {
//   title: 'Hubungi Saya | Dimas Adrian Arifin',
//   description: 'Hubungi Dimas Adrian Arifin untuk kolaborasi, pertanyaan, atau sekadar menyapa.',
// };

const socialLinks = [
  { name: 'GitHub', icon: FaGithub, href: 'https://github.com/diimass26' },
  { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/dimas-adrian-arifin-5378b32ba/' },
  { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/diimass_adr/?hl=en' },
  { name: 'TikTok', icon: FaTiktok, href: 'https://www.tiktok.com/@diimassadr' },
];

export default function ContactMePage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulasi pengiriman data
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Di sini Anda akan menambahkan logika untuk mengirim email menggunakan layanan seperti Resend, EmailJS, atau API Anda sendiri.
    console.log("Data Formulir:", formData);

    // Set status ke success setelah simulasi selesai
    setStatus('success');
  };

  return (
    <div className="py-12 md:py-16">
      <header className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Hubungi Saya</h1>
        <p className="text-lg text-slate-400 mt-3 max-w-2xl mx-auto">
          Punya pertanyaan, ide untuk kolaborasi, atau hanya ingin menyapa? Jangan ragu untuk menghubungi saya.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Kolom Informasi Kontak */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-semibold text-slate-100 mb-4">Informasi Kontak</h3>
            <div className="space-y-4 text-slate-300">
              <a href="mailto:dimasadrian26@gmail.com" className="flex items-center gap-4 group">
                <Mail className="h-6 w-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <span className="group-hover:text-blue-400 transition-colors">diimassadrian26@gmail.com</span>
              </a>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-slate-500" />
                <span>Tanjung Pinang, Kepulauan Riau, Indonesia</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-100 mb-4">Ikuti Saya</h3>
            <div className="flex gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className="text-slate-500 hover:text-white hover:scale-110 transition-all duration-300"
                >
                  <social.icon size={28} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Kolom Formulir Kontak */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {status === 'success' ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-8 text-center h-full flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-green-300">Pesan Terkirim!</h3>
                <p className="text-slate-300 mt-2">Terima kasih telah menghubungi saya. Saya akan segera membalas pesan Anda.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
                <input type="text" name="name" id="name" required onChange={handleChange} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Alamat Email</label>
                <input type="email" name="email" id="email" required onChange={handleChange} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">Subjek</label>
                <input type="text" name="subject" id="subject" onChange={handleChange} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Pesan</label>
                <textarea name="message" id="message" rows={5} required onChange={handleChange} className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? <LoaderCircle className="animate-spin h-5 w-5"/> : <Send className="h-5 w-5" />}
                {status === 'sending' ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
