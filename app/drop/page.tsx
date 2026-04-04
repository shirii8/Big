'use client'

import { motion } from 'framer-motion'
import SectionLabel from '@/components/ui/SectionLabel'

export default function FinalDropCTA({ openModal }: { openModal: () => void }) {
  return (
    <section
      className="relative w-full bg-[#17191d] py-20 px-6 md:px-12 overflow-hidden border-t-8 border-[#d4604d]"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* ── LEFT: THE MANIFEST ── */}
        <div className="flex-1 text-[#e5f1ee]">
          <SectionLabel>Final Construction Phase</SectionLabel>
          <h2
            className="font-display uppercase tracking-tighter mt-6 mb-8"
            style={{ fontSize: 'clamp(44px, 7vw, 110px)', lineHeight: 0.85 }}
          >
            ORDER YOUR <br />
            <span className="text-[#d4604d]">DROP 001.</span>
          </h2>
          
          <div className="flex flex-wrap gap-8 opacity-60">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-[3px]">USERS</span>
              <span className="font-mono text-[12px] font-bold text-[#d4604d]">UNIQUE // TO THOSE WHO LIKE TO BREAK PATTERN</span>
            </div>
            <div className="flex flex-col gap-1 border-l border-[#e5f1ee]/20 pl-8">
              <span className="font-mono text-[9px] uppercase tracking-[3px]">Region</span>
              <span className="font-mono text-[12px] font-bold">GLOBAL / INDIA-PRIORITY</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: THE COMMAND (The Button) ── */}
        <div className="w-full lg:w-auto shrink-0">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#f8fcfb", color: "#17191d" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log("Triggering Drop Modal..."); // Debugging to ensure click works
              openModal();
            }}
            className="relative w-full lg:w-[400px] h-[100px] bg-[#d4604d] text-white flex items-center justify-center gap-6 group transition-all duration-300"
          >
            {/* Industrial Button Details */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-current opacity-40" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-current opacity-40" />
            
            <span className="font-mono text-[16px] font-bold uppercase tracking-[6px] text-center">
              SECURE DROP
            </span>
            
            <span className="text-2xl group-hover:translate-x-3 transition-transform duration-500 ease-out">
              →
            </span>
          </motion.button>
          
          <p className="mt-6 font-mono text-[10px] text-center lg:text-right uppercase tracking-[2px] text-[#e5f1ee]/40">
            *Final prices locked upon selection. No restocks planned.
          </p>
        </div>

      </div>

      {/* ── BACKGROUND DECORATION (Non-Repetitive) ── */}
      <div className="absolute top-[-10%] right-[-5%] font-display text-[30vw] text-[#e5f1ee] opacity-[0.02] pointer-events-none select-none">
        001
      </div>
    </section>
  )
}