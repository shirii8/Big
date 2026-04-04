'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import SectionLabel from '@/components/ui/SectionLabel'

const SOLES = [
  { id: "s-001", name: "CLOUD RUNNER", type: "Cushion", price: "₹3,200", image: "https://res.cloudinary.com/dttnc62hp/image/upload/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.43_1_fvxhqe.jpg", tag: "Urban Logic", description: "Engineered for high-impact concrete environments. Features a dual-density foam core for vertical compression.", tech: ["Nitrogen Foam", "4mm Drop", "Anti-Abrasion"] },
  { id: "s-002", name: "GRIP FORCE", type: "Trail", price: "₹3,800", image: "https://res.cloudinary.com/dttnc62hp/image/upload/v1775151259/WhatsApp_Image_2026-04-01_at_02.28.41_1_qc3d2i.jpg", tag: "Alpha-Traction", description: "Multi-directional 6mm lugs for maximum lateral stability. Built for mud, rock, and loose urban gravel.", tech: ["Sticky-Rubber", "6mm Lugs", "Rock Plate"] },
  { id: "s-003", name: "ZERO-G", type: "Minimal", price: "₹2,900", image: "https://res.cloudinary.com/dttnc62hp/image/upload/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.40_2_k1xiwk.jpg", tag: "Barefoot Tech", description: "Zero-drop foundation for maximum ground feel. Ultra-thin TPU shield protects from sharp debris.", tech: ["TPU Plate", "120g Base", "0mm Drop"] },
  { id: "s-004", name: "SLAB PRO", type: "Performance", price: "₹4,100", image: "https://res.cloudinary.com/dttnc62hp/image/upload/v1775151261/WhatsApp_Image_2026-04-01_at_02.28.39_yrd7i8.jpg", tag: "Pro Series", description: "Carbon-fiber embedded performance chassis. Rocker geometry promotes a faster, more efficient gait.", tech: ["Carbon Plate", "Rocker Sole", "Speed-Cell"] }
]

export default function SolesPage() {
  const [selectedSole, setSelectedSole] = useState<any | null>(null)

  return (
    <div className="bg-[#e5f1ee] h-screen w-screen flex flex-col overflow-hidden text-[#17191d]">
      
      {/* ── HEADER (Reduced Padding) ── */}
      <header className="pt-24 pb-4 px-6 md:px-12 flex justify-between items-end shrink-0">
        <div>
          <SectionLabel>Foundation / Component 02</SectionLabel>
          <h1 className="font-display text-[clamp(32px,5vw,60px)] leading-[0.85] tracking-tighter uppercase">
            THE <br/><span className="text-[#d4604d]">BASE-UNIT.</span>
          </h1>
        </div>
        <Link href="/products/uppers" className="font-mono text-[10px] border-b-2 border-[#17191d] pb-1 hover:text-[#d4604d] hover:border-[#d4604d] transition-all uppercase font-bold mb-1">
          ← Back to Uppers
        </Link>
      </header>

      {/* ── 2x2 GRID (Strict Height Control) ── */}
      <main className="flex-1 px-6 md:px-12 pb-8 overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full w-full">
          {SOLES.map((sole) => (
            <motion.div 
              key={sole.id}
              layoutId={sole.id}
              onClick={() => setSelectedSole(sole)}
              className="bg-white border-2 border-[#17191d] p-4 flex flex-col cursor-pointer group hover:bg-white hover:shadow-[10px_10px_0px_#17191d] transition-all overflow-hidden"
            >
              {/* Image Container scales to fill available row height */}
              <div className="flex-1 flex items-center justify-center relative min-h-0">
                <img 
                  src={sole.image} 
                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                  alt={sole.name} 
                />
                <div className="absolute top-0 right-0 font-mono text-[8px] uppercase tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity">
                  ID_{sole.id}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 flex justify-between items-end border-t border-[#17191d]/10 mt-auto">
                <div>
                  <p className="font-mono text-[8px] text-[#d4604d] font-bold uppercase tracking-widest">{sole.type}</p>
                  <h3 className="font-display text-xl uppercase leading-none">{sole.name}</h3>
                </div>
                <p className="font-display text-lg font-bold">{sole.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* ── DEEP DIVE MODAL ── */}
      <AnimatePresence>
        {selectedSole && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSole(null)} className="fixed inset-0 z-[1000] bg-[#17191d]/40 backdrop-blur-md" />
            <motion.div 
              layoutId={selectedSole.id} 
              className="fixed inset-6 md:inset-x-20 md:inset-y-32 z-[1001] bg-[#e5f1ee] border-4 border-[#17191d] shadow-[30px_30px_0px_#d4604d] flex flex-col md:flex-row overflow-hidden"
            >
              <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white border-b-4 md:border-b-0 md:border-r-4 border-[#17191d] flex items-center justify-center p-12">
                <img src={selectedSole.image} className="max-h-full object-contain mix-blend-multiply" alt={selectedSole.name} />
              </div>

              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between h-full bg-[#e5f1ee]">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] bg-[#d4604d] text-white px-3 py-1 uppercase font-bold">{selectedSole.tag}</span>
                    <button onClick={() => setSelectedSole(null)} className="text-2xl font-bold">✕</button>
                  </div>
                  
                  <h2 className="font-display text-6xl leading-[0.85] uppercase tracking-tighter">{selectedSole.name}</h2>
                  <p className="text-[16px] leading-snug text-[#17191d]/70 max-w-sm">{selectedSole.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedSole.tech.map((t: string) => (
                      <span key={t} className="font-mono text-[9px] border-2 border-[#17191d] px-3 py-1.5 uppercase font-bold">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-[#17191d] flex items-center justify-between mt-auto">
                  <div>
                    <p className="font-mono text-[9px] opacity-40 uppercase">Foundation Unit</p>
                    <p className="font-display text-4xl">{selectedSole.price}</p>
                  </div>
                  <button className="bg-[#17191d] text-white font-mono text-[11px] font-bold uppercase tracking-[3px] px-10 py-5 hover:bg-[#d4604d] transition-colors">
                    Confirm Unit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}