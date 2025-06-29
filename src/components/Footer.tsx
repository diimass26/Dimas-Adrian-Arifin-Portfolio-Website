import Link from 'next/link'
// Import ikon-ikon dari react-icons
import { FaGithub, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa'

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/diimass26' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/dimas-adrian-arifin-5378b32ba/' },
  { icon: FaInstagram, href: 'https://www.instagram.com/diimass_adr/?hl=en' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@diimassadr' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Ikon Sosial Media */}
          <div className="flex gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-white hover:scale-110 transition-all duration-300"
                >
                  <Icon size={24} />
                </a>
              )
            })}
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © {currentYear} Dimas Adrian Arifin. Dibuat dengan ❤️ di Tanjungpinang.
          </p>
        </div>
      </div>
    </footer>
  )
}