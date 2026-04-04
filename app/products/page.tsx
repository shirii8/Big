'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import SectionLabel from '@/components/ui/SectionLabel'

export default function ProductsPortal() {
  return (
    <div className="bg-[#e5f1ee] min-h-screen flex flex-col lg:flex-row pt-20 overflow-hidden text-[#17191d] ref={containerRef}">
      
      {/* ── LEFT: UPPERS PORTAL ── */}
      <Link href="/products/uppers" className="relative flex-1 group overflow-hidden border-r-2 border-[#17191d]/10">
        <motion.div 
          initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="absolute inset-0 bg-[#d4604d] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        />
        <div className="relative z-10 h-full flex flex-col justify-center p-12 lg:p-20">
          <SectionLabel>Step 01</SectionLabel>
          <h2 className="font-display text-7xl lg:text-9xl uppercase tracking-tighter leading-none mb-6 group-hover:text-white transition-colors">
            THE <br/>UPPERS
          </h2>
          <p className="font-mono text-sm max-w-xs uppercase tracking-widest opacity-60 group-hover:text-white group-hover:opacity-90 transition-all">
            Browse 15 modular skins. Engineered for performance, aesthetics, and seasonal adaptation.
          </p>
          <div className="mt-12 w-12 h-12 border-2 border-[#17191d] group-hover:border-white flex items-center justify-center font-bold group-hover:text-white transition-all">
            →
          </div>
        </div>
        {/* Decorative Watermark */}
        <div className="absolute bottom-[-5%] left-[-5%] font-display text-[20vw] opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">SKIN</div>
      </Link>

      {/* ── RIGHT: SOLES PORTAL ── */}
      <Link href="/products/sneaker" className="relative flex-1 group overflow-hidden">
        <motion.div 
          initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="absolute inset-0 bg-[#17191d] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        />
        <div className="relative z-10 h-full flex flex-col justify-center p-12 lg:p-20">
          <SectionLabel>Step 02</SectionLabel>
          <h2 className="font-display text-7xl lg:text-9xl uppercase tracking-tighter leading-none mb-6 group-hover:text-[#e5f1ee] transition-colors">
           Starter  <br/> Build
          </h2>
          <p className="font-mono text-sm max-w-xs uppercase tracking-widest opacity-60 group-hover:text-[#e5f1ee] group-hover:opacity-90 transition-all">
            The foundation. 15 high-performance base units featuring proprietary cushioning and traction logic.
          </p>
          <div className="mt-12 w-12 h-12 border-2 border-[#17191d] group-hover:border-[#e5f1ee] flex items-center justify-center font-bold group-hover:text-[#e5f1ee] transition-all">
            →
          </div>
        </div>
        {/* Decorative Watermark */}
        <div className="absolute top-[-5%] right-[-5%] font-display text-[20vw] opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">BASE</div>
      </Link>
    </div>
  )
}