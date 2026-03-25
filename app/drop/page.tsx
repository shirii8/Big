'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import PreOrderModal from '@/components/ui/PreOrderModal'
import { PRODUCTS, SIZES, DROP_DATE, type Product } from '@/lib/data'

const ProductCanvas = dynamic(() => import('@/components/3d/ProductCanvas'), { ssr: false })

function useCountdown(target: number) {
  // 1. Start with 0s to match Server-Side HTML
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    
    // 2. Only run the calculation on the client
    tick() 
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  
  return time
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function DropPage() {
  const [modalOpen, setModalOpen]             = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [notifyEmail, setNotifyEmail]         = useState('')
  const [notifyDone, setNotifyDone]           = useState(false)
  const [selectedSizes, setSelectedSizes]     = useState<Record<number, string>>({})

  const countdown = useCountdown(DROP_DATE)

  const openModal = (p: Product | null = null) => {
    setSelectedProduct(p)
    setModalOpen(true)
  }

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault()
    if (notifyEmail.includes('@')) setNotifyDone(true)
  }

  return (
    <>
      <PreOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={selectedProduct}
      />

      {/* ══ HERO COUNTDOWN ════════════════════════════════════ */}
      <section
        className="pt-32 pb-20 px-6 md:px-12 text-center relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(255,61,0,0.08),transparent 60%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(198,255,0,0.03),transparent 50%)' }}
        />

        <div className="flex items-center justify-center gap-3 font-mono text-[10px] tracking-[4px] uppercase text-fire mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-fire animate-livedot" />
          <span>Drop 001 — Limited Global Release</span>
          <span className="w-1.5 h-1.5 rounded-full bg-fire animate-livedot" />
        </div>

        <h1
          className="font-display reveal"
          style={{ fontSize: 'clamp(64px,10vw,130px)', lineHeight: 0.9, letterSpacing: '-1px' }}
        >
          <span className="text-chrome block">DROP</span>
          <span className="stroke-acid block">001</span>
          <span className="text-fire block">INCOMING</span>
        </h1>

        <p className="font-mono text-[10px] tracking-[3px] text-muted mt-6 mb-14">
          APRIL 04, 2026 — 12:00 IST — GLOBAL SIMULTANEOUS DROP
        </p>

        {/* Countdown timer */}
        <div className="flex items-center justify-center gap-1 md:gap-2 mb-16 flex-wrap">
          {[
            { val: pad(countdown.d), label: 'Days' },
            null,
            { val: pad(countdown.h), label: 'Hours' },
            null,
            { val: pad(countdown.m), label: 'Mins' },
            null,
            { val: pad(countdown.s), label: 'Secs' },
          ].map((item, i) =>
            item === null ? (
              <div
                key={i}
                className="font-display text-[40px] md:text-[60px] text-muted/40 leading-none px-1"
              >
                :
              </div>
            ) : (
              <div
                key={i}
                className="flex flex-col items-center px-4 md:px-8 py-5 md:py-7 bg-white/[0.03] border border-white/[0.06] min-w-[72px] md:min-w-[120px]"
              >
                <span
                  className="font-display text-acid leading-none"
                  style={{ fontSize: 'clamp(36px,7vw,72px)' }}
                >
                  {item.val}
                </span>
                <span className="font-mono text-[8px] tracking-[3px] uppercase text-muted mt-2">
                  {item.label}
                </span>
              </div>
            )
          )}
        </div>

        {/* Notify */}
        {!notifyDone ? (
          <form onSubmit={handleNotify} className="flex max-w-[440px] mx-auto mb-8">
            <input
              type="email"
              placeholder="your@email.com"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 bg-white/[0.04] border border-white/[0.12] border-r-0 text-chrome font-mono text-[11px] px-5 py-3.5 outline-none focus:border-acid transition-colors placeholder:text-muted"
            />
            <button
              type="submit"
              className="bg-acid text-void font-mono text-[10px] font-bold tracking-[2px] uppercase px-5 py-3.5 border-0 cursor-none hover:bg-white transition-colors whitespace-nowrap"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div className="max-w-[440px] mx-auto mb-8 border border-acid/25 bg-acid/[0.05] px-6 py-4">
            <p className="font-mono text-[11px] tracking-[1px] text-acid">
              🔥 You&apos;re on the list. We&apos;ll hit you 1hr before Drop 001.
            </p>
          </div>
        )}

        <button
          onClick={() => openModal()}
          className="clip-btn bg-acid text-void font-mono text-[12px] font-bold tracking-[2px] uppercase px-10 py-4 border-0 cursor-none hover:bg-white transition-colors inline-block"
        >
          Pre-Order &amp; Guarantee Your Pair →
        </button>
      </section>

      {/* ══ WHAT'S DROPPING ═══════════════════════════════════ */}
      <section className="px-6 md:px-12 py-24 border-t border-white/[0.05]">
        <SectionLabel>What&apos;s Dropping</SectionLabel>
        <h2
          className="font-display mb-14 reveal"
          style={{ fontSize: 'clamp(44px,5.5vw,72px)', lineHeight: 1 }}
        >
          3 SILHOUETTES.
          <br />
          <span className="text-acid">100 PAIRS EACH.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="acid-card bg-[rgba(10,4,30,0.9)] overflow-hidden reveal">
              <div
                className="h-[280px] relative"
                style={{ background: 'radial-gradient(ellipse at center,rgba(198,255,0,0.04),transparent 70%)' }}
              >
                <ProductCanvas baseColor={p.base} accentColor={p.accent} />
                <div
                  className={`absolute top-3 right-3 font-mono text-[8px] tracking-[2px] uppercase px-2 py-1 pointer-events-none bg-void/85 border border-current ${p.tagClass}`}
                >
                  {p.tag}
                </div>
                <div className="absolute top-3 left-3 font-mono text-[8px] tracking-[2px] uppercase bg-void/85 border border-acid/25 px-2 py-1 text-acid pointer-events-none">
                  Drag · 360°
                </div>
              </div>

              <div className="p-5">
                <div className="font-display text-[24px] tracking-wide mb-1">{p.name}</div>
                <div className="text-[12px] text-muted mb-4">{p.sub}</div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSizes((prev) => ({ ...prev, [p.id]: s }))}
                      className={`size-chip ${selectedSizes[p.id] === s ? 'active' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-acid text-[18px]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <s className="text-muted text-[11px] font-normal ml-2">
                      ₹{p.og.toLocaleString('en-IN')}
                    </s>
                  </div>
                  <button
                    onClick={() => openModal(p)}
                    className="clip-btn bg-acid text-void font-mono text-[9px] font-bold tracking-[2px] uppercase px-4 py-2.5 border-0 cursor-none hover:bg-white transition-colors"
                  >
                    Pre-Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Progress Bar for Stock Levels */}
<div className="mt-4 mb-2">
  <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider mb-1">
    <span className="text-muted">Stock Level</span>
    <span className="text-acid">Low — 84% Sold</span>
  </div>
  <div className="w-full h-[2px] bg-white/5 overflow-hidden">
    <div 
      className="h-full bg-fire transition-all duration-1000 ease-out" 
      style={{ width: '84%' }} 
    />
  </div>
</div>
      </section>

      {/* ══ DROP DETAILS ══════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <SectionLabel>Drop Rules</SectionLabel>
            <h2
              className="font-display mb-8 reveal"
              style={{ fontSize: 'clamp(32px,4vw,52px)', lineHeight: 1 }}
            >
              HOW THE DROP
              <br />
              <span className="text-acid">WORKS</span>
            </h2>
            <div className="flex flex-col gap-4">
              {[
                "Pre-orders open now and lock your pair at today's price.",
                'Full payment confirmed on April 4, 2026 at 12:00 IST.',
                'Only 100 pairs per silhouette. First come, first shipped.',
                'Shipping begins April 10. India-first. International by May.',
                'Each pair ships with one upper. Extra uppers sold separately.',
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="font-display text-[24px] text-acid/40 leading-none flex-shrink-0 w-8">
                    0{i + 1}
                  </span>
                  <p className="text-[14px] text-chrome/80 leading-[1.7]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Shipping &amp; Returns</SectionLabel>
            <h2
              className="font-display mb-8 reveal"
              style={{ fontSize: 'clamp(32px,4vw,52px)', lineHeight: 1 }}
            >
              LOGISTICS
              <br />
              <span className="text-acid">DETAILS</span>
            </h2>
            <div className="flex flex-col gap-4">
              {[
                { icon: '📦', label: 'Free shipping',    desc: 'Free express shipping on all Drop 001 orders. No minimum.' },
                { icon: '⚡', label: '3–5 day delivery', desc: 'All India delivery in 3–5 business days post-April 10.' },
                { icon: '🔄', label: '30-day returns',   desc: "Full refund within 30 days if you're not satisfied. No questions." },
                { icon: '🌍', label: 'International',    desc: 'International shipping from May 2026. DM @tesschstore to join the priority list.' },
              ].map(({ icon, label, desc }) => (
                <div
                  key={label}
                  className="flex gap-4 items-start p-4 border border-white/[0.06] hover:border-acid/20 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div>
                    <div className="font-mono text-[9px] tracking-[2px] uppercase text-acid mb-1">
                      {label}
                    </div>
                    <div className="text-[13px] text-muted leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════ */}
      <section
        className="px-6 md:px-12 py-24 text-center border-t border-acid/[0.08]"
        style={{ background: 'radial-gradient(ellipse at 50%,rgba(198,255,0,0.03),transparent 60%)' }}
      >
        <p className="font-mono text-[10px] tracking-[4px] uppercase text-muted mb-4">
          100 pairs per silhouette. No restock.
        </p>
        <h2
          className="font-display mb-8"
          style={{ fontSize: 'clamp(44px,6vw,80px)', lineHeight: 1 }}
        >
          DON&apos;T MISS
          <br />
          <span className="text-acid">YOUR PAIR</span>
        </h2>
        <button
          onClick={() => openModal()}
          className="clip-btn bg-acid text-void font-mono text-[12px] font-bold tracking-[2px] uppercase px-12 py-5 border-0 cursor-none hover:bg-white transition-colors"
        >
          Secure Your Pre-Order Now →
        </button>
      </section>
    </>
  )
}