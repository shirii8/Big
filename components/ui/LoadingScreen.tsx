'use client'

import { useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  // Hooks into R3F to get the actual loading progress of your 3D models
  const { progress, active } = useProgress()
  const [displayProgress, setDisplayProgress] = useState(0)

  // Smooth out the progress number so it doesn't jump aggressively
  useEffect(() => {
    const smoothed = Math.max(displayProgress, Math.round(progress))
    setDisplayProgress(smoothed)
  }, [progress, displayProgress])

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-[#C6FF00] font-mono overflow-hidden"
    >
      {/* Background Grid & Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#C6FF00 1px, transparent 1px), linear-gradient(90deg, #C6FF00 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_80%)]" />

      {/* Main Loader Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Glitchy "INITIALIZING" text */}
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="text-[10px] tracking-[5px] uppercase text-[#FF3D00] mb-8"
        >
          Initializing Drop Zero Environment
        </motion.div>

        {/* Huge Progress Number */}
        <div className="text-[clamp(80px,15vw,160px)] font-black leading-none tracking-tighter mix-blend-difference mb-4">
          {displayProgress}
          <span className="text-[clamp(40px,5vw,80px)] text-white/30">%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 h-1 bg-white/10 relative overflow-hidden mt-4">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#C6FF00]"
            initial={{ width: 0 }}
            animate={{ width: `${displayProgress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>

        {/* System Logs (Fake terminal output for aesthetic) */}
        <div className="mt-12 text-[9px] text-white/40 tracking-widest uppercase flex flex-col items-center gap-1">
          <span>Loading Modular Meshes... {active ? 'Active' : 'Done'}</span>
          <span>Mounting WebGL Canvas...</span>
          <span className="text-[#C6FF00]">Awaiting User Scroll Protocol</span>
        </div>
      </div>
    </motion.div>
  )
}