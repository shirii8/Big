"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

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
    detail: "Full-length soft PU midsole + Multi-directional hard PU outsole.",
    color: "#d4604d"
  },
  {
    num: "02",
    title: "MECHANICAL LOCK",
    desc: "Just get the new upper into place. 20 seconds. No tools.",
    detail: "Interlocking lego-like mechanism tested for high-lateral movement.",
    color: "#17191d"
  },
  {
    num: "03",
    title: "CIRCULAR LOGIC",
    desc: "Better for style. Better for your wallet. Better for the planet.",
    detail: "Saves ~40% of total spend. Eliminates 60% of footwear waste.",
    color: "#d4604d"
  },
];

export default function HowItWorksPage() {
  const [faqOpen, setFaqOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const xLeft = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="bg-[#e5f1ee] text-[#17191d] selection:bg-[#d4604d] selection:text-white" ref={containerRef}>

      {/* ── NOISE OVERLAY (Adds "Texture" to empty space) ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ══ HERO SECTION ════════════════════════ */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-6 md:px-12 overflow-hidden">

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-12">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-[#d4604d]" />
              <span className="font-mono text-xs tracking-widest uppercase font-bold">Technical Blueprint</span>
            </div>

            <h1 className="font-display leading-[0.85] tracking-tighter" style={{ fontSize: "clamp(50px, 12vw, 150px)" }}>
              ONE SOLE.<br />
              <span className="text-[#d4604d] italic">INFINITE</span> <br />
              <span className="stroke-text" style={{ WebkitTextStroke: '2px #17191d', color: 'transparent' }}>UPPERS.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 md:mb-12 md:max-w-xs border-l-4 border-[#d4604d] pl-6 py-2"
          >
            <h2 className="font-display text-4xl lg:text-5xl uppercase leading-[0.9] tracking-tighter mb-4">
              Founded by <br />
              <span className="text-[#d4604d]">Young</span> & <br />
              <span className="text-[#d4604d]">Frustrated</span> <br />
              IITIANS.
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[2px] opacity-60 leading-relaxed font-bold">
              We engineered a system to stop you from buying the exact same sole repeatedly.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ══ KINETIC MARQUEE (Kills negative space) ══════════════
      <div className="bg-[#17191d] py-4 overflow-hidden whitespace-nowrap border-y border-[#d4604d]">
        <motion.div style={{ x: xLeft }} className="flex gap-20">
          {[1, 2, 3, 4].map((_) => (
            <span key={_} className="text-[#e5f1ee] font-display text-4xl italic tracking-tighter opacity-80">
                MODULAR HARDWARE SYSTEM — WASTE REDUCTION — 3-YEAR CYCLE — INTERLOCKING PINS — 
            </span>
          ))}
        </motion.div>
      </div> */}

      {/* ══ THE WORKFLOW (Mechanical Grid) ═══════════════ */}
      <section className="px-6 md:px-12 py-24 relative overflow-hidden bg-[#e5f1ee]">
        {/* Background Blueprint Grid (Only visible on the mint bg) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(#17191d_1px,transparent_1px),linear-gradient(90deg,#17191d_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="max-w-7xl mx-auto mb-12 relative z-10">
          <h2 className="font-display text-7xl md:text-9xl uppercase tracking-tighter leading-[0.8]">
            THE<span className="text-[#d4604d]">LOGIC</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="relative group bg-[#17191d] text-[#e5f1ee] p-8 md:p-12 min-h-[420px] flex flex-col border-b-4 border-r-4 border-[#d4604d] shadow-[12px_12px_0px_0px_rgba(23,25,29,0.1)]"
            >
              {/* Scan-line Texture (Kills the flat empty feel) */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#e5f1ee_3px)]" />

              <div className="flex justify-between items-start mb-16">
                <span className="font-mono text-5xl font-black text-[#d4604d] opacity-50">{s.num}</span>
                <div className="font-mono text-[10px] tracking-[4px] uppercase opacity-40">
                  .{s.num}
                </div>
              </div>

              <h3 className="font-display text-5xl uppercase tracking-tighter leading-none mb-6 text-white">
                {s.title}
              </h3>

              <p className="text-[#e5f1ee]/80 font-medium leading-snug mb-8 max-w-[280px]">
                {s.desc}
              </p>

              {/* Technical Footer (Mint box inside Dark card) */}
              <div className="mt-auto bg-[#e5f1ee]/10 p-5 border-l-2 border-[#d4604d]">
                <p className="font-mono text-[10px] uppercase leading-tight tracking-widest text-[#d4604d] font-bold mb-1">
                  TECH_SPEC:
                </p>
                <p className="font-mono text-[11px] leading-tight text-[#e5f1ee]">
                  {s.detail}
                </p>
              </div>

              {/* Branding Corner */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#d4604d] flex items-center justify-center" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}>
                <span className="text-[#17191d] font-mono text-[10px] font-bold -translate-y-2 translate-x-1">BEST</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ FAQ SECTION ════════════════════════ */}
      <section className="py-24 px-6 md:px-12 bg-[#17191d] text-[#e5f1ee]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <h2 className="font-display text-6xl md:text-8xl tracking-tighter uppercase leading-none">
              System<br /><span className="text-[#d4604d]">Queries</span>
            </h2>
            <button
              onClick={() => setFaqOpen(!faqOpen)}
              className="bg-[#d4604d] text-white font-mono text-xs font-bold px-8 py-4 rounded-full hover:bg-[#e5f1ee] hover:text-[#17191d] transition-all"
            >
              {faqOpen ? "CLOSE INTERFACE" : "ACCESS ALL FAQ"}
            </button>
          </div>

          <div className="space-y-6">
            {FAQ_DATA.slice(0, faqOpen ? 10 : 3).map((item, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="group border-b border-[#e5f1ee]/10 pb-6"
              >
                <summary className="list-none cursor-pointer flex justify-between items-center font-display text-2xl uppercase hover:text-[#d4604d] transition-colors">
                  <span className="flex gap-4">
                    <span className="font-mono text-xs text-[#d4604d] mt-2">0{i + 1}</span>
                    {item.q}
                  </span>
                  <span className="text-3xl group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-6 text-[#e5f1ee]/60 leading-relaxed font-medium pl-8 border-l-2 border-[#d4604d]">
                  {item.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STICKY CONTACT/CTA ══════════════════ */}
      <section className="py-20 px-6 bg-[#d4604d] text-[#17191d] flex flex-col items-center overflow-hidden relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 opacity-10"
        >
          <div className="w-64 h-64 border-[40px] border-[#17191d] rounded-full" />
        </motion.div>

        <h2 className="font-display text-5xl md:text-8xl tracking-tighter mb-8 z-10">Discover <span className="text-white">Sneakers</span> beyond NORMS.</h2>
        <a href="/products" className="z-10 bg-[#17191d] text-white px-12 py-6 font-mono text-sm font-black tracking-widest uppercase hover:scale-105 transition-transform active:scale-95">
          All Drops →
        </a>
      </section>

      <style jsx>{`
        .clip-path-triangle {
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }
        .stroke-text {
          -webkit-text-stroke: 2px #17191d;
        }
      `}</style>
    </div>
  );
}