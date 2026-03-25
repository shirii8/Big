'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import PreOrderModal from '@/components/ui/PreOrderModal'
import { TIMELINE } from '@/lib/data'

const ARCanvas = dynamic(() => import('@/components/3d/ARCanvas'), { ssr: false })

const VALUES = [
  { icon: '🔄', title: 'Modular by Design',  desc: 'Every product is built around swappability. The sole is your investment. The upper is your expression.' },
  { icon: '🌱', title: 'Less Waste',           desc: 'Fashion is one of the most wasteful industries on earth. Modular design is a direct attack on that model.' },
  { icon: '🤝', title: 'Community First',      desc: 'Brand decisions are made with the community, not for it. Upper designs are voted on. Colorways proposed by members.' },
  { icon: '❓', title: 'Question Defaults',    desc: "We exist because two people refused to accept 'this is how it's always been done' as a good enough reason." },
]

const FOUNDERS = [
  {
    name: 'Mihir Mandloi',
    role: 'Co-Founder',
    init: 'MM',
    handle: '@mihirmandloi',
    desc: "Questions everything. Builds anyway. The kind of founder who bootstraps ₹2L for 1.5 years because he's too convicted to wait for permission. Mihir obsesses over product-market fit and is allergic to unvalidated assumptions.",
  },
  {
    name: 'Pratham Shah',
    role: 'Co-Founder',
    init: 'PS',
    handle: '@prathamshah',
    desc: "Obsessed with product. Thinks in systems. Believes the best ideas are the obvious ones nobody bothered to execute properly. Pratham drives the engineering behind the modular mechanism and community architecture.",
  },
]

