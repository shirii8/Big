'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Best, Product } from "@/lib/data"

const BestProd = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="px-6 md:px-12 bg-[#e5f1ee] py-12">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-end mb-12 border-b-2 border-[#17191d] pb-8">
        <div>
          <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#d4604d] font-bold">Archive_Curated</span>
          <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tighter mt-2">
            Seasonal <span className="text-[#d4604d]">Best</span>
          </h2>
        </div>
        <Link 
          href="/products" 
          className="hidden md:block font-mono text-[10px] font-black uppercase tracking-[3px] border-2 border-[#17191d] px-8 py-4 hover:bg-[#17191d] hover:text-white transition-all"
        >
          View Range →
        </Link>
      </div>

      {/* ── GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-[#17191d]">
        {Best.map((s: Product, i: number) => (
          <div
            key={s.id}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group p-10 border-r-2 last:border-r-0 border-[#17191d] bg-white flex flex-col h-full min-h-[520px] relative overflow-hidden transition-colors duration-500"
          >
            {/* Image Section */}
            <div className="relative h-64 flex items-center justify-center">
              <img
                src={s.image}
                alt={s.name}
                className="max-h-full w-auto object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Content Section: Pushed to bottom using mt-auto */}
            <div className="mt-auto pt-10">
              <h3 className="font-display text-5xl uppercase tracking-tighter leading-none text-[#17191d]">
                {s.name}
              </h3>
              
              {/* Spacer for Padding between Name and Button */}
              <div className="h-12" /> 

              <div className="relative h-14">
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Link 
                        href="/products"
                        className="flex items-center justify-center w-full h-full bg-[#17191d] text-white font-mono text-[11px] font-black uppercase tracking-[4px] hover:bg-[#d4604d] transition-colors"
                      >
                        View Build System <span className="ml-4">→</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Decorative Top Accent */}
            <motion.div 
              animate={{ height: hoveredIndex === i ? 8 : 0 }}
              className="absolute top-0 left-0 w-full bg-[#d4604d]"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BestProd