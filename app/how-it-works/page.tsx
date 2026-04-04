"use client";

import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const ModularCanvas = dynamic(() => import("@/components/3d/ModularCanvas"), {
  ssr: false,
});

const STEPS = [
  {
    num: "01",
    title: "THE FOUNDATION",
    desc: "Your sole is the investment. High-quality, engineered to last years. The foundation that never changes.",
    detail: "Full-length EVA midsole + Multi-directional rubber outsole. Built for a 5-year lifecycle.",
  },
  {
    num: "02",
    title: "MECHANICAL LOCK",
    desc: "Just click the new upper into place. 30 seconds. No tools. No waste.",
    detail: "Interlocking magnetic rail system tested for high-lateral movement and vertical jumps.",
  },
  {
    num: "03",
    title: "CIRCULAR LOGIC",
    desc: "Better for your wallet. Better for the planet. Swap only what actually wears out.",
    detail: "Saves ~60% of total spend and eliminates 75% of footwear material waste annually.",
  },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const xLeft = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const xRight = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <div className="bg-[#e5f1ee] text-[#17191d] overflow-x-hidden" ref={containerRef}>
      
      {/* ══ HERO: ARCHITECTURAL HEADER ════════════════════════ */}
      <section className="relative pt-44 pb-24 px-6 md:px-12 flex flex-col items-center text-center">
        {/* Background Grid Elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#17191d 1px, transparent 1px), linear-gradient(90deg, #17191d 1px, transparent 1px)`, size: '40px 40px' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <SectionLabel>Technical Blueprint</SectionLabel>
          <h1 className="font-display leading-[0.85] mt-6 tracking-tighter" style={{ fontSize: "clamp(60px, 12vw, 140px)" }}>
            ONE SOLE.<br />
            <span className="text-[#d4604d] italic">INFINITE</span> <span className="stroke-text" style={{ WebkitTextStroke: '2px #17191d', color: 'transparent' }}>UPPERS.</span>
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[4px] mt-8 text-[#17191d]/60 max-w-xl mx-auto">
            Deconstructing the traditional sneaker silhouette into a modular hardware system.
          </p>
        </motion.div>
      </section>

      {/* ══ INTERACTIVE EXPLODED VIEW ═════════════════════════ */}
      <section className="px-6 md:px-12 py-12 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Info Stack */}
          <div className="lg:col-span-4 sticky top-32 space-y-4 z-20">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                onMouseEnter={() => setActiveStep(i)}
                className={`group p-8 border transition-all duration-500 cursor-none relative overflow-hidden ${
                  activeStep === i 
                  ? "bg-[#17191d] border-[#17191d] shadow-2xl" 
                  : "bg-white/40 border-[#17191d]/10 backdrop-blur-sm"
                }`}
              >
                <span className={`font-mono text-[10px] mb-4 block ${activeStep === i ? "text-[#d4604d]" : "text-[#17191d]/40"}`}>
                  PROTOCOL_{s.num}
                </span>
                <h3 className={`font-display text-2xl mb-3 ${activeStep === i ? "text-[#e5f1ee]" : "text-[#17191d]"}`}>
                  {s.title}
                </h3>
                <AnimatePresence mode="wait">
                  {activeStep === i && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm leading-relaxed text-[#e5f1ee]/70"
                    >
                      {s.desc}
                      <span className="block mt-4 pt-4 border-t border-white/10 text-[11px] text-[#d4604d] font-bold uppercase tracking-wider">
                        {s.detail}
                      </span>
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Decorative scanning line */}
                {activeStep === i && (
                  <motion.div 
                    layoutId="scan"
                    className="absolute top-0 left-0 w-full h-[2px] bg-[#d4604d] shadow-[0_0_15px_#d4604d]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right: 3D Visual Stage */}
          <div className="lg:col-span-8 sticky top-24 h-[70vh] lg:h-[85vh] rounded-3xl overflow-hidden bg-white shadow-inner border-4 border-white">
             {/* Tech Overlay Elements */}
             <div className="absolute top-8 left-8 z-10 font-mono text-[10px] space-y-1 text-[#17191d]/40">
                <p>SIM_STATE: ACTIVE</p>
                <p>INTERFACE_VER: 2.04</p>
                <p>COORD: 45.23 // 12.89</p>
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center">
                <ModularCanvas step={activeStep} />
             </div>

             {/* Dynamic Depth Circles */}
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[300px] h-[300px] border border-[#d4604d]/10 rounded-full animate-ping opacity-20" />
                <div className="w-[500px] h-[500px] border border-[#d4604d]/5 rounded-full absolute animate-pulse" />
             </div>
          </div>
        </div>
      </section>

      {/* ══ THE "WHY" SECTION: STATS & LAYERS ═════════════════ */}
      {/* <section className="py-32 px-6 md:px-12 bg-[#17191d] text-[#e5f1ee] relative overflow-hidden"> */}
        {/* Large Decorative Text Layer */}
        {/* <div className="absolute bottom-0 right-0 font-display text-[20vw] rounded-r-4xl leading-none opacity-[0.03] select-none translate-y-1/4">
          /TESSCH/
        </div>

        <div className="max-w-6xl mx-auto">
          <SectionLabel>Impact Report</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-12">
            <div>
              <h2 className="font-display text-5xl md:text-7xl tracking-tighter leading-none mb-8">
                ENGINEERED FOR <br/>
                <span className="text-[#d4604d]">LONGEVITY.</span>
              </h2>
              <p className="text-lg text-[#e5f1ee]/60 leading-relaxed max-w-md">
                We calculated that 80% of sneaker waste comes from uppers that fray while the sole is still perfectly functional. We simply removed the friction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { val: "30s", label: "Swap Time", sub: "Instant aesthetic shift" },
                { val: "75%", label: "Less Waste", sub: "Material conservation" },
                { val: "5-Year", label: "Sole Life", sub: "Built for endurance" },
                { val: "∞", label: "Possibility", sub: "Community uppers" },
              ].map((stat, i) => (
                <div key={i} className="border-l border-[#d4604d]/30 pl-6 py-2">
                  <div className="font-display text-5xl text-[#d4604d] mb-1">{stat.val}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#e5f1ee]">{stat.label}</div>
                  <div className="text-[11px] text-[#e5f1ee]/40 mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      {/* </section> */}

      {/* ══ FAQ: MINIMALIST ACCORDION ════════════════════════ */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <SectionLabel>Intelligence</SectionLabel>
        <h2 className="font-display text-5xl mb-16">COMMON QUERIES</h2>
        
        <div className="space-y-4">
          {[
            { q: "Durability during movement?", a: "The interlocking rail system is designed for high-impact sports. It uses friction-lock technology that tightens as weight is applied." },
            { q: "Universal compatibility?", a: "Every upper ever dropped by TESSCH is compatible with the version 1.0 sole interface. Your collection never expires." },
            { q: "Sole replacement program?", a: "When your tread finally goes smooth, send us the sole. We recycle the EVA and send you a fresh foundation at cost price." }
          ].map((item, i) => (
            <details key={i} className="group border-b border-[#17191d]/10 pb-6">
              <summary className="list-none cursor-none flex justify-between items-center font-display text-xl uppercase hover:text-[#d4604d] transition-colors">
                {item.q}
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-[#17191d]/60 leading-relaxed font-medium">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════ */}
      {/* <section className="pb-32 px-6 text-center">
        <div className="max-w-3xl mx-auto p-16 bg-[#d4604d] clip-btn relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#17191d] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          
          <div className="relative z-10">
            <h2 className="font-display text-5xl md:text-7xl text-[#e5f1ee] mb-8">READY TO EVOLVE?</h2>
            <a href="/products" className="inline-block bg-[#e5f1ee] text-[#17191d] font-mono text-xs font-bold tracking-widest uppercase px-12 py-5 hover:scale-105 transition-transform">
              EXPLORE THE RANGE →
            </a>
          </div>
        </div>
      </section> */}

    </div>
  );
}