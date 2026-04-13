"use client";

import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

// const ModularCanvas = dynamic(() => import("@/components/3d/ModularCanvas"), {
//   ssr: false,
// });

const FAQ_DATA = [
  {
    q: "How do I attach or detach an upper?",
    a: "To detach, simply pull the sole away from the toe region with firm force. To attach, align the upper with the sole and press down firmly with your hands, or simply step into the upper while the sole is on the floor to click the interlocking pins into place."
  },
  {
    q: "How do I clean my TESSCH components?",
    a: "For the Foundation sole, use a standard cleaning brush with mild detergent. For uppers, we recommend a damp cloth or specialized sneaker wipes. Avoid harsh chemicals or machine washing to preserve the integrity of the modular rails."
  },
  {
    q: "Are future uppers compatible with current soles?",
    a: "Yes. Every upper in the TESSCH archive is engineered to be compatible with the version 1.0 Foundation sole interface, provided the sizes match. Your collection is built to be future-proof."
  },
  {
    q: "What if my sole wears out prematurely?",
    a: "While our soles are high-durability, intensive use may lead to wear. We offer a sole replacement program where you can purchase a fresh foundation unit separately without needing to buy a new upper."
  },
  {
    q: "Is there a warranty on the interlocking system?",
    a: "We provide a 3-month industrial warranty. If your interlocking pins break under normal usage within this period, we will provide a free upper exchange."
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, TESSCH ships exclusively within India. We are working on expanding our logistics to the global community soon."
  },
  {
    q: "Can I return or exchange for fit issues?",
    a: "Yes. If the fit isn't perfect, we offer a hassle-free exchange policy to ensure your modular setup feels exactly as intended."
  }
];



const STEPS = [
  {
    num: "01",
    title: "THE FOUNDATION",
    desc: "Your sole is the investment. High-quality, engineered to last years.",
    detail: "Full-length soft PU midsole + Multi-directional hard PU outsole. Built for a 3-year lifecycle.",
  },
  {
    num: "02",
    title: "MECHANICAL LOCK",
    desc: "Just get the new upper into place. 20 seconds. No tools. No waste.",
    detail: "Interlocking lego-like mechanism tested for high-lateral movement and vertical jumps.",
  },
  {
    num: "03",
    title: "CIRCULAR LOGIC",
    desc: "Better for style.Better for your wallet. Better for your wardrobe and Better for the planet. Swap only what actually wears out.",
    detail: "Saves ~40% of total spend. Eliminates 60 % of footwear material waste annually.",
  },
];

export default function HowItWorksPage() {
  const [faqOpen, setFaqOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const xLeft = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const xRight = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <div className="bg-[#e5f1ee] text-[#17191d] overflow-x-hidden" ref={containerRef}>
      
      {/* ══ HERO: ARCHITECTURAL HEADER ════════════════════════ */}
      <section className="relative pt-16 pb-4 px-6 md:px-12 flex flex-col items-center text-center">
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
    <section className="px-6 md:px-12 py-12 relative bg-[#e5f1ee]"> {/* Reduced from py-24 */}
  {/* Header Section */}
  <div className="max-w-7xl mx-auto mb-10 border-l-4 border-[#d4604d] pl-6">
    <span className="font-mono text-[10px] tracking-[5px] uppercase text-[#d4604d] font-black">
      System_Architecture // 01
    </span>
    <h2 className="font-display text-6xl uppercase tracking-tighter mt-2 text-[#17191d]">
      The Modular Workflow
    </h2>
  </div>

  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-[#17191d]">
      {STEPS.map((s, i) => (
        <motion.div
          key={i}
          onMouseEnter={() => setActiveStep(i)}
          className={`group p-10 border-r-2 last:border-r-0 border-[#17191d] transition-colors duration-300 flex flex-col h-full min-h-[380px] relative ${
            activeStep === i 
            ? "bg-[#17191d] text-[#e5f1ee]" 
            : "bg-white text-[#17191d] hover:bg-[#17191d]/5"
          }`}
        >
          <div className="flex justify-between items-start mb-12">
            <span className={`font-mono text-[10px] tracking-[3px] font-bold ${activeStep === i ? "text-[#d4604d]" : "text-[#17191d]/30"}`}>
              P_{s.num}
            </span>
            <span className="font-mono text-[10px] opacity-20">0{i + 1}</span>
          </div>

          <h3 className="font-display text-4xl uppercase tracking-tighter leading-[0.85] mb-6">
            {s.title}
          </h3>

          <div className="flex-grow">
            <p className={`text-[15px] leading-snug transition-opacity duration-300 ${activeStep === i ? "opacity-80" : "opacity-40"}`}>
              {s.desc}
            </p>
          </div>

          <AnimatePresence>
            {activeStep === i && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-6 border-t border-[#d4604d]/30"
              >
                <span className="font-mono text-[11px] text-[#d4604d] font-black uppercase tracking-[2px]">
                  {s.detail}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {activeStep === i && (
            <div className="absolute top-0 left-0 w-full h-[6px] bg-[#d4604d]" />
          )}
        </motion.div>
      ))}
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
<section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
  <SectionLabel>Intelligence</SectionLabel>
  
  {/* ── MAIN TOGGLE ── */}
  <h2
    className="font-display text-5xl mb-16 cursor-pointer group flex items-center gap-4 select-none"
    onClick={() => setFaqOpen(!faqOpen)}
  >
    COMMON QUERIES
    <span className={`text-3xl transition-transform duration-500 ${faqOpen ? 'rotate-45 text-[#d4604d]' : ''}`}>
      +
    </span>
  </h2>

  {/* ── CONDITIONAL RENDER ── */}
  <div className="space-y-4">
    {faqOpen && (
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        {FAQ_DATA.map((item, i) => (
          <details key={i} className="group border-b border-[#17191d]/10 pb-2">
            <summary className="list-none cursor-pointer flex justify-between items-center font-display text-xl uppercase hover:text-[#d4604d] transition-colors [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-2 text-[#17191d]/60 leading-relaxed font-medium pl-4 border-l border-[#d4604d]/30">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    )}
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