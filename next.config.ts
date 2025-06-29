import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menambahkan konfigurasi untuk Next.js Image Optimization
  images: {
    // Mendaftarkan domain eksternal yang diizinkan
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wtqiqcsqtbepsvqkcsdg.supabase.co', // Hostname dari pesan error Anda
        port: '',
        pathname: '/storage/v1/object/public/**', // Mengizinkan semua gambar dari public buckets
      },
    ],
  },
  /* config options lain bisa ditambahkan di sini jika ada */
};

export default nextConfig;
