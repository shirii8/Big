'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import PreOrderModal from '@/components/ui/PreOrderModal'
import { COLORWAYS, REVIEWS, TICKER_ITEMS, MARQUEE_WORDS, DROP_DATE, type Product } from '@/lib/data'

const HeroCanvas = dynamic(() => import('@/components/3d/HeroCanvas'), { ssr: false })

function useCountdown(target: number) {
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
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return time
}

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const p    = Math.min((now - start) / 2000, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(ease * target))
      if (p < 1) requestAnimationFrame(tick)
      else setVal(target)
    }
    requestAnimationFrame(tick)
  }, [active, target])
  return val >= 1000 ? (val / 1000).toFixed(0) + 'K' : String(val)
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function HomePage() {
  const [modalOpen, setModalOpen]             = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [statsActive, setStatsActive]         = useState(false)
  const [notifyEmail, setNotifyEmail]         = useState('')
  const [notifyDone, setNotifyDone]           = useState(false)

  const statsRef  = useRef<HTMLDivElement>(null)
  const countdown = useCountdown(DROP_DATE)

  const c1 = useCounter(12000, statsActive)
  const c2 = useCounter(47,    statsActive)
  const c3 = useCounter(89000, statsActive)
  const c4 = useCounter(4200,  statsActive)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsActive(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const openModal = (p: Product | null = null) => {
    setSelectedProduct(p)
    setModalOpen(true)
  }

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault()
    if (notifyEmail.includes('@')) setNotifyDone(true)
  }

  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      <PreOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={selectedProduct}
      />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <HeroCanvas />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 72% 50%,rgba(198,255,0,0.045),transparent 55%)' }}
        />

        <div className="relative z-10 px-6 md:px-12 max-w-[680px]">
          {/* Drop badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-7 h-px bg-acid flex-shrink-0" />
            <span className="font-mono text-[10px] tracking-[3px] uppercase text-acid">
              Drop Zero — 2026
            </span>
            <span className="w-2 h-2 rounded-full bg-fire animate-livedot flex-shrink-0" />
            <span className="font-mono text-[9px] tracking-[2px] uppercase text-fire">Live</span>
          </div>

          {/* H1 */}
          <h1
            className="font-display leading-[0.88] mb-5 reveal"
            style={{ fontSize: 'clamp(72px,11vw,148px)', letterSpacing: '-1px' }}
          >
            <span className="text-chrome block">BREAK</span>
            <span className="stroke-text block">THE</span>
            <span className="text-acid block">GRID</span>
          </h1>

          <p className="text-[15px] text-muted leading-[1.78] mb-8 max-w-[400px] reveal">
            Keep the sole. <strong className="text-chrome">Swap the upper.</strong>
            <br />
            Physics-defying silhouettes. Smarter by design.
          </p>

          <div className="flex flex-wrap gap-3 reveal">
            <button
              onClick={() => openModal()}
              className="clip-btn bg-acid text-void font-mono text-[11px] font-bold tracking-[2px] uppercase px-8 py-4 border-0 cursor-none transition-all hover:bg-white hover:-translate-y-0.5"
            >
              Pre-Order Now
            </button>
            <Link
              href="/ar-view"
              className="font-mono text-[11px] tracking-[2px] uppercase text-chrome px-8 py-4 border border-white/[0.18] cursor-none hover:border-acid hover:text-acid transition-all no-underline flex items-center"
            >
              See in AR →
            </Link>
          </div>
        </div>

        {/* Drag hint desktop */}
        <div className="absolute right-6 md:right-12 bottom-36 z-10 text-right hidden md:block">
          <p className="font-mono text-[9px] tracking-[2px] uppercase text-muted mb-2">
            Drag to flick
          </p>
          <div className="w-14 h-14 border border-acid/30 rounded-full flex items-center justify-center ml-auto text-acid text-xl animate-pulsering">
            ↻
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div className="w-px h-11 bg-gradient-to-b from-acid to-transparent animate-scan" />
          <span className="font-mono text-[8px] tracking-[3px] uppercase text-muted">Scroll</span>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════ */}
      <div className="bg-acid overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
          {MARQUEE_WORDS.map((text, i) => (
            <span
              key={i}
              className="font-display text-[16px] tracking-[4px] text-void px-7 flex-shrink-0"
            >
              {text}
              {i % 8 !== 7 && <span className="text-fire mx-2">✦</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ═════════════════════════════════════════════ */}
      <div
        ref={statsRef}
        className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-acid/[0.08] bg-acid/[0.025]"
      >
        {[
          { val: c1, label: 'Pairs Pre-Ordered' },
          { val: c2, label: 'Countries Reached' },
          { val: c3, label: 'Community Members' },
          { val: c4, label: '5-Star Reviews' },
        ].map(({ val, label }, i) => (
          <div
            key={i}
            className={`px-6 md:px-8 py-10 ${i < 3 ? 'border-r border-acid/[0.08]' : ''}`}
          >
            <span
              className="font-display block text-acid"
              style={{ fontSize: 'clamp(48px,6vw,76px)', lineHeight: 1 }}
            >
              {val}
            </span>
            <span className="font-mono text-[9px] tracking-[2px] uppercase text-muted mt-2 block">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ══ COLORWAYS ═════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-24">
        <SectionLabel>Colorways</SectionLabel>
        <h2
          className="font-display mb-12 reveal"
          style={{ fontSize: 'clamp(44px,5.5vw,76px)', lineHeight: 1 }}
        >
          PICK YOUR
          <br />
          UNIVERSE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0.5">
          {COLORWAYS.map((cw, i) => (
            <div key={i} className="cw-card overflow-hidden cursor-none reveal">
              <div
                className="cw-swatch h-[180px] flex items-center justify-center font-display text-[40px] tracking-wide overflow-hidden"
                style={{ background: cw.bg, color: cw.text }}
              >
                {cw.name.split(' ')[0]}
              </div>
              <div className="px-4 py-3 bg-[rgba(10,4,30,0.9)] border-t border-white/[0.05]">
                <span
                  className="font-mono text-[9px] tracking-[2px] uppercase"
                  style={{ color: cw.text }}
                >
                  {cw.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ REVIEWS ═══════════════════════════════════════════ */}
      <section
        className="px-6 md:px-12 py-24"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%,rgba(198,255,0,0.02),transparent)',
        }}
      >
        <SectionLabel>The Culture</SectionLabel>
        <h2
          className="font-display mb-10 reveal"
          style={{ fontSize: 'clamp(44px,5.5vw,76px)', lineHeight: 1 }}
        >
          WHAT THE
          <br />
          WORLD SAYS
        </h2>

        {/* Live ticker */}
        <div className="flex items-center gap-5 border border-acid/[0.12] bg-white/[0.02] px-5 py-4 mb-12 overflow-hidden">
          <div className="flex items-center gap-2 font-mono text-[8px] tracking-[3px] uppercase text-fire font-bold flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-fire animate-livedot" />
            Live
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-10 whitespace-nowrap animate-ticker">
              {tickerDouble.map((item, i) => (
                <span key={i} className="font-mono text-[11px] text-chrome flex-shrink-0">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="bg-[rgba(10,4,30,0.9)] p-7 border border-white/[0.04] relative overflow-hidden hover:border-acid/20 transition-colors reveal"
            >
              <span className="absolute top-3 right-5 font-display text-[64px] text-acid opacity-[0.08] leading-none select-none">
                &ldquo;
              </span>
              <div className="text-acid text-[11px] tracking-[2px] mb-3">★★★★★</div>
              <p className="text-[13px] text-chrome leading-[1.72] mb-5">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-white/[0.06] pt-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-acid to-fire flex items-center justify-center font-bold text-void text-[11px] flex-shrink-0">
                  {r.init}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-chrome">{r.name}</div>
                  <div className="font-mono text-[9px] text-muted tracking-[1px]">
                    {r.loc} · {r.product}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MINI COUNTDOWN CTA ════════════════════════════════ */}
      <section
        className="px-6 md:px-12 py-20 border-t border-fire/[0.10] text-center"
        style={{
          background: 'linear-gradient(135deg,rgba(255,61,0,0.07),transparent 50%)',
        }}
      >
        <h2
          className="font-display mb-3 reveal"
          style={{ fontSize: 'clamp(36px,5vw,60px)' }}
        >
          DROP 001 IN{' '}
          <span className="text-fire">
            {pad(countdown.d)}D {pad(countdown.h)}H {pad(countdown.m)}M
          </span>
        </h2>
        <p className="font-mono text-[10px] tracking-[2px] text-muted mb-8">
          APRIL 04, 2026 — 12:00 IST
        </p>

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
              🔥 You&apos;re on the list.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/drop"
            className="clip-btn bg-acid text-void font-mono text-[11px] font-bold tracking-[2px] uppercase px-10 py-4 no-underline cursor-none hover:bg-white transition-colors inline-block"
          >
            See Drop 001 →
          </Link>
          <Link
            href="/products"
            className="border border-acid/25 text-acid font-mono text-[11px] tracking-[2px] uppercase px-8 py-4 no-underline cursor-none hover:bg-acid hover:text-void transition-all inline-block"
          >
            Browse Range
          </Link>
        </div>
      </section>

  {/* ══ INSTAGRAM STRIP ═══════════════════════════════════ */}
      <div className="border-t border-white/[0.05] px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-mono text-[9px] tracking-[3px] uppercase text-muted mb-1">
            Follow the Drop
          </p>
          <p className="font-display text-[28px] tracking-wide">@TESSCHSTORE</p>
        </div>
        
        <a
          href="https://instagram.com/tesschstore"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 border border-acid/25 text-acid font-mono text-[10px] tracking-[2px] uppercase px-7 py-3.5 hover:bg-acid hover:text-void transition-all cursor-none no-underline"
        >
          📷 Follow on Instagram
        </a>
      </div>
    </>
  )
}