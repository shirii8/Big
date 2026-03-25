"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

const ModularCanvas = dynamic(() => import("@/components/3d/ModularCanvas"), {
  ssr: false,
});

const STEPS = [
  {
    num: "01",
    title: "Keep the Sole",
    desc: "Your sole is the investment. High-quality, engineered to last years. The foundation that never changes — cushioning, grip, structure. You buy it once.",
    detail:
      "The sole unit contains the full midsole, outsole, and cushioning system. It's what you're actually paying for when you buy a premium sneaker.",
  },
  {
    num: "02",
    title: "Swap the Upper",
    desc: "New colorway? New season? Just click the new upper into place. 30 seconds. No tools. No waste.",
    detail:
      "Uppers are sold at a fraction of the full shoe price — roughly 30–40% of buying a whole new pair.",
  },
  {
    num: "03",
    title: "Less Spend. Less Waste.",
    desc: "Instead of buying a whole new pair every season, you're buying only what actually changes. Better for your wallet. Better for the planet.",
    detail:
      "With TESSCH, you buy 1 sole and swap uppers each season — saving ~60% of total spend and eliminating 75% of material waste.",
  },
  {
    num: "04",
    title: "Community Designs",
    desc: "Community members propose upper designs. The most-hyped ones get produced. You vote on drops. We build what the culture actually wants.",
    detail:
      "Every month we open a design brief. Top 3 go to community vote. The winner goes into production.",
  },
];

