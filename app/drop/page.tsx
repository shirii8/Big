'use client'

import { motion } from 'framer-motion'
import SectionLabel from '@/components/ui/SectionLabel'
import { type Product } from '@/lib/data' // Import the Product type

// 1. Define the interface for the props
interface FinalDropCTAProps {
  openModal: (p?: Product | null) => void;
}

// 2. Accept the prop in the function arguments
export default function FinalDropCTA({ openModal }: FinalDropCTAProps) {

  return (
    <section className="relative w-full bg-[#17191d] py-20 px-6 md:px-12 overflow-hidden border-t-8 border-[#d4604d]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        
        <div className="flex-1 text-[#e5f1ee]">
          <SectionLabel>Final Construction Phase</SectionLabel>
          <h2 className="font-display uppercase tracking-tighter mt-6 mb-8" style={{ fontSize: 'clamp(44px, 7vw, 110px)', lineHeight: 0.85 }}>
            ORDER YOUR <br />
            <span className="text-[#d4604d]">DROP 001.</span>
          </h2>
        </div>

        <div className="w-full lg:w-auto shrink-0 z-10">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#f8fcfb", color: "#17191d" }}
            whileTap={{ scale: 0.98 }}
            // 3. Change this to use the openModal prop
            onClick={() => openModal(null)} 
            className="relative w-full lg:w-[400px] h-[100px] bg-[#d4604d] text-white flex items-center justify-center gap-6 group transition-all duration-300"
          >
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-current opacity-40" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-current opacity-40" />
            <span className="font-mono text-[16px] font-bold uppercase tracking-[6px]">
              SECURE DROP
            </span>
            <span className="text-2xl group-hover:translate-x-3 transition-transform duration-500">→</span>
          </motion.button>
        </div>
      </div>
    </section>
  )
}