'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Best, Product } from "@/lib/data"

const BestProd = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="bg-white w-screen relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] border-t-2 border-[#17191d] overflow-x-hidden">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center border-b-2 border-[#17191d] bg-white px-6 py-4">
        <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tighter leading-none">
          SEASONAL <span className="text-[#d4604d]">BEST</span>
        </h2>
        <Link href="/products" className="font-mono text-[10px] font-black tracking-[3px] border-2 border-[#17191d] px-6 py-3 hover:bg-[#17191d] hover:text-white transition-all">
          VIEW_ALL
        </Link>
      </div>

      {/* ── THE GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {Best.map((s: Product, i: number) => (
          <div
            key={s.id}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            // KEY FIX 1: relative + overflow-hidden on the card itself, remove flex flex-col
            // so the absolute bottom overlay doesn't push height
            className="group relative md:border-b-0 md:border-r-2 last:border-r-0 border-[#17191d] overflow-hidden"
            style={{ aspectRatio: '1' }}
          >
            {/* IMAGE — fills the entire card */}
            <img
              src={s.image}
              alt={s.name}
              className="absolute inset-0 w-full h-full object-contain mix-blend-multiply bg-[#f2f2f2] scale-112 group-hover:scale-115 transition-transform duration-700 ease-in-out"
            />

            {/* Mobile border between cards */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#17191d] md:hidden" />

            {/* Category badge */}
            <div className="absolute top-6 left-6 z-20">
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase bg-[#d4604d] text-white px-3 py-1">
                {s.category}
              </span>
            </div>

            {/* Name + BUILD+ button */}
            {/* KEY FIX 2: pr-24 on the name row so BUILD+ never overlaps edge, 
                and BUILD+ is contained within the card bounds */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
              <div className="flex justify-between items-end gap-3">
                <h3 className="font-display text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.75] text-[#17191d] flex-1 min-w-0">
                  {s.name}
                </h3>
                
                {/* KEY FIX 3: shrink-0 + fixed width so it never overflows */}
                <div className="shrink-0">
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Link 
                          href="/products"
                          className="bg-[#17191d] text-white font-mono text-[10px] font-black px-4 py-3 tracking-[2px] uppercase block whitespace-nowrap"
                        >
                          BUILD+
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BestProd