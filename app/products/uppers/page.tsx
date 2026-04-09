'use client'

import { useState, useMemo, useEffect, memo, useCallback } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SectionLabel from '@/components/ui/SectionLabel'
import { useCart } from '@/context/CartContext'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
// Importing from your lib/data as requested
import { PRODUCTS, type Product } from '@/lib/data'

// ─── Types ────────────────────────────────────────────────────────────────────
// Mapping internal Upper type to match your lib/data Product type
interface Upper extends Product {}

type CartState = 'idle' | 'loading' | 'success' | 'error'

const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

export default function UppersPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // Using imported PRODUCTS
  const selectedProduct = useMemo(
    () => PRODUCTS.find(p => p.id === selectedId) ?? null,
    [selectedId]
  )

  useEffect(() => {
    document.body.style.overflow = selectedId ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedId])

  // Split your 15 products into 3 scrolling rows
  const ROWS = useMemo(() => [
    PRODUCTS.slice(0, 5),
    PRODUCTS.slice(5, 10),
    PRODUCTS.slice(10, 15),
  ], [])

  return (
    <div className="bg-[#e5f1ee] min-h-screen w-full flex flex-col text-[#17191d]">
      <header className="pt-32 pb-12 px-6 md:px-12 shrink-0">
        <SectionLabel>Drop 01 / Modular Archive</SectionLabel>
        <div className="flex justify-between items-end mt-4 border-b-2 border-[#17191d]/10 pb-6">
          <h1 className="font-display text-[clamp(36px,6vw,80px)] leading-[0.85] tracking-tighter uppercase">
            SELECT YOUR <br/><span className="text-[#d4604d]">UPPER SKIN.</span>
          </h1>
          <div className="text-right hidden md:block">
            <p className="font-mono text-[10px] uppercase tracking-[3px] font-bold">Protocol_v.1.04</p>
            <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40">Hover to Pause & Drag</p>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-12 py-8 overflow-hidden mb-24">
        {ROWS.map((row, idx) => (
          <ArchiveRow key={idx} items={row} onSelect={setSelectedId} reverse={idx === 1} />
        ))}
      </main>

      <AnimatePresence>
        {selectedId && selectedProduct && (
          <ProductDetail product={selectedProduct} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── ArchiveRow ───────────────────────────────────────────────────────────────
function ArchiveRow({
  items, onSelect, reverse,
}: {
  items: Product[]
  onSelect: (id: string) => void
  reverse: boolean
}) {
  const [isPaused, setIsPaused] = useState(false)
  const controls = useAnimationControls()
  const tripled = useMemo(() => [...items, ...items, ...items], [items])
  const scrollDistance = items.length * 560

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: reverse ? [0, -scrollDistance] : [-scrollDistance, 0],
        transition: { duration: 40, repeat: Infinity, ease: 'linear' },
      })
    } else {
      controls.stop()
    }
  }, [isPaused, controls, reverse, scrollDistance])

  return (
    <div
      className="relative flex overflow-hidden h-[300px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        drag="x"
        animate={controls}
        dragConstraints={{ left: -scrollDistance * 2, right: 0 }}
        dragElastic={0.05}
        className="flex gap-10 px-12 h-full items-center cursor-grab active:cursor-grabbing"
        style={{ width: 'max-content', touchAction: 'none' }}
      >
        {tripled.map((product, i) => (
          <ProductCard key={`${product.id}-${i}`} product={product} onSelect={onSelect} />
        ))}
      </motion.div>
    </div>
  )
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard = memo(({
  product, onSelect,
}: {
  product: Product
  onSelect: (id: string) => void
}) => (
  <div
    onClick={() => onSelect(product.id)}
    className="w-[480px] md:w-[520px] h-[240px] bg-white border-[3px] border-[#17191d] group flex flex-row overflow-hidden hover:shadow-[12px_12px_0px_#d4604d] transition-shadow duration-300 cursor-pointer shrink-0"
  >
    <div className="w-[52%] h-full bg-[#f8fcfb] relative overflow-hidden border-r-[3px] border-[#17191d]">
      <img
        src={product.image}
        className="w-full h-full object-contain mix-blend-multiply scale-105 group-hover:scale-110 transition-transform duration-500 ease-out"
        alt={product.name}
      />
    </div>
    <div className="w-[48%] h-full p-6 flex flex-col justify-between bg-white group-hover:bg-[#d4604d]/5 transition-colors">
      <div>
        <p className="font-mono text-[9px] text-[#d4604d] font-bold uppercase tracking-[2px] mb-2">{product.category}</p>
        <h3 className="font-display text-2xl md:text-3xl uppercase leading-[0.88] tracking-tighter">{product.name}</h3>
      </div>
      <div className="flex justify-between items-end">
        <p className="font-display text-2xl">{product.price}</p>
        <span className="font-mono text-[10px] font-bold text-[#d4604d] border-b border-[#d4604d] pb-0.5">VIEW DETAIL</span>
      </div>
    </div>
  </div>
))
ProductCard.displayName = 'ProductCard'

