'use client'

import { useEffect } from 'react'
import { motion, stagger, useAnimate } from 'framer-motion'
import { cn } from '@/lib/utils'

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string
  className?: string
}) => {
  const [scope, animate] = useAnimate()
  // [FIX 1] Mengganti 'let' menjadi 'const' karena variabel tidak diubah lagi
  const wordsArray = words.split(' ') 
  
  // [FIX 2] Menambahkan 'animate' ke dalam dependency array useEffect
  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.1),
      }
    )
  }, [animate])

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-slate-400 text-black opacity-0"
            >
              {word}{' '}
            </motion.span>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div className={cn('font-normal', className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black text-lg md:text-xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  )
}