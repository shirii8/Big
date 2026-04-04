import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const InteractiveColorways = () => {
  return (
    <section className="px-6 md:px-12 py-32 bg-tessch-universe relative overflow-hidden">
      <SectionLabel>Colorways</SectionLabel>
      
      <h2
        className="font-display mb-24 reveal text-white"
        style={{ fontSize: 'clamp(44px,5.5vw,76px)', lineHeight: 1 }}
      >
        PICK YOUR <br /> UNIVERSE
      </h2>

      {/* STAGGERED INTERACTIVE LAYOUT */}
      <div className="relative flex flex-col md:flex-row flex-wrap justify-center gap-8 md:gap-4 lg:gap-0">
        {COLORWAYS.map((cw, i) => (
          <InteractiveCard key={i} cw={cw} index={i} />
        ))}
      </div>
    </section>
  );
};

const InteractiveCard = ({ cw, index }) => {
  const ref = useRef(null);
  
  // Create a scroll-linked fade effect between components
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yOffset = index % 2 === 0 ? "0px" : "100px"; // Stagger effect
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, marginTop: yOffset }}
      className="relative w-full md:w-[30%] lg:w-[18%] aspect-[3/4] group cursor-pointer"
    >
      {/* SHADOW LAYER - Adds depth on hover */}
      <div className="absolute inset-4 bg-black/40 blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />

      {/* MAIN SWATCH */}
      <div 
        className="relative h-full w-full overflow-hidden flex flex-col justify-end p-6 border border-white/10 transition-transform duration-700 ease-out group-hover:-translate-y-4 group-hover:rotate-1"
        style={{ background: cw.bg }}
      >
        {/* Layered Color Block Overlay (The "Contrast" Effect) */}
        <div 
          className="absolute top-0 right-0 w-full h-1/2 opacity-10 mix-blend-overlay"
          style={{ background: `linear-gradient(to bottom, ${cw.text}, transparent)` }}
        />

        <h3 
          className="font-display text-[40px] leading-none mb-2 tracking-tighter"
          style={{ color: cw.text }}
        >
          {cw.name.split(' ')[0]}
        </h3>
        
        <div className="flex justify-between items-center overflow-hidden">
          <span className="font-mono text-[9px] tracking-[2px] uppercase opacity-70" style={{ color: cw.text }}>
            {cw.name}
          </span>
          {/* Animated line that grows on hover */}
          <div className="h-[1px] w-0 group-hover:w-12 transition-all duration-500" style={{ backgroundColor: cw.text }} />
        </div>
      </div>
    </motion.div>
  );
};