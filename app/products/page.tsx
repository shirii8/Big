'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { useEffect } from 'react'

export default function ProductsPortal() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent');
    }
  }, []);

  return (
    <div className="bg-[#e5f1ee] min-h-screen flex flex-col lg:flex-row pt-20 overflow-hidden text-[#17191d]">
      
      {/* ── LEFT: UPPERS PORTAL ── */}
      {/* <Link href="/products/uppers" className="relative flex-1 group overflow-hidden border-r-2 border-[#17191d]/10">
        <motion.div 
          initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="absolute inset-0 bg-[#d4604d] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        />
        <div className="relative z-10 h-full flex flex-col justify-center p-12 lg:p-20">
          <h4>Step 01</h4>
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
        <div className="absolute bottom-[-5%] left-[-5%] font-display text-[20vw] opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">SKIN</div>
      </Link> 
      */}

      {/* ── RIGHT: sneaker (build) PORTAL ── */}
      <Link 
        href="/products/sneaker" 
        className="relative flex-1 group overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1776432736/IMG-20260416-WA0011_2.jpg_lbj1ce.jpg")' }}
      >
        {/* Overlay for legibility */}
        <div className="absolute inset-0 bg-white/40 group-hover:bg-[#17191d]/80 transition-colors duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
        
        <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 lg:p-20">
          <h4 className="font-mono text-sm tracking-widest font-bold mb-2">Step 02</h4>
          <h2 className="font-display text-5xl md:text-7xl lg:text-9xl uppercase tracking-tighter leading-none mb-6 group-hover:text-[#e5f1ee] transition-colors">
            Starter <br/> Build
          </h2>
          <p className="font-mono text-xs md:text-sm max-w-xs uppercase tracking-widest font-bold opacity-80 group-hover:text-[#e5f1ee] group-hover:opacity-90 transition-all">
            The foundation. 15 high-performance base units featuring proprietary cushioning and traction logic.
          </p>
          <div className="mt-8 md:mt-12 w-10 h-10 md:w-12 md:h-12 border-2 border-[#17191d] group-hover:border-[#e5f1ee] flex items-center justify-center font-bold group-hover:text-[#e5f1ee] transition-all">
            →
          </div>
        </div>
        {/* Decorative Watermark */}
        <div className="absolute top-[-5%] right-[-5%] font-display text-[15vw] lg:text-[20vw] opacity-[0.2] pointer-events-none group-hover:opacity-[0.05] group-hover:text-white transition-all">BASE</div>
      </Link>
    </div>
  )
}