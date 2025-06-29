import { ArrowDown, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-4 animate-fade-in-up">
          Dimas Adrian Arifin
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-8 animate-fade-in-up animation-delay-300">
          Saya adalah mahasiswa Teknik Informatika di Universitas Maritim Raja Ali Haji yang memiliki minat dalam kecerdasan buatan, pengembangan game, dan pengembangan website. Dengan kemampuan berpikir analitis dan pendekatan berbasis data, saya terus berupaya mengembangkan diri serta berkontribusi di bidang teknologi.
        </p>
        <div className="flex justify-center gap-4 animate-fade-in-up animation-delay-500">
          <a href="#contact" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
            Hubungi Saya
          </a>
          <a href="https://github.com/diimass26" target="_blank" rel="noopener noreferrer" className="bg-slate-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-2">
            <Github className="h-5 w-5"/> GitHub
          </a>
        </div>
      </div>
    </section>
  );
}