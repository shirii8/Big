'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import SectionLabel from '@/components/ui/SectionLabel'

// ─── Types ────────────────────────────────────────────────────────────────────
type CartState = 'idle' | 'loading' | 'success' | 'error'

// ─── Sneaker quick-add config ─────────────────────────────────────────────────
// A sneaker = one upper + one sole bundled together.
// In the portal we expose a fast "quick-add" flow: pick size, hit add.
// The actual product IDs used here should match whatever default/featured
// sneaker bundle you want to promote from the portal (update as needed).
const FEATURED_SNEAKER = {
  productId: 'sneaker-featured-01',   // composite bundle ID in your DB
  name: 'STARTER BUILD',
  price: '₹14,900',
  description: 'Upper + Sole · Full pair · Ships in 5–7 days',
}

const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

// ─── Cart API helper ──────────────────────────────────────────────────────────
async function addToCart(productId: string, size: string, qty: number, productType: 'sneaker') {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, size, qty, productType }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? 'Failed to add to cart')
  }
  return res.json()
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPortal() {
  return (
    <div className="bg-[#e5f1ee] min-h-screen flex flex-col lg:flex-row pt-20 overflow-hidden text-[#17191d]">

      {/* ── LEFT: UPPERS PORTAL ── */}
      <Link href="/products/uppers" className="relative flex-1 group overflow-hidden border-r-2 border-[#17191d]/10">
        <motion.div
          initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="absolute inset-0 bg-[#d4604d] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        />
        <div className="relative z-10 h-full flex flex-col justify-center p-12 lg:p-20">
          <SectionLabel>Step 01</SectionLabel>
          <h2 className="font-display text-7xl lg:text-9xl uppercase tracking-tighter leading-none mb-6 group-hover:text-white transition-colors">
            THE <br/>UPPERS
          </h2>
          <p className="font-mono text-sm max-w-xs uppercase tracking-widest opacity-60 group-hover:text-white group-hover:opacity-90 transition-all">
            Browse 15 modular skins. Engineered for performance, aesthetics, and seasonal adaptation.
          </p>
          <div className="mt-12 w-12 h-12 border-2 border-[#17191d] group-hover:border-white flex items-center justify-center font-bold group-hover:text-white transition-all">
            →
          </div>
        </div>
        <div className="absolute bottom-[-5%] left-[-5%] font-display text-[20vw] opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">SKIN</div>
      </Link>

      {/* ── RIGHT: SNEAKER PORTAL ── */}
      <SneakerPortalPanel />
    </div>
  )
}

// ─── SneakerPortalPanel ───────────────────────────────────────────────────────
// Renders the right-side panel. Includes a quick size picker + Add to Cart
// so the user can grab a complete pair right from the portal landing page,
// or navigate deeper to the full sneaker builder.
function SneakerPortalPanel() {
  const [size, setSize] = useState('UK 9')
  const [showSizePicker, setShowSizePicker] = useState(false)
  const [cartState, setCartState] = useState<CartState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    // Prevent the parent <Link> from navigating when clicking the cart button
    e.preventDefault()
    e.stopPropagation()

    if (cartState === 'loading' || cartState === 'success') return
    setCartState('loading')
    setErrorMsg('')
    try {
      await addToCart(FEATURED_SNEAKER.productId, size, 1, 'sneaker')
      setCartState('success')
      setTimeout(() => setCartState('idle'), 2500)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setCartState('error')
      setTimeout(() => setCartState('idle'), 3000)
    }
  }, [cartState, size])

  const toggleSizePicker = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSizePicker(prev => !prev)
  }

  const selectSize = (e: React.MouseEvent, s: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSize(s)
  }

  const cartLabel = {
    idle:    `ADD TO CART — ${size}`,
    loading: 'ADDING...',
    success: 'ADDED TO CART ✓',
    error:   'RETRY',
  }[cartState]

  const cartBg = {
    idle:    'bg-[#e5f1ee] text-[#17191d] hover:bg-white',
    loading: 'bg-[#e5f1ee]/60 text-[#17191d]/60 cursor-wait',
    success: 'bg-emerald-500 text-white',
    error:   'bg-red-500 text-white hover:bg-red-600',
  }[cartState]

  return (
    <div className="relative flex-1 group overflow-hidden">
      {/* hover fill */}
      <motion.div
        initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="absolute inset-0 bg-[#17191d] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
      />

      <div className="relative z-10 h-full flex flex-col justify-between p-12 lg:p-20">
        {/* Top content */}
        <div>
          <SectionLabel>Step 02</SectionLabel>
          <Link href="/products/sneaker">
            <h2 className="font-display text-7xl lg:text-9xl uppercase tracking-tighter leading-none mb-6 group-hover:text-[#e5f1ee] transition-colors cursor-pointer">
              Starter<br/>Build
            </h2>
          </Link>
          <p className="font-mono text-sm max-w-xs uppercase tracking-widest opacity-60 group-hover:text-[#e5f1ee] group-hover:opacity-90 transition-all">
            The foundation. 15 high-performance base units featuring proprietary cushioning and traction logic.
          </p>
        </div>

        {/* Quick-add section — always visible, styles flip on hover */}
        <div className="mt-12 space-y-3">
          {/* Price + description */}
          <div className="group-hover:text-[#e5f1ee] transition-colors">
            <p className="font-display text-3xl">{FEATURED_SNEAKER.price}</p>
            <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-50 mt-1">{FEATURED_SNEAKER.description}</p>
          </div>

          {/* Size toggle */}
          <button
            onClick={toggleSizePicker}
            className="font-mono text-[10px] font-bold uppercase tracking-[2px] border-2 border-[#17191d] group-hover:border-[#e5f1ee] group-hover:text-[#e5f1ee] px-4 py-2 transition-all flex items-center gap-2"
          >
            SIZE: {size}
            <span className={`transition-transform ${showSizePicker ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {/* Size grid — slides open */}
          {showSizePicker && (
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={(e) => selectSize(e, s)}
                  className={`font-mono text-[10px] font-bold px-3 py-2 border-2 transition-all ${
                    size === s
                      ? 'bg-[#17191d] text-white border-[#17191d] group-hover:bg-[#e5f1ee] group-hover:text-[#17191d] group-hover:border-[#e5f1ee]'
                      : 'border-[#17191d]/40 group-hover:border-[#e5f1ee]/40 group-hover:text-[#e5f1ee]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {cartState === 'error' && errorMsg && (
            <p className="font-mono text-[10px] text-red-400 uppercase tracking-[1px]">⚠ {errorMsg}</p>
          )}

          {/* Action row */}
          <div className="flex items-center gap-3 pt-1">
            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={cartState === 'loading'}
              className={`font-mono text-[10px] font-bold uppercase tracking-[2px] px-6 py-3 border-2 border-transparent transition-all flex items-center gap-2 ${cartBg}`}
            >
              {cartState === 'loading' && (
                <span className="w-3 h-3 border-2 border-current/40 border-t-current rounded-full animate-spin" />
              )}
              {cartLabel}
            </button>

            {/* Navigate deeper */}
            <Link
              href="/products/sneaker"
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 border-2 border-[#17191d] group-hover:border-[#e5f1ee] flex items-center justify-center font-bold group-hover:text-[#e5f1ee] transition-all hover:scale-105"
            >
              →
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative watermark */}
      <div className="absolute top-[-5%] right-[-5%] font-display text-[20vw] opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">BASE</div>
    </div>
  )
}