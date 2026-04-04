'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TIMELINE = [
  { 
    id: 0, 
    year: "2021", 
    loc: "Kota", 
    title: "It started with curiosity", 
    short: "Built from a broken sole.", 
    full: "A city built for exams. The ambition was always there but with no clear direction, it just sat there. Lockdown gave it room to breathe. The mindset started shifting. Slowly, but permanently.", 
    tag: "THE SPARK" 
  },
  { 
    id: 1, 
    year: "SEP '21", 
    loc: "Kota", 
    title: "One broken shoe", 
    short: "Why replace the whole shoe?", 
    full: "₹3,000. Wore out in under a year. The sole was fine, only the upper was gone. Why replace the whole shoe when only half is damaged? What if you could just swap the upper? It was a raw thought. Nothing more.", 
    tag: "EPIPHANY" 
  },
  { 
    id: 2, 
    year: "2023", 
    loc: "IIT Kanpur", 
    title: "The idea refused to stay an idea", 
    short: "Thinking got sharper.", 
    full: "Cleared JEE, moved to IITK. The thinking got sharper. By 3rd semester, it was time to actually do something about it.", 
    tag: "EVOLUTION" 
  },
  { 
    id: 3, 
    year: "AUG '24", 
    loc: "MedTech Lab", 
    title: "The first real bet", 
    short: "Built with cardboard and nails.", 
    full: "The first alpha prototype : assembled in the MedTech Lab from an old shoe, cardboard, nails, and foam. It looked rough. But it made the idea real. Shortly after, almost all personal savings ~ ₹10,000 went into turning rough sketches into professional designs. No guarantee. No backup plan. Just belief.", 
    tag: "PROTOTYPE" 
  },
  { 
    id: 4, 
    year: "2024", 
    loc: "Factories", 
    title: "Factories said no. One said yes.", 
    short: "Rejection was useful.", 
    full: "Manufacturers in Kanpur and Agra turned them away, repeatedly. Finally one agreed. Five months to build the first working prototype. Another five fixing what broke. By September 2024, the MVP was ready. Mid-2025: Tried to raise ₹30L for manufacturing. Mostly got turned down. The product wasn't ready enough. So instead of forcing it, We went back to building.", 
    tag: "THE GRIND" 
  },
  { 
    id: 5, 
    year: "2025", 
    loc: "Validation", 
    title: "The team came together", 
    short: "Strangers cared.", 
    full: "May 2025: A simple waitlist, not just shared with friends. 250+ SIGNUPS. Most of them people we'd never met. That changed everything. June 2025: Pratham found the idea on his own and joined. Same vision, same energy. The company was officially registered.", 
    tag: "VITALITY" 
  },
  { 
    id: 6, 
    year: "2026", 
    loc: "Now", 
    title: "Took it public", 
    short: "Samples tested and validated.", 
    full: "Late 2025: 25 samples handed to friends and family. Worn in rough conditions. Pushed to fail. Sarthak and Daksh came on board. Showcased at ESummit IIT Kanpur - 600+ people at the stall. Over 2.5 Lakhs spent of our own. Final designs locked. Pre-orders have started. Fundraising ongoing for the first production batch.", 
    tag: "MISSION" 
  },
]

export default function Story() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const SLIDE_DURATION = 8000 // 8 seconds per slide

  // ─── AUTO-SHIFT LOGIC ───
  useEffect(() => {
    if (isHovered) return

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % TIMELINE.length)
    }, SLIDE_DURATION)

    return () => clearTimeout(timer)
  }, [activeIndex, isHovered])

  return (
    <section 
      id="about" 
      className="bg-[#e5f1ee] text-[#17191d] relative h-[88vh] w-full flex flex-col overflow-hidden border-t border-[#17191d]/10"
    >
      {/* ── HEADER (Reduced padding to fit h-screen) ── */}
      <header className="pt-6 pb-4 px-6 md:px-12 w-full max-w-[1440px] mx-auto shrink-0">
        <div className="flex justify-between items-end border-b-2 border-[#17191d]/10 pb-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[4px] opacity-40">Archive / Section 04</span>
            <h2 className="font-display text-[clamp(32px,5vw,70px)] leading-[0.85] tracking-tighter uppercase mt-1">
               OUR <span className="text-[#d4604d]">STORY.</span>
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="font-mono text-[9px] uppercase font-bold tracking-widest">Phase 0{activeIndex + 1}</p>
          </div>
        </div>
      </header>

      {/* ── TIMELINE NAV (Tighter) ── */}
      <nav className="w-full border-b border-[#17191d]/10 bg-[#e5f1ee] z-20 shrink-0">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          {TIMELINE.map((m, i) => (
            <button 
              key={m.id}
              onClick={() => setActiveIndex(i)}
              className="relative flex-1 group py-3 transition-all"
            >
              <div className={`text-center font-mono text-[10px] font-bold uppercase transition-all duration-300 ${activeIndex === i ? 'text-[#17191d]' : 'text-[#17191d]/20 hover:text-[#17191d]'}`}>
                {m.year}
              </div>
              {activeIndex === i && (
                <motion.div layoutId="active-bar" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4604d]" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* ── CONTENT AREA (Adjusted for visibility) ── */}
      <div 
        className="flex-1 relative overflow-hidden flex items-stretch bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-stretch"
          >
            {/* Left: Short Titles */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 border-b md:border-b-0 md:border-r border-[#17191d]/10">
              <span className="font-mono text-[8px] text-[#d4604d] font-bold tracking-[4px] mb-4 border-l-2 border-[#d4604d] pl-4">
                {TIMELINE[activeIndex].tag}
              </span>
              <h3 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.85]">
                {TIMELINE[activeIndex].short}
              </h3>
            </div>

            {/* Right: Detailed Story */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 bg-[#f8fcfb]/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-6 bg-[#17191d]" />
                <p className="font-mono text-[8px] uppercase tracking-[2px] opacity-40">
                  {TIMELINE[activeIndex].loc} // Archive
                </p>
              </div>
              
              <h4 className="font-display text-2xl md:text-3xl uppercase mb-4 tracking-tight leading-none text-[#d4604d]">
                {TIMELINE[activeIndex].title}
              </h4>
              
              <p className="text-sm md:text-base lg:text-lg leading-relaxed text-[#17191d] max-w-lg">
                {TIMELINE[activeIndex].full}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar (Bottom of Slide) */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#17191d]/5 z-30">
          <motion.div 
            key={activeIndex + (isHovered ? '-paused' : '-running')} // Reset animation on hover change
            initial={{ scaleX: 0 }}
            animate={isHovered ? { scaleX: 0 } : { scaleX: 1 }} // Pause bar visually if hovered
            transition={isHovered ? { duration: 0 } : { duration: SLIDE_DURATION / 1000, ease: "linear" }}
            style={{ transformOrigin: "left" }}
            className="h-full bg-[#d4604d]"
          />
        </div>
      </div>
    </section>
  )
}