// ─── ProductDetail ────────────────────────────────────────────────────────────
function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const [size, setSize] = useState('UK 9')
  const [cartState, setCartState] = useState<CartState>('idle')
  const { addItem } = useCart()
  const { isAuthenticated } = useKindeBrowserClient()
  const router = useRouter()

  useEffect(() => {
    setCartState('idle')
  }, [product.id])

  const handleAddToCart = useCallback(() => {
    if (cartState === 'loading' || cartState === 'success') return

    if (!isAuthenticated) {
      router.push('/api/auth/login')
      return
    }

    setCartState('loading')

    addItem(
      {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.priceNum,
        image: product.image,
      },
      size,
      'upper-only',
    )

    setCartState('success')
    setTimeout(() => setCartState('idle'), 2500)
  }, [cartState, product, size, addItem, isAuthenticated, router])

  const cartLabel: Record<CartState, string> = {
    idle:    'ADD UPPER TO CART',
    loading: 'ADDING...',
    success: 'ADDED ✓',
    error:   'RETRY',
  }

  const cartBg: Record<CartState, string> = {
    idle:    'bg-[#17191d] hover:bg-[#d4604d]',
    loading: 'bg-[#17191d]/60 cursor-wait',
    success: 'bg-emerald-600',
    error:   'bg-red-600 hover:bg-red-700',
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[1000] bg-[#17191d]/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 md:inset-x-20 md:inset-y-12 z-[1001] bg-[#e5f1ee] border-4 border-[#17191d] shadow-[20px_20px_0px_#17191d] flex flex-col md:flex-row overflow-hidden"
      >
        <div className="w-full md:w-[52%] h-[40%] md:h-full bg-white flex items-center justify-center p-10 border-b-4 md:border-b-0 md:border-r-4 border-[#17191d]">
          <img src={product.image} className="max-h-full w-auto object-contain mix-blend-multiply" alt={product.name} />
        </div>

        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] bg-[#d4604d] text-white px-3 py-1 uppercase font-bold">
                {product.category}
              </span>
              <button onClick={onClose} className="text-2xl font-bold hover:text-[#d4604d] transition-colors">✕</button>
            </div>

            <h2 className="font-display text-6xl leading-[0.82] uppercase tracking-tighter">{product.name}</h2>

            <div className="grid grid-cols-2 gap-4 border-t-2 border-[#17191d] pt-6">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono text-[9px] uppercase opacity-40 mb-1">{k}</p>
                  <p className="font-display text-lg uppercase leading-tight">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 px-4 py-3">
              <span className="text-amber-500 mt-0.5">⚠</span>
              <p className="font-mono text-[9px] text-amber-700 uppercase tracking-[1px] leading-relaxed">
                Upper only — sole not included. You can upgrade to a Full Build inside your cart to complete the pair and save on bundle pricing.
              </p>
            </div>

            <div className="border-t-2 border-[#17191d] pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`font-mono text-[10px] font-bold px-4 py-2 border-2 transition-all ${
                      size === s
                        ? 'bg-[#17191d] text-white border-[#17191d]'
                        : 'border-[#17191d]/30 hover:border-[#17191d]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-[#17191d] mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase opacity-40">Unit Price</p>
                <p className="font-display text-4xl">{product.price}</p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={cartState === 'loading'}
                className={`text-white font-mono text-[11px] font-bold uppercase tracking-[3px] px-8 py-4 transition-colors flex items-center gap-2 ${cartBg[cartState]}`}
              >
                {cartState === 'loading' && (
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {cartLabel[cartState]}
              </button>
            </div>

            <Link
              href="/products/sneaker"
              className="w-full bg-transparent border-2 border-[#17191d] text-[#17191d] font-mono text-[10px] font-bold uppercase tracking-[3px] px-6 py-3 hover:bg-[#17191d] hover:text-white transition-colors flex items-center justify-center gap-3 group"
            >
              OR BUILD COMPLETE PAIR — CHOOSE SOLE
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  )
}