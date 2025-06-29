// /src/components/ui/FlashlightEffect.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function FlashlightEffect() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Pastikan kode ini hanya berjalan di sisi client
    setIsClient(true)

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup listener saat komponen di-unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!isClient) {
    return null; // Jangan render apa-apa di server
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300"
      style={{
        background: `radial-gradient(500px at ${position.x}px ${position.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
      }}
    ></motion.div>
  );
}