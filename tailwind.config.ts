import type { Config } from 'tailwindcss'

const config: Config = {
  // Mode gelap diatur berdasarkan class 'dark' pada tag <html>
  darkMode: 'class',

  // Path ke semua file di mana Anda menggunakan kelas Tailwind
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // Tempat untuk mendefinisikan atau memperluas tema Anda
  theme: {
    extend: {
      // Anda bisa menambahkan warna, font, dll. kustom di sini di masa depan
    },
  },

  // Tempat untuk menambahkan plugin
  plugins: [
    require('@tailwindcss/typography'), // Ini adalah plugin yang kita butuhkan untuk styling artikel
  ],
}
export default config
