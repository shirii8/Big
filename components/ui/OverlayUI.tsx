'use client'

import { motion } from 'framer-motion'

export default function OverlayUI() {
  return (
    <div className="text-white font-mono pointer-events-none">
      
      {/* PAGE 1: HERO */}
      <section className="h-[100vh] w-full flex flex-col items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-[12vw] font-black leading-none tracking-tighter mix-blend-difference uppercase">
            TESSCH
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-white/50 tracking-widest uppercase">
            Scroll to deconstruct
          </p>
        </motion.div>
      </section>

      {/* PAGE 2: THE BREAK (Aligns with the mesh explosion) */}
      <section className="h-[100vh] w-full flex items-center justify-start p-12 md:p-24">
        <div className="max-w-xl">
          <h2 className="text-[6vw] font-bold leading-none text-[#C6FF00] uppercase mb-6">
            Modular. <br/> By Design.
          </h2>
          <p className="text-lg md:text-xl text-white/70 backdrop-blur-sm bg-black/20 p-6 border border-white/10 pointer-events-auto">
            One sole. Infinite expressions. We didn't just redesign the shoe; we broke the concept of footwear and rebuilt it around you. 
          </p>
        </div>
      </section>

      {/* PAGE 3: MATERIALS / MERGING */}
      <section className="h-[100vh] w-full flex items-center justify-end p-12 md:p-24 text-right">
        <div className="max-w-xl">
          <h2 className="text-[6vw] font-bold leading-none text-[#FF3D00] uppercase mb-6">
            Physics Defying
          </h2>
          <p className="text-lg md:text-xl text-white/70 backdrop-blur-sm bg-black/20 p-6 border border-white/10 pointer-events-auto">
            Magnetic locking systems. Aerospace-grade uppers. Swap from matte black to holographic chrome in 0.8 seconds.
          </p>
        </div>
      </section>

      {/* PAGE 4 & 5: PRE-ORDER (Camera breaks through the shoe here) */}
      <section className="h-[200vh] w-full flex flex-col items-center justify-end pb-32">
        <div className="text-center bg-black/40 backdrop-blur-md p-12 border border-[#C6FF00]/30 rounded-2xl pointer-events-auto">
          <h2 className="text-4xl md:text-7xl font-bold mb-8 uppercase tracking-tighter">
            Be the <span className="text-[#C6FF00]">First</span>
          </h2>
          <button className="bg-[#C6FF00] text-black px-12 py-5 text-xl font-bold uppercase tracking-widest hover:bg-white transition-all hover:scale-105 active:scale-95">
            Pre-Order Drop Zero
          </button>
          <p className="mt-6 text-sm text-white/40 font-mono">
            No resumes. No traditional marketing. Just the product.
          </p>
        </div>
      </section>

    </div>
  )
}