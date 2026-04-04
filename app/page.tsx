"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import PreOrderModal from "@/components/ui/PreOrderModal"; 
import HowItWorksPage from "./how-it-works/page";
import FinalDropCTA from "./drop/page";
import ProductsPage from "./products/page";
import StoryPage from "./about/page";
import RangeMarquee from "@/components/ui/Marque";
import {
  REVIEWS,
  TICKER_ITEMS,
  MARQUEE_WORDS,
  DROP_DATE,
  type Product,
  TIMELINE,
} from "@/lib/data";

const HeroCanvas = dynamic(() => import("@/components/3d/HeroCanvas"), {
  ssr: false,
});

function useCountdown(target: number) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const countdown = useCountdown(DROP_DATE);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const openModal = (p: Product | null = null) => {
    setSelectedProduct(p);
    setModalOpen(true);
  };

  return (
    <div className="bg-[#e5f1ee] text-[#17191d] selection:bg-[#d4604d] selection:text-white">
      <PreOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={selectedProduct}
      />

      {/* ══ HERO SECTION ══════════════════════════════════════════════ */}
      <section
        ref={containerRef}
        id="home"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
      >
        {/* Background Subtle Tech Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[10%] left-[2%] w-px h-[80%] bg-gradient-to-b from-transparent via-[#d4604d] to-transparent" />
          <div className="absolute top-[20%] right-[10%] w-[420px] h-[280px] rounded-full border border-[#d4604d]/20 blur-3xl" />
        </div>

        <div className="relative z-10 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: ENHANCED TAGLINE */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <span className="w-12 h-px bg-[#d4604d]" />
              <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#d4604d] font-bold">
                Next-Gen Modular System
              </span>
            </motion.div>

            <div className="relative">
              <motion.h1
                style={{ y: yText }}
                className="font-display leading-[0.82] select-none"
              >
                <span className="block text-[clamp(60px,12vw,160px)] pb-2 font-black tracking-tighter text-[#17191d]">
                  BREAK
                </span>
                <span
                  className="block text-[clamp(60px,12vw,160px)] pb-2 font-black tracking-tighter stroke-text relative -mt-4 lg:-mt-8"
                  style={{
                    WebkitTextStroke: "2px #17191d",
                    color: "transparent",
                  }}
                >
                  THE
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="absolute top-1/2 left-0 h-[8px] bg-[#d4604d] z-[-1]"
                  />
                </span>
                <span className="block text-[clamp(60px,12vw,160px)] pb-2 font-black tracking-tighter text-[#d4604d] -mt-4 lg:-mt-8">
                  GRID
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-[16px] md:text-[18px] text-[#17191d]/80 leading-relaxed max-w-[450px] font-medium"
              >
                Keep the sole.{" "}
                <span className="text-[#d4604d] underline decoration-2 underline-offset-4 font-bold">
                  Swap the upper.
                </span>
                The world&apos;s first fully modular sneaker designed to evolve
                with your environment.
              </motion.p>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={() => openModal()}
                className="clip-btn bg-[#d4604d] text-white font-mono text-[12px] font-bold tracking-[2px] uppercase px-10 py-5 transition-all hover:bg-[#17191d] hover:scale-105"
              >
                Pre-Order Drop 001
              </button>
            </div>
          </div>

          {/* RIGHT: ANIMATED SNEAKER VIDEO SLOT */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 0.8, opacity: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="lg:col-span-5 relative -mt-8 -mr-2"
          >
            {/* Stylized Backdrop for Depth */}
            <div className="absolute -inset-4 border border-[#17191d]/10 rounded-2xl rotate-3 pointer-events-none" />
            <div className="absolute -inset-4 bg-[#d4604d]/5 rounded-2xl -rotate-3 pointer-events-none" />

            <div className="relative aspect-[16/20] w-full overflow-hidden rounded-xl bg-white shadow-2xl border-4 border-white group">
              {/* Replace the 'src' with your Veo sneaker video link */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              >
                <source
                  src="https://res.cloudinary.com/dttnc62hp/video/upload/q_auto/f_auto/v1775055748/WhatsApp_Video_2026-04-01_at_20.22.23_eoqimx.mp4"
                  type="video/mp4"
                />
              </video>

              {/* Overlay Tech Data */}
              <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[#17191d] bg-white/80 backdrop-blur-sm px-3 py-2 rounded">
                DATA_REF: SNKR_MOD_001 // SCALE 1:1
              </div>
            </div>

            {/* Float Elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#d4604d] clip-btn flex items-center justify-center text-white font-display text-xl animate-spin-slow">
              ✦
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[8px] tracking-[4px] uppercase text-[#17191d]/40">
            Explore
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-[#d4604d] to-transparent" />
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════ */}
      <section id="how-it-works" className="px-6 md:px-12 py-24 bg-white">
        <SectionLabel>Innovation</SectionLabel>
        <HowItWorksPage />
      </section>

      {/*MARQUE */}
      <section className="-mt-20">
        <RangeMarquee />
      </section>

      {/* ══ RANGE (COLORWAYS) ═════════════════════════════════════════ */}
      <section>
        <ProductsPage />
      </section>

      {/* ══ ABOUT US ═══════════════════════════════════════════ */}
      <section
        id="about"
        className="px-6 md:px-12 py-20 bg-[#17191d] text-[#e5f1ee]"
      >
        <SectionLabel>Our Story</SectionLabel>
        <StoryPage />
      </section>

      {/* ══ PRE-ORDER / DROP ═══════════════════════════════════ */}
      <section
        id="pre-order"
        className="px-6 md:px-12 py-24 text-center border-t border-[#17191d]/10"
      >
        <FinalDropCTA/>
        {/* <h2 className="font-display text-[clamp(40px,8vw,100px)] mb-6">
          DROP 001{" "}
          <span className="text-[#d4604d]">
            {pad(countdown.d)}:{pad(countdown.h)}:{pad(countdown.m)}
          </span>
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-[#17191d] text-[#e5f1ee] px-16 py-6 font-mono text-[14px] font-bold uppercase tracking-widest hover:bg-[#d4604d] transition-colors"
        >
          Secure Your Pair
        </button> */}
      </section>

      {/* ══ FOOTER STRIP ═══════════════════════════════════════ */}
      <footer className="border-t border-[#17191d]/5 px-6 md:px-12 py-12 flex justify-between items-center">
        <p className="font-mono text-[10px] tracking-widest uppercase opacity-40">
          ©2026 TESSCH® SYSTEM
        </p>
        <div className="flex gap-8">
          <a
            href="#"
            className="font-mono text-[10px] tracking-widest uppercase hover:text-[#d4604d]"
          >
            Instagram
          </a>
          <a
            href="#"
            className="font-mono text-[10px] tracking-widest uppercase hover:text-[#d4604d]"
          >
            Discord
          </a>
        </div>
      </footer>
    </div>
  );
}
