"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import PreOrderModal from "@/components/ui/PreOrderModal";
import HowItWorksPage from "./how-it-works/page";
import FinalDropCTA from "./drop/page";
import ProductsPage from "./products/page";
import StoryPage from "./about/page";
import RangeMarquee from "@/components/ui/Marque";
import BestProd from "@/components/ui/BestProd";
import { type Product } from "@/lib/data";

export default function HomePage() {
  const { isAuthenticated, user } = useKindeBrowserClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const openModal = (p: Product | null = null) => {
    setSelectedProduct(p);
    setModalOpen(true);
  };

  return (
    <div className="bg-[#e5f1ee] text-[#17191d] selection:bg-[#d4604d] selection:text-white overflow-x-hidden">
      <PreOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={selectedProduct}
      />

      {/* ══ HERO SECTION ══ */}
      <section
        ref={containerRef}
        id="home"
        className="relative min-h-screen flex flex-col pt-20 md:pt-32"
      >
       

        {/* 2. TYPOGRAPHY HEADLINE */}
        <motion.div
          style={{ y: textY }}
          className="w-full pt-4 px-6 md:px-12 flex flex-col items-center text-center z-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 mt-4"
          >
            <span className="w-12 h-px bg-[#d4604d]" />
            <span className="font-mono text-[11px] tracking-[6px] uppercase text-[#d4604d] font-black">
              {isAuthenticated
                ? `Welcome Back, ${user?.given_name}`
                : "INDIA'S FIRST MODULAR SNEAKER"}
            </span>
            <span className="w-12 h-px bg-[#d4604d]" />
          </motion.div>

          <h1 className="font-display leading-[0.75] uppercase select-none tracking-[-0.07em] mt-8">
            <span className="block text-[clamp(65px,18vw,160px)] text-[#17191d]">
              Stay YOU
            </span>
            <div className="relative inline-block">
              <span
                className="block text-[clamp(65px,18vw,180px)] stroke-text"
                style={{
                  WebkitTextStroke: "2.5px #17191d",
                  color: "transparent",
                }}
              >
                OR
              </span>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "115%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, ease: "circInOut" }}
                className="absolute top-[55%] left-[-7.5%] h-[12px] md:h-[28px] bg-[#d4604d] rotate-[-2.5deg] z-10 shadow-[0_0_30px_rgba(212,96,77,0.4)]"
              />
            </div>
            <span className="pt-8 block text-[clamp(65px,18vw,160px)] text-[#d4604d] mt-2 md:-mt-10">
              Stay Normal
            </span>
          </h1>
        </motion.div>
      </section>

       {/* 1. CINEMATIC VIDEO */}
        <div className="w-full px-4 md:px-12 relative z-10">
          <motion.div
            style={{ scale: videoScale }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full aspect-[16/9] md:aspect-[2.35/1] overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_rgba(0,0,0,0.12)] border-[8px] md:border-[16px] border-white group"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
            >
              <source
                src="https://res.cloudinary.com/dttnc62hp/video/upload/v1775913652/Stop_motion_tessch_shoe_iciz5a.mov"
                type="video/mp4"
              />
            </video>
            <div className="absolute top-2 left-6 md:top-10 md:left-10 z-20">
              <div className="bg-[#17191d] text-white font-mono text-[9px] md:text-[11px] px-3 py-1.5 uppercase tracking-[4px] skew-x-[-12deg]">
                System_Live_Feed // 001
              </div>
            </div>
          </motion.div>
        </div>

      {/* ── MANIFESTO & ACTION ROW ── */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 border-t border-[#17191d]/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div className="text-left md:w-2/3">
            <p className="text-[22px] md:text-[32px] text-[#17191d] leading-tight font-medium italic">
              Breaking Norms.
              <br />
              <span className="text-[#17191d] font-black underline decoration-[3px] underline-offset-4 md:underline-offset-8 decoration-[#d4604d]">
                Engineering a smarter silhouette.
              </span>
            </p>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[2px] opacity-40 mt-4 max-w-md leading-relaxed">
              Deconstructing the traditional sneaker into a high-performance
              modular archive. India's first build-system for the streets.
            </p>
          </div>

          <div className="md:w-1/3 flex justify-center md:justify-end">
            <Link
              href="/products"
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#17191d] transition-colors duration-500 group-hover:bg-[#d4604d] group-hover:border-[#d4604d]" />
                <div className="absolute bottom-[-2px] w-10 h-6 bg-[#d4604d]/30 rounded-full blur-md group-hover:opacity-0 transition-opacity" />
                <span className="relative z-10 text-[#17191d] text-2xl group-hover:text-white transition-all duration-300">
                  ↓
                </span>
              </div>
              <span className="font-mono text-[9px] font-black uppercase tracking-[4px] text-[#17191d] opacity-70 group-hover:opacity-100 transition-opacity">
               VIEW RANGE
              </span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <BestProd />
      </section>

      {/* ══ REMAINING SECTIONS ══ */}
      <section id="how-it-works" className="bg-white">
        <HowItWorksPage />
      </section>

      <RangeMarquee />
      <ProductsPage />

      <section
        id="about"
        className="px-6 md:px-12 py-20 bg-[#17191d] text-[#e5f1ee]"
      >
        <h4>Our Story</h4>
        <StoryPage />
      </section>

      <FinalDropCTA openModal={openModal} />

      {/* ══ FOOTER ══ */}
      
        {/* <div className="flex gap-8 items-center font-mono text-[10px] tracking-widest uppercase">
          {isAuthenticated && (
            <LogoutLink>
              <button className="text-[#d4604d] hover:line-through transition-all">
                Terminate Session [X]
              </button>
            </LogoutLink>
          )}
        </div> */}
      
    </div>
  );
}