export default function AboutPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <PreOrderModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="min-h-[75vh] flex flex-col justify-end px-6 md:px-12 pb-20 pt-36 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 60%,rgba(198,255,0,0.04),transparent 55%)' }}
        />
        <SectionLabel>Our Story</SectionLabel>
        <h1
          className="font-display reveal"
          style={{ fontSize: 'clamp(56px,9vw,120px)', lineHeight: 0.92, letterSpacing: '-1px' }}
        >
          <span className="text-chrome block">THE INDUSTRY</span>
          <span className="stroke-text block">ISN&apos;T</span>
          <span className="text-acid block">BROKEN.</span>
        </h1>
        <p className="text-[16px] text-muted leading-[1.8] max-w-[540px] mt-6 reveal">
          It&apos;s working exactly as designed —{' '}
          <strong className="text-chrome">against you.</strong>
          <br />
          So we&apos;re building something different.
        </p>
      </section>

      {/* ══ THE PROBLEM ═══════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[4px] uppercase text-fire mb-5">
              <span>— The Problem</span>
              <span className="flex-1 h-px bg-fire/20" />
            </div>
            <h2
              className="font-display mb-7 reveal"
              style={{ fontSize: 'clamp(36px,4.5vw,58px)', lineHeight: 1 }}
            >
              HERE&apos;S WHAT
              <br />
              WE NOTICED
            </h2>
            <div className="flex flex-col gap-5">
              {[
                "People don't throw away shoes because they're broken — they replace them because they want something fresh.",
                'The only option? Buying a whole new pair every time.',
                "It's expensive. It's exhausting. The cycle felt fundamentally broken.",
                "So we're building TESSCH — community first, brand second.",
              ].map((text, i) => (
                <div key={i} className="flex gap-4 reveal">
                  <span className="w-1.5 h-1.5 rounded-full bg-fire flex-shrink-0 mt-[10px]" />
                  <p className="text-[15px] text-chrome leading-[1.75]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[rgba(10,4,30,0.7)] border border-fire/15 p-8 md:p-10 reveal">
            <p
              className="font-display leading-[1.05] text-chrome mb-6"
              style={{ fontSize: 'clamp(26px,3.2vw,44px)' }}
            >
              &ldquo;A PLACE FOR PEOPLE WHO LIKE QUESTIONING DEFAULTS, MAKING SMARTER
              CHOICES, AND NOT SETTLING FOR THE SAME RECYCLED OPTIONS.&rdquo;
            </p>
            <p className="text-[13px] text-muted leading-[1.75]">
              The product follows that thinking: modular sneakers. You keep the sole,
              swap the upper. Same foundation, new style. Less waste. Less spend.
            </p>
          </div>
        </div>
      </section>

      {/* ══ THE PRODUCT ═══════════════════════════════════════ */}
      <section
        className="px-6 md:px-12 py-20"
        style={{ background: 'radial-gradient(ellipse at 70% 50%,rgba(198,255,0,0.03),transparent 60%)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="h-[380px] md:h-[440px] border border-white/[0.06] relative overflow-hidden order-2 md:order-1 reveal">
            <ARCanvas baseColor={0x0d0020} accentColor={0xC6FF00} />
            <div className="absolute top-3 left-3 font-mono text-[8px] tracking-[2px] uppercase bg-void/85 border border-acid/25 px-2 py-1 text-acid pointer-events-none">
              Drag to rotate
            </div>
          </div>

          <div className="order-1 md:order-2 reveal">
            <SectionLabel>The Product</SectionLabel>
            <h2
              className="font-display mb-6"
              style={{ fontSize: 'clamp(36px,4.5vw,58px)', lineHeight: 1 }}
            >
              MODULAR
              <br />
              <span className="text-acid">SNEAKERS</span>
            </h2>
            <p className="text-[15px] text-chrome leading-[1.78] mb-4">
              You keep the sole. You swap the upper. Same foundation. New style.
              Less waste. Less spend.
            </p>
            <p className="text-[14px] text-muted leading-[1.78] mb-8">
              We&apos;ve been working on this for 1.5 years — bootstrapped on ₹2 lakhs
              slowly and steadily. That&apos;s why it took time. But it also forced us to
              validate every assumption. We have working samples, and the reaction has
              been instant.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🔩', stat: '30s',  label: 'Upper swap time' },
                { icon: '💰', stat: '~40%', label: 'Cost vs new pair' },
                { icon: '♻️', stat: '0',     label: 'Full pairs wasted' },
                { icon: '🎨', stat: '∞',     label: 'Style combinations' },
              ].map(({ icon, stat, label }) => (
                <div
                  key={label}
                  className="border border-white/[0.06] bg-white/[0.02] px-4 py-5 hover:border-acid/20 transition-colors"
                >
                  <div className="text-xl mb-2">{icon}</div>
                  <div className="font-display text-[28px] text-acid leading-none mb-1">{stat}</div>
                  <div className="font-mono text-[9px] tracking-[1px] uppercase text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <SectionLabel>The Journey</SectionLabel>
        <h2
          className="font-display mb-14 reveal"
          style={{ fontSize: 'clamp(36px,4.5vw,58px)', lineHeight: 1 }}
        >
          1.5 YEARS.
          <br />
          <span className="text-acid">₹2 LAKHS.</span>
          <br />
          ONE BET.
        </h2>

        <div className="relative max-w-[900px]">
          <div className="absolute left-[9px] md:left-1/2 top-0 bottom-0 w-px bg-acid/12" />
          <div className="flex flex-col">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className={`relative flex gap-8 pl-10 md:pl-0 pb-12 reveal ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <div className="font-mono text-[9px] tracking-[3px] uppercase text-acid mb-1">
                    {item.year}
                  </div>
                  <div className="font-display text-[22px] tracking-wide text-chrome mb-2">
                    {item.label}
                  </div>
                  <p className="text-[13px] text-muted leading-[1.7] max-w-[340px] md:ml-auto">
                    {item.desc}
                  </p>
                </div>
                <div className="absolute left-[5px] md:left-1/2 md:-translate-x-1/2 w-[9px] h-[9px] rounded-full bg-acid border-2 border-void mt-1 flex-shrink-0 z-10" />
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOUNDERS ══════════════════════════════════════════ */}
      <section
        className="px-6 md:px-12 py-20"
        style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(198,255,0,0.025),transparent 60%)' }}
      >
        <SectionLabel>The Founders</SectionLabel>
        <h2
          className="font-display mb-12 reveal"
          style={{ fontSize: 'clamp(36px,4.5vw,58px)', lineHeight: 1 }}
        >
          BUILT BY
          <br />
          <span className="text-acid">BELIEVERS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 max-w-[860px]">
          {FOUNDERS.map((f) => (
            <div
              key={f.name}
              className="bg-[rgba(10,4,30,0.85)] border border-white/[0.06] p-8 hover:border-acid/20 transition-colors reveal"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-acid to-fire flex items-center justify-center font-bold text-void text-[16px] flex-shrink-0">
                  {f.init}
                </div>
                <div>
                  <div className="font-display text-[22px] tracking-wide text-chrome">{f.name}</div>
                  <div className="font-mono text-[9px] tracking-[2px] uppercase text-acid mt-0.5">
                    {f.role}
                  </div>
                </div>
              </div>
              <p className="text-[14px] text-muted leading-[1.75] mb-4">{f.desc}</p>
              
              <a 
                href="https://instagram.com/tesschstore"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] tracking-[2px] text-muted hover:text-acid transition-colors no-underline cursor-none"
              >
                {f.handle} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ══ VALUES ════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <SectionLabel>What We Stand For</SectionLabel>
        <h2
          className="font-display mb-12 reveal"
          style={{ fontSize: 'clamp(36px,4.5vw,58px)', lineHeight: 1 }}
        >
          THE PRINCIPLES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0.5">
          {VALUES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[rgba(10,4,30,0.7)] border border-white/[0.05] p-6 hover:border-acid/20 transition-colors reveal"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <div className="font-display text-[20px] tracking-wide text-chrome mb-2">{title}</div>
              <p className="text-[13px] text-muted leading-[1.65]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ INVESTOR CTA ══════════════════════════════════════ */}
      <section
        className="px-6 md:px-12 py-24 border-t border-fire/[0.10] text-center"
        style={{ background: 'linear-gradient(135deg,rgba(255,61,0,0.07) 0%,transparent 50%)' }}
      >
        <div className="flex items-center justify-center gap-3 font-mono text-[10px] tracking-[4px] uppercase text-fire mb-4">
          <span>— For Investors</span>
        </div>
        <h2
          className="font-display mb-4 reveal"
          style={{ fontSize: 'clamp(40px,5.5vw,70px)', lineHeight: 1 }}
        >
          WE&apos;RE RAISING
          <br />
          <span className="text-acid">₹1 CRORE</span>
        </h2>
        <p className="text-[15px] text-muted leading-[1.8] max-w-[520px] mx-auto mb-3">
          Pre-seed round. Taking TESSCH from working sample to market. Building for
          the youth who want smarter, not just cheaper.
        </p>
        <p className="font-mono text-[11px] tracking-[2px] text-muted mb-10">
          Last week we went public on Instagram. Not even showing the product yet —
          just the identity, just the mindset. And people are already locked in.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="mailto:hello@tessch.in"
            className="clip-btn bg-acid text-void font-mono text-[11px] font-bold tracking-[2px] uppercase px-10 py-4 border-0 cursor-none hover:bg-white transition-colors no-underline inline-block"
          >
            Talk to Mihir &amp; Pratham →
          </a>
          <button
            onClick={() => setModalOpen(true)}
            className="border border-acid/25 text-acid font-mono text-[11px] tracking-[2px] uppercase px-8 py-4 bg-transparent cursor-none hover:bg-acid hover:text-void transition-all"
          >
            Pre-Order a Pair
          </button>
        </div>
        <p className="font-mono text-[9px] tracking-[2px] text-muted mt-8 flex items-center justify-center gap-2">
          <span>📷</span> Follow the journey: @tesschstore on Instagram
        </p>
      </section>

      {/* ══ CLOSING QUOTE ═════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 border-t border-white/[0.05]">
        <blockquote className="max-w-[820px] mx-auto text-center reveal">
          <p
            className="font-display leading-[1.08] mb-6"
            style={{ fontSize: 'clamp(24px,3.5vw,46px)' }}
          >
            &ldquo;THE SNEAKER INDUSTRY ISN&apos;T BROKEN. IT&apos;S WORKING EXACTLY AS
            DESIGNED —<span className="text-acid"> AGAINST YOU.&rdquo;</span>
          </p>
          <cite className="font-mono text-[10px] tracking-[3px] uppercase text-muted not-italic">
            — Mihir Mandloi &amp; Pratham Shah, Co-Founders, TESSCH
          </cite>
        </blockquote>
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