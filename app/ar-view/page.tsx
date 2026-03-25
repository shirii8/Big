'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import { COLORWAYS, PRODUCTS } from '@/lib/data'

const ARCanvas = dynamic(() => import('@/components/3d/ARCanvas'), { ssr: false })

const PALETTE_COLORS = [
  { base: 0x0d0020, accent: 0xC6FF00 },
  { base: 0x1a0a00, accent: 0xFF3D00 },
  { base: 0x1a1a30, accent: 0xE8E8FF },
  { base: 0x1a0a2e, accent: 0xCE93D8 },
  { base: 0x001a2e, accent: 0x00E5FF },
]

export default function ARViewPage() {
  const [activePalette, setActivePalette] = useState(0)
  const [activeProduct, setActiveProduct] = useState(0)

  const handleARLaunch = () => {
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && 'xr' in navigator) {
        alert('Launching WebXR AR — Point your camera at a flat surface.\nFull WebXR ships with Drop 001.')
      } else if (isMobile) {
        alert('Your browser supports AR QuickLook. Initializing 3D placement...')
      } else {
        alert('AR viewer: Visit tessch.in/ar on your phone.\nDesktop only supports 360° Preview.')
      }
    }
  }

  return (
    <>
      {/* ══ PAGE HEADER ═══════════════════════════════════════ */}
      <section className="pt-36 pb-12 px-6 md:px-12 relative overflow-hidden z-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 40%,rgba(255,61,0,0.05),transparent 55%)' }}
        />
        <SectionLabel>Spatial Commerce</SectionLabel>
        <h1
          className="font-display reveal"
          style={{ fontSize: 'clamp(56px,8vw,110px)', lineHeight: 0.92, letterSpacing: '-1px' }}
        >
          <span className="text-chrome block">SEE IT IN</span>
          <span className="stroke-text block">YOUR</span>
          <span className="text-acid block">SPACE</span>
        </h1>
        <p className="text-[15px] text-muted leading-[1.78] mt-6 max-w-[480px] reveal">
          Before you commit, place any TESSCH silhouette in your actual room. No app.
          No download. Just your camera.
        </p>
      </section>

      {/* ══ MAIN AR VIEWER ════════════════════════════════════ */}
      <section className="px-6 md:px-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* Sticky canvas container */}
          <div className="md:sticky md:top-32 h-fit">
            <div
              className="relative border border-white/[0.06] bg-void/50 overflow-hidden min-h-[400px] md:h-[520px]"
            >
              <ARCanvas
                baseColor={PALETTE_COLORS[activePalette].base}
                accentColor={PALETTE_COLORS[activePalette].accent}
              />
              <div className="absolute top-4 right-4 bg-fire text-white font-mono text-[8px] tracking-[2px] uppercase px-3 py-1.5 font-bold flex items-center gap-2 pointer-events-none z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-livedot" />
                AR Ready
              </div>
              <div className="absolute bottom-4 left-0 w-full text-center font-mono text-[9px] tracking-[2px] uppercase text-chrome/40 whitespace-nowrap pointer-events-none z-20">
                Drag to rotate · See in your space
              </div>
            </div>

            {/* Colorway picker */}
            <div className="mt-6 p-4 border border-white/[0.03] bg-white/[0.01]">
              <p className="font-mono text-[9px] tracking-[3px] uppercase text-muted mb-4">
                Switch Colorway
              </p>
              <div className="flex gap-3">
                {COLORWAYS.map((cw, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePalette(i)}
                    className={`w-10 h-10 border-2 transition-all cursor-none flex-shrink-0 relative ${
                      activePalette === i
                        ? 'border-acid scale-110'
                        : 'border-transparent hover:border-white/30'
                    }`}
                    style={{ background: cw.bg }}
                  >
                    {activePalette === i && (
                      <span className="absolute inset-0 border border-void scale-90" />
                    )}
                  </button>
                ))}
              </div>
              <p className="font-mono text-[10px] tracking-[2px] uppercase text-acid mt-3">
                {COLORWAYS[activePalette].name}
              </p>
            </div>
          </div>

          {/* Controls & Details */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="font-mono text-[9px] tracking-[3px] uppercase text-muted mb-4">
                Select Silhouette
              </p>
              <div className="flex flex-col gap-2">
                {PRODUCTS.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProduct(i)}
                    className={`flex items-center justify-between px-6 py-4 border text-left cursor-none transition-all ${
                      activeProduct === i
                        ? 'border-acid bg-acid/5'
                        : 'border-white/[0.06] hover:border-white/20 bg-transparent'
                    }`}
                  >
                    <div>
                      <div className="font-display text-[20px] tracking-wide">{p.name}</div>
                      <div className="font-mono text-[9px] tracking-[1px] text-muted mt-0.5 uppercase">
                        {p.sub}
                      </div>
                    </div>
                    <div className="font-mono text-base font-bold text-acid">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: '📱', label: 'Instant Web AR',      desc: "No download needed. Works in Safari and Chrome. Tap once and your floor becomes a runway." },
                { icon: '🔄', label: '360° Full Rotation',  desc: 'Drag to spin the shoe in any direction. See the sole, the heel, every angle.' },
                { icon: '💡', label: 'Real-time Lighting',   desc: "Responds to your room's actual ambient light. Shadows adapt in real time." },
                { icon: '📏', label: 'True Scale',           desc: 'Renders at real-world dimensions so you can judge fit and presence accurately.' },
              ].map(({ icon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 p-5 border border-white/[0.06] bg-white/[0.01] hover:border-acid/30 transition-colors"
                >
                  <span className="text-2xl w-10 flex-shrink-0 text-center">{icon}</span>
                  <div>
                    <div className="font-mono text-[9px] tracking-[2px] uppercase text-acid mb-1">
                      {label}
                    </div>
                    <div className="text-[13px] text-muted leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={handleARLaunch}
                className="flex items-center justify-center gap-3 border border-fire text-fire font-mono text-[11px] font-bold tracking-[2px] uppercase px-8 py-5 bg-transparent cursor-none hover:bg-fire hover:text-white transition-all w-full"
              >
                <span>📷</span> Launch AR in Your Room
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="font-mono text-[9px] text-muted uppercase tracking-[2px]">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              <Link
                href="/products"
                className="flex items-center justify-center border border-acid/25 text-acid font-mono text-[11px] font-bold tracking-[2px] uppercase px-8 py-5 no-underline cursor-none hover:bg-acid hover:text-void transition-all"
              >
                Pre-Order Without AR →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-24 border-t border-white/[0.05] relative z-10">
        <SectionLabel>How the AR Works</SectionLabel>
        <h2
          className="font-display mb-12 reveal"
          style={{ fontSize: 'clamp(36px,4.5vw,56px)', lineHeight: 1 }}
        >
          ZERO APPS.
          <br />
          <span className="text-acid">PURE CAMERA.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {[
            { step: '01', title: 'Tap the button',     desc: 'Hit "Launch AR" on your phone. Your browser requests camera access — tap Allow.' },
            { step: '02', title: 'Point at the floor', desc: 'Slowly pan across a flat surface. The system maps the plane using your phone depth sensors.' },
            { step: '03', title: 'Drop the shoe',      desc: 'Tap the screen to place the shoe. Walk around it. It stays anchored to your floor in real scale.' },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="border border-white/[0.06] bg-white/[0.02] p-8 hover:border-acid/20 transition-colors reveal"
            >
              <div className="font-display text-[52px] text-acid/20 leading-none mb-4">{step}</div>
              <div className="font-display text-[22px] tracking-wide text-chrome mb-2">{title}</div>
              <p className="text-[13px] text-muted leading-[1.75]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}