const FAQ = [
  {
    q: "How hard is it to swap the upper?",
    a: "30 seconds. Grip the upper at the heel, pull up and away. The new one clicks in from toe to heel. No tools, no glue.",
  },
  {
    q: "Will the upper stay on during wear?",
    a: "Yes. The connection uses an interlocking rail system with friction clips. Tested for 500+ swaps and running, jumping, and lateral movement.",
  },
  {
    q: "Are uppers from different drops compatible?",
    a: "Yes. All TESSCH uppers use the same universal sole interface. Every upper ever made by TESSCH fits every sole ever made.",
  },
  {
    q: "What happens when the sole wears out?",
    a: "We'll have a sole replacement program. Send in your worn sole, pay a fraction of a new pair, get a fresh one. Your uppers transfer over.",
  },
  {
    q: "Can I buy just the sole first?",
    a: "Yes. The sole is sold as a standalone. We recommend pairing it with the Acid Void colorway to start.",
  },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ══ PAGE HEADER ═══════════════════════════════════════ */}
      <section className="pt-36 pb-16 px-6 md:px-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%,rgba(198,255,0,0.04),transparent 55%)",
          }}
        />
        <SectionLabel>The Modular System</SectionLabel>
        <h1
          className="font-display reveal"
          style={{
            fontSize: "clamp(56px,8vw,110px)",
            lineHeight: 0.92,
            letterSpacing: "-1px",
          }}
        >
          <span className="text-chrome block">ONE</span>
          <span className="stroke-text block">SOLE</span>
          <span className="text-acid block">INFINITE.</span>
        </h1>
        <p className="text-[15px] text-muted leading-[1.78] mt-6 max-w-[480px] reveal">
          The idea is simple. The execution took 18 months. Here is exactly how
          it works.
        </p>
      </section>

      {/* ══ INTERACTIVE DEMO ══════════════════════════════════ */}
      <section
        className="px-6 md:px-12 py-20"
        style={{
          background:
            "radial-gradient(ellipse at 50%,rgba(198,255,0,0.025),transparent 70%)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="h-[420px] md:h-[500px] border border-white/[0.05] relative overflow-hidden reveal">
            <ModularCanvas step={activeStep} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[2px] uppercase text-acid/50 whitespace-nowrap pointer-events-none">
              Click a step → watch the upper swap live
            </div>
          </div>

          <div className="flex flex-col gap-0 reveal">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`modular-step px-6 py-5 ${activeStep === i ? "active" : ""}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="step-num">{s.num}</div>
                <div className="font-display text-[22px] tracking-wide text-chrome mb-1.5">
                  {s.title}
                </div>
                <div className="text-[13px] text-muted leading-relaxed mb-2">
                  {s.desc}
                </div>
                {activeStep === i && (
                  <div className="mt-3 pt-3 border-t border-acid/20">
                    <p className="text-[12px] text-chrome/70 leading-relaxed">
                      {s.detail}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NUMBERS ═══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <SectionLabel>By the Numbers</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 mt-8">
          {[
            { stat: "30s", label: "Upper swap time", sub: "No tools needed" },
            { stat: "~40%", label: "Cost vs full new pair", sub: "Per upper" },
            { stat: "500+", label: "Swap cycles tested", sub: "Zero failures" },
            { stat: "75%", label: "Less material waste", sub: "Per season" },
          ].map(({ stat, label, sub }) => (
            <div
              key={label}
              className="border border-white/[0.06] bg-white/[0.02] p-6 hover:border-acid/20 transition-colors reveal"
            >
              <div className="font-display text-[52px] text-acid leading-none mb-2">
                {stat}
              </div>
              <div className="font-mono text-[9px] tracking-[2px] uppercase text-chrome mb-1">
                {label}
              </div>
              <div className="font-mono text-[9px] text-muted">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ANATOMY ═══════════════════════════════════════════ */}
      <section
        className="px-6 md:px-12 py-20 border-t border-white/[0.05]"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%,rgba(255,61,0,0.04),transparent 60%)",
        }}
      >
        <SectionLabel>Anatomy of a TESSCH</SectionLabel>
        <h2
          className="font-display mb-12 reveal"
          style={{ fontSize: "clamp(36px,4.5vw,60px)", lineHeight: 1 }}
        >
          WHAT YOU&apos;RE
          <br />
          <span className="text-acid">ACTUALLY BUYING</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {[
            {
              label: "THE SOLE UNIT",
              borderCls: "border-acid/30",
              bgCls: "bg-acid/[0.03]",
              titleCls: "text-acid",
              dotCls: "bg-acid",
              price: "₹12,000 — ₹16,000",
              badge: "Buy once",
              items: [
                "Full-length EVA midsole — engineered cushioning",
                "Rubber outsole with multi-directional grip",
                "Magnetic rail interface system",
                "Internal reinforcement frame",
                "Lasts 3–5 years of regular wear",
              ],
            },
            {
              label: "THE UPPER",
              borderCls: "border-fire/25",
              bgCls: "bg-fire/[0.03]",
              titleCls: "text-fire",
              dotCls: "bg-fire",
              price: "₹5,000 — ₹8,000",
              badge: "Swap seasonally",
              items: [
                "Choice of carbon mesh, knit, leather, or synthetic",
                "Colour-matched laces included",
                "Click-lock heel mechanism pre-installed",
                "Toe-cap reinforcement",
                "New drops every season",
              ],
            },
          ].map(
            ({
              label,
              borderCls,
              bgCls,
              titleCls,
              dotCls,
              price,
              badge,
              items,
            }) => (
              <div
                key={label}
                className={`border p-8 reveal ${borderCls} ${bgCls}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`font-mono text-[9px] tracking-[3px] uppercase ${titleCls}`}
                  >
                    {label}
                  </div>
                  <div className="font-mono text-[9px] tracking-[2px] uppercase bg-void border border-white/[0.08] px-2 py-1 text-muted">
                    {badge}
                  </div>
                </div>
                <div
                  className={`font-display text-[36px] ${titleCls} leading-none mb-6`}
                >
                  {price}
                </div>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[13px] text-chrome/80 leading-relaxed"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${dotCls}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <SectionLabel>Questions</SectionLabel>
        <h2
          className="font-display mb-10 reveal"
          style={{ fontSize: "clamp(36px,4.5vw,60px)", lineHeight: 1 }}
        >
          FAQ
        </h2>
        <div className="flex flex-col gap-0 max-w-[720px]">
          {FAQ.map(({ q, a }, i) => (
            <div key={i} className="border-b border-white/[0.06]">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left cursor-none bg-transparent border-0 group"
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center border border-acid/30 text-acid font-mono text-xs transition-all duration-300 ${
                    openFaq === i
                      ? "bg-acid text-void rotate-90"
                      : "bg-transparent"
                  }`}
                >
                  {openFaq === i ? "—" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="pb-5">
                  <p className="text-[13px] text-muted leading-[1.75]">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-acid/[0.08] text-center">
        <h2
          className="font-display mb-4"
          style={{ fontSize: "clamp(36px,4.5vw,60px)", lineHeight: 1 }}
        >
          READY TO
          <br />
          <span className="text-acid">SWAP?</span>
        </h2>
        <p className="text-[14px] text-muted mb-8 max-w-[400px] mx-auto leading-relaxed">
          Pick your sole. Choose your first upper. Change your style whenever
          you want.
        </p>
        <Link
          href="/products"
          className="clip-btn bg-acid text-void font-mono text-[11px] font-bold tracking-[2px] uppercase px-10 py-4 no-underline cursor-none hover:bg-white transition-colors inline-block"
        >
          Browse the Range →
        </Link>
      </section>
    </>
  );
}
