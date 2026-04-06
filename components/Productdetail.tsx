'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Layers, Package } from 'lucide-react'
import { useCart, ItemType } from '@/context/CartContext'
import Link from 'next/link'

// Paste this INSIDE uppers/page.tsx replacing the existing ProductDetail function

const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

// Default sole bundled with every full build
const DEFAULT_SOLE = {
  id: 's-001',
  name: 'CLOUD RUNNER',
  price: 3200,
  image: 'https://res.cloudinary.com/dttnc62hp/image/upload/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.43_1_fvxhqe.jpg',
  type: 'Cushion',
}

interface Upper {
  id: string
  name: string
  category: string
  price: string
  priceNum: number
  description: string
  image: string
  specs: Record<string, string>
}

export function ProductDetail({ product, onClose }: { product: Upper; onClose: () => void }) {
  const [size, setSize] = useState('UK 9')
  const [itemType, setItemType] = useState<ItemType>('build')
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  function handleAddToCart() {
    addItem({
      id: `${product.id}-${size}-${Date.now()}`,
      type: itemType,
      upper: {
        id: product.id,
        name: product.name,
        price: product.priceNum,
        image: product.image,
        category: product.category,
      },
      sole: itemType === 'build' ? DEFAULT_SOLE : undefined,
      size,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const totalPrice = itemType === 'build'
    ? product.priceNum + DEFAULT_SOLE.price
    : product.priceNum

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[1000] bg-[#17191d]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 md:inset-x-20 md:inset-y-12 z-[1001] bg-[#e5f1ee] border-4 border-[#17191d] shadow-[20px_20px_0px_#17191d] flex flex-col md:flex-row overflow-hidden"
      >
        {/* Image */}
        <div className="w-full md:w-[52%] h-[40%] md:h-full bg-white flex items-center justify-center p-10 border-b-4 md:border-b-0 md:border-r-4 border-[#17191d]">
          <img src={product.image} className="max-h-full w-auto object-contain mix-blend-multiply" alt="" />
        </div>

        {/* Detail */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] bg-[#d4604d] text-white px-3 py-1 uppercase font-bold">{product.category}</span>
              <button onClick={onClose} className="text-2xl font-bold hover:text-[#d4604d] transition-colors">✕</button>
            </div>

            <h2 className="font-display text-6xl leading-[0.82] uppercase tracking-tighter">{product.name}</h2>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-4 border-t-2 border-[#17191d] pt-6">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono text-[9px] uppercase opacity-40 mb-1">{k}</p>
                  <p className="font-display text-xl uppercase leading-tight">{v as string}</p>
                </div>
              ))}
            </div>

            {/* Build type toggle */}
            <div className="border-t-2 border-[#17191d] pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-3">Build Configuration</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setItemType('build')}
                  className={`flex items-center gap-2 font-mono text-[9px] font-bold uppercase px-4 py-2.5 border-2 transition-all ${itemType === 'build' ? 'bg-[#17191d] text-white border-[#17191d]' : 'border-[#17191d]/30 hover:border-[#17191d]'}`}
                >
                  <Layers size={10} /> Full Build
                </button>
                <button
                  onClick={() => setItemType('upper-only')}
                  className={`flex items-center gap-2 font-mono text-[9px] font-bold uppercase px-4 py-2.5 border-2 transition-all ${itemType === 'upper-only' ? 'bg-[#17191d] text-white border-[#17191d]' : 'border-[#17191d]/30 hover:border-[#17191d]'}`}
                >
                  <Package size={10} /> Upper Only
                </button>
              </div>

              {/* Upsell if upper-only */}
              {itemType === 'upper-only' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 bg-[#d4604d]/10 border border-[#d4604d] px-4 py-3">
                  <p className="font-mono text-[9px] text-[#d4604d] font-bold uppercase leading-relaxed">
                    ⚠ Missing out on the SOLE — Full Build pairs this with a high-performance base unit for a complete modular setup. You save on separate checkout too.
                  </p>
                  <Link href="/products/soles" className="font-mono text-[9px] underline text-[#d4604d] mt-1 inline-block hover:no-underline">
                    Browse Base Units →
                  </Link>
                </motion.div>
              )}

              {/* Sole preview if build */}
              {itemType === 'build' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 flex items-center gap-3 bg-[#17191d]/5 border border-[#17191d]/10 px-4 py-3">
                  <img src={DEFAULT_SOLE.image} alt="" className="w-10 h-10 object-contain mix-blend-multiply" />
                  <div className="flex-1">
                    <p className="font-mono text-[8px] uppercase tracking-[2px] opacity-40">Included Base Unit</p>
                    <p className="font-mono text-[10px] font-bold uppercase">{DEFAULT_SOLE.name}</p>
                  </div>
                  <Link href="/products/soles" className="font-mono text-[9px] text-[#d4604d] border-b border-[#d4604d] uppercase hover:opacity-70 transition-opacity">Change →</Link>
                </motion.div>
              )}
            </div>

            {/* Size */}
            <div className="border-t-2 border-[#17191d] pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`font-mono text-[10px] font-bold px-4 py-2 border-2 transition-all ${size === s ? 'bg-[#17191d] text-white border-[#17191d]' : 'border-[#17191d]/30 hover:border-[#17191d]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-6 border-t-2 border-[#17191d] flex items-center justify-between mt-4">
            <div>
              <p className="font-mono text-[9px] uppercase opacity-40">{itemType === 'build' ? 'Build Price' : 'Upper Price'}</p>
              <p className="font-display text-4xl">₹{totalPrice.toLocaleString('en-IN')}</p>
              {itemType === 'build' && (
                <p className="font-mono text-[8px] opacity-40 mt-0.5">Upper ₹{product.priceNum.toLocaleString('en-IN')} + Sole ₹{DEFAULT_SOLE.price.toLocaleString('en-IN')}</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[3px] px-10 py-5 transition-colors ${added ? 'bg-green-600 text-white' : 'bg-[#17191d] text-white hover:bg-[#d4604d]'}`}
            >
              <ShoppingCart size={14} />
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}