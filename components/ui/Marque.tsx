'use client'

import { motion } from 'framer-motion'

const MARQUEE_TEXT = "EARLY BIRD - 30% OFF*  //  PRE-ORDERS LIVE NOW  //  INDIA’S FIRST MODULAR SNEAKERS // "

export default function RangeMarquee() {
  return (
    <div className="relative w-full bg-[#17191d] py-4 overflow-hidden border-y-2 border-[#d4604d] rotate-[-1deg] scale-[1.02] z-30 shadow-2xl">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-10 px-4"
        >
          {[...Array(10)].map((_, i) => (
            <span 
              key={i} 
              className="font-display text-2xl md:text-4xl text-[#e5f1ee] uppercase tracking-tighter"
            >
              {MARQUEE_TEXT}
              <span className="text-[#d4604d] ml-10">✦</span>
            </span>
          ))}
        </motion.div>

        {/* Duplicate for seamless looping */}
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-10 px-4"
        >
          {[...Array(10)].map((_, i) => (
            <span 
              key={i} 
              className="font-display text-2xl md:text-4xl text-[#e5f1ee] uppercase tracking-tighter"
            >
              {MARQUEE_TEXT}
              <span className="text-[#d4604d] ml-10">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}