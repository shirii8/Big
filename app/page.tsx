"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// Kinde Auth Imports
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, RegisterLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

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
  // Kinde Hook
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  
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
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[10%] left-[2%] w-px h-[80%] bg-gradient-to-b from-transparent via-[#d4604d] to-transparent" />
          <div className="absolute top-[20%] right-[10%] w-[420px] h-[280px] rounded-full border border-[#d4604d]/20 blur-3xl" />
        </div>

        <div className="relative z-10 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <span className="w-12 h-px bg-[#d4604d]" />
              <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#d4604d] font-bold">
                {isAuthenticated ? `Welcome Back, ${user?.given_name}` : "Next-Gen Modular System"}
              </span>
            </motion.div>

            <div className="relative">
              <motion.h1 style={{ y: yText }} className="font-display leading-[0.82] select-none">
                <span className="block text-[clamp(60px,12vw,160px)] pb-2 font-black tracking-tighter text-[#17191d]">BREAK</span>
                <span className="block text-[clamp(60px,12vw,160px)] pb-2 font-black tracking-tighter stroke-text relative -mt-4 lg:-mt-8" style={{ WebkitTextStroke: "2px #17191d", color: "transparent" }}>
                  THE
                  <motion.span initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 1 }} className="absolute top-1/2 left-0 h-[8px] bg-[#d4604d] z-[-1]" />
                </span>
                <span className="block text-[clamp(60px,12vw,160px)] pb-2 font-black tracking-tighter text-[#d4604d] -mt-4 lg:-mt-8">GRID</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 text-[16px] md:text-[18px] text-[#17191d]/80 leading-relaxed max-w-[450px] font-medium">
                Keep the sole. <span className="text-[#d4604d] underline decoration-2 underline-offset-4 font-bold">Swap the upper.</span> The world&apos;s first fully modular sneaker designed to evolve.
              </motion.p>
            </div>

            {/* AUTH LOGIC BUTTONS
            <div className="flex flex-wrap gap-4 mt-4">
              {isLoading ? (
                <div className="font-mono text-[12px] animate-pulse">SYSTEM_LOADING...</div>
              ) : isAuthenticated ? (
                <button
                  onClick={() => openModal()}
                  className="clip-btn bg-[#d4604d] text-white font-mono text-[12px] font-bold tracking-[2px] uppercase px-10 py-5 transition-all hover:bg-[#17191d] hover:scale-105"
                >
                  Access Drop 001
                </button>
              ) : (
                <>
                  <LoginLink>
                    <button className="clip-btn bg-[#d4604d] text-white font-mono text-[12px] font-bold tracking-[2px] uppercase px-10 py-5 transition-all hover:bg-[#17191d]">
                      Sign In
                    </button>
                  </LoginLink>
                  <RegisterLink>
                    <button className="clip-btn border-2 border-[#17191d] text-[#17191d] font-mono text-[12px] font-bold tracking-[2px] uppercase px-10 py-5 transition-all hover:bg-[#17191d] hover:text-white">
                      Create Account
                    </button>
                  </RegisterLink>
                </>
              )}
            </div> */}
          </div>

          {/* RIGHT: ANIMATED SNEAKER VIDEO */}
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 0.8, opacity: 1 }} transition={{ duration: 1, ease: "circOut" }} className="lg:col-span-5 relative -mt-8 -mr-2">
            <div className="relative aspect-[16/20] w-full overflow-hidden rounded-xl bg-white shadow-2xl border-4 border-white group">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700">
                <source src="https://res.cloudinary.com/dttnc62hp/video/upload/q_auto/f_auto/v1775055748/WhatsApp_Video_2026-04-01_at_20.22.23_eoqimx.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[#17191d] bg-white/80 backdrop-blur-sm px-3 py-2 rounded">
                DATA_REF: SNKR_MOD_001 // STATUS: {isAuthenticated ? "USER_VERIFIED" : "GUEST_VIEW"}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ CONTENT SECTIONS ═════════════════════════════════════════ */}
      <section id="how-it-works" className="px-6 md:px-12 py-24 bg-white">
        <SectionLabel>Innovation</SectionLabel>
        <HowItWorksPage />
      </section>

      <section className="-mt-20"><RangeMarquee /></section>

      <section><ProductsPage /></section>

      <section id="about" className="px-6 md:px-12 py-20 bg-[#17191d] text-[#e5f1ee]">
        <SectionLabel>Our Story</SectionLabel>
        <StoryPage />
      </section>

      <section id="pre-order" className="px-6 md:px-12 py-24 text-center border-t border-[#17191d]/10">
        <FinalDropCTA/>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="border-t border-[#17191d]/5 px-6 md:px-12 py-12 flex justify-between items-center">
        <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] tracking-widest uppercase opacity-40">©2026 TESSCH® SYSTEM</p>
            {user && <p className="font-mono text-[9px] text-[#d4604d] uppercase">Encrypted Session: {user.id?.slice(0,8)}</p>}
        </div>
        
        <div className="flex gap-8 items-center">
          {isAuthenticated && (
            <LogoutLink>
              <button className="font-mono text-[10px] tracking-widest uppercase text-[#d4604d] hover:line-through transition-all">
                Terminate Session [X]
              </button>
            </LogoutLink>
          )}
          <a href="#" className="font-mono text-[10px] tracking-widest uppercase hover:text-[#d4604d]">Instagram</a>
          <a href="#" className="font-mono text-[10px] tracking-widest uppercase hover:text-[#d4604d]">Discord</a>
        </div>
      </footer>
    </div>
  );
}