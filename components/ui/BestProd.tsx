'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Best, Product } from "@/lib/data"

const BestProd = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    /* CRITICAL CHANGE: 
       w-screen + relative left-1/2 -translate-x-1/2 
       This forces the section to be exactly as wide as the device screen, 
       ignoring any parent container padding.
    */
    <section className="bg-white w-screen relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] border-t-2 border-[#17191d] overflow-x-hidden">
      
      {/* ── HEADER (Full Width) ── */}
      <div className="flex justify-between items-center border-b-2 border-[#17191d] bg-white px-6 py-4">
        <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tighter leading-none">
          SEASONAL <span className="text-[#d4604d]">BEST</span>
        </h2>
        <Link href="/products" className="font-mono text-[10px] font-black tracking-[3px] border-2 border-[#17191d] px-6 py-3 hover:bg-[#17191d] hover:text-white transition-all">
          VIEW_ALL
        </Link>
      </div>

      {/* ── THE GRID (No Gutters, No Side Padding) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {Best.map((s: Product, i: number) => (
          <div
            key={s.id}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group bg-white border-b-2 md:border-b-0 md:border-r-2 last:border-r-0 border-[#17191d] flex flex-col relative"
          >
            {/* 1. THE IMAGE (Forces to touch borders) */}
            <div className="relative w-full aspect-square bg-[#f2f2f2] overflow-hidden">
              <img
                src={s.image}
                alt={s.name}
                // Changed to object-contain but zoomed to keep the shoe large without cutting it off
                className="w-full h-full object-contain mix-blend-multiply scale-100  transition-transform duration-700 ease-in-out"
              />
              
              {/* Category label */}
              <div className="absolute top-6 left-6 z-20">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase bg-[#d4604d] text-white px-3 py-1">
                    {s.category}
                </span>
              </div>
            </div>

            {/* 2. THE TEXT OVERLAY (Bolted to the bottom) */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-20 pointer-events-none">
              <div className="flex justify-between items-end">
                <h3 className="font-display text-7xl md:text-8xl uppercase tracking-tighter leading-[0.7] text-[#17191d]">
                  {s.name}
                </h3>
                
                <div className="pointer-events-auto">
                   <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <Link 
                          href="/products"
                          className="bg-[#17191d] text-white font-mono text-[11px] font-black px-6 py-3 tracking-[3px] uppercase block"
                        >
                          BUILD+
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Hover Shadow Depth */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BestProd