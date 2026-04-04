'use client'

import { useState, useMemo, useEffect, memo } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import Link from 'next/link'
import SectionLabel from '@/components/ui/SectionLabel'

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const UPPERS_DATA: Upper[] = [
  { id: "u-001", name: "NEON VAPOR", category: "Performance", price: "₹6,400", priceNum: 6400, description: "High-breathability engineered knit designed for peak aerobic output.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151261/WhatsApp_Image_2026-04-01_at_02.28.39_1_bqptrs.jpg", specs: { Weight: "120g", Flex: "High", Material: "E-Knit" } },
  { id: "u-002", name: "CARBON SHIELD", category: "Tactical", price: "₹8,200", priceNum: 8200, description: "Reinforced ripstop nylon with waterproof TPU membrane.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151261/WhatsApp_Image_2026-04-01_at_02.28.39_yrd7i8.jpg", specs: { Weight: "180g", Flex: "Mid", Material: "Ripstop" } },
  { id: "u-003", name: "ARCTIC MINT", category: "Lifestyle", price: "₹5,900", priceNum: 5900, description: "Suede-textured synthetic upper with minimalist aesthetic.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.39_2_nbdalk.jpg", specs: { Weight: "150g", Flex: "Max", Material: "S-Suede" } },
  { id: "u-004", name: "DESERT PHANTOM", category: "Tactical", price: "₹7,100", priceNum: 7100, description: "Sand-blasted textile finish with reinforced eyelets.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.40_kgvxv4.jpg", specs: { Weight: "165g", Flex: "Low", Material: "Canvas" } },
  { id: "u-005", name: "ONYX GRID", category: "Performance", price: "₹6,800", priceNum: 6800, description: "Compression-fit upper for lateral stability.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.41_trc3nv.jpg", specs: { Weight: "135g", Flex: "High", Material: "Grid-Silk" } },
  { id: "u-006", name: "COBALT CORE", category: "Lifestyle", price: "₹5,500", priceNum: 5500, description: "Essential modular upper in deep cobalt.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.40_2_k1xiwk.jpg", specs: { Weight: "145g", Flex: "Max", Material: "Poly-Knit" } },
  { id: "u-007", name: "LAVA SHELL", category: "Performance", price: "₹7,900", priceNum: 7900, description: "Heat-reactive panels that change color.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151259/WhatsApp_Image_2026-04-01_at_02.28.41_2_ekqxok.jpg", specs: { Weight: "125g", Flex: "High", Material: "Thermo-K" } },
  { id: "u-008", name: "IRON MESH", category: "Tactical", price: "₹8,500", priceNum: 8500, description: "Metallic-infused fibers for extreme durability.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151259/WhatsApp_Image_2026-04-01_at_02.28.41_1_qc3d2i.jpg", specs: { Weight: "195g", Flex: "Low", Material: "Meta-Mesh" } },
  { id: "u-009", name: "GHOST WHITE", category: "Lifestyle", price: "₹6,200", priceNum: 6200, description: "Triple-white aesthetic with easy-clean coating.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.42_3_rchhdv.jpg", specs: { Weight: "140g", Flex: "Mid", Material: "Nano-Syn" } },
  { id: "u-010", name: "FOREST TRACKER", category: "Tactical", price: "₹7,400", priceNum: 7400, description: "Earth-toned silhouette with extra ankle padding.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.43_1_fvxhqe.jpg", specs: { Weight: "170g", Flex: "Mid", Material: "Cordura" } },
  { id: "u-011", name: "CYBER PULSE", category: "Performance", price: "₹8,800", priceNum: 8800, description: "Integrated LED piping that syncs with your pace.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.42_mhygsi.jpg", specs: { Weight: "155g", Flex: "High", Material: "Optic-Fiber" } },
  { id: "u-012", name: "VINTAGE SLAB", category: "Lifestyle", price: "₹5,200", priceNum: 5200, description: "Retro-inspired paneling with modern modular rails.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.42_1_byhuzb.jpg", specs: { Weight: "160g", Flex: "Max", Material: "Leather/Mesh" } },
  { id: "u-013", name: "NIGHT RAID", category: "Tactical", price: "₹9,200", priceNum: 9200, description: "Stealth-black upper with light-absorbing finish.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151258/WhatsApp_Image_2026-04-01_at_02.28.43_uggnck.jpg", specs: { Weight: "185g", Flex: "Low", Material: "Matte-Skin" } },
  { id: "u-014", name: "ZENITH BLUE", category: "Performance", price: "₹6,900", priceNum: 6900, description: "Weightless sensation upper with industrial rail locking.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151261/WhatsApp_Image_2026-04-01_at_02.28.39_yrd7i8.jpg", specs: { Weight: "110g", Flex: "Max", Material: "Silk-Nit" } },
  { id: "u-015", name: "STORM BREAKER", category: "Tactical", price: "₹8,400", priceNum: 8400, description: "Windproof and snow-resistant modular archive.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151260/WhatsApp_Image_2026-04-01_at_02.28.39_2_nbdalk.jpg", specs: { Weight: "210g", Flex: "Low", Material: "Gore-S" } },
]

const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

export default function UppersPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedProduct = useMemo(() => UPPERS_DATA.find(p => p.id === selectedId) ?? null, [selectedId])

  useEffect(() => {
    document.body.style.overflow = selectedId ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedId])

  const ROWS = useMemo(() => [
    UPPERS_DATA.slice(0, 5),
    UPPERS_DATA.slice(5, 10),
    UPPERS_DATA.slice(10, 15),
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
          <ProductDetail 
            product={selectedProduct} 
            onClose={() => setSelectedId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ArchiveRow({ items, onSelect, reverse }: { items: Upper[], onSelect: (id: string) => void, reverse: boolean }) {
  const [isPaused, setIsPaused] = useState(false)
  const controls = useAnimationControls()
  const tripled = useMemo(() => [...items, ...items, ...items], [items])
  const scrollDistance = (items.length * 520) + (items.length * 40)

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: reverse ? [0, -scrollDistance] : [-scrollDistance, 0],
        transition: { duration: 40, repeat: Infinity, ease: "linear" }
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
        style={{ width: "max-content", touchAction: "none" }}
      >
        {tripled.map((product, i) => (
          <ProductCard key={`${product.id}-${i}`} product={product} onSelect={onSelect} />
        ))}
      </motion.div>
    </div>
  )
}

const ProductCard = memo(({ product, onSelect }: { product: Upper, onSelect: (id: string) => void }) => (
  <div onClick={() => onSelect(product.id)} className="w-[480px] md:w-[520px] h-[240px] bg-white border-[3px] border-[#17191d] group flex flex-row overflow-hidden hover:shadow-[12px_12px_0px_#d4604d] transition-shadow duration-300 cursor-pointer shrink-0">
    <div className="w-[52%] h-full bg-[#f8fcfb] relative overflow-hidden border-r-[3px] border-[#17191d]">
      <img src={product.image} className="w-full h-full object-contain mix-blend-multiply scale-105 group-hover:scale-115 transition-transform duration-500 ease-out" alt="" />
    </div>
    <div className="w-[48%] h-full p-6 flex flex-col justify-between bg-white group-hover:bg-[#d4604d]/5 transition-colors">
      <div>
        <p className="font-mono text-[9px] text-[#d4604d] font-bold uppercase tracking-[2px] mb-2">{product.category}</p>
        <h3 className="font-display text-2xl md:text-3xl uppercase leading-[0.88] tracking-tighter whitespace-normal">{product.name}</h3>
      </div>
      <div className="flex justify-between items-end">
        <p className="font-display text-2xl text-[#17191d]">{product.price}</p>
        <span className="font-mono text-[10px] font-bold text-[#d4604d] border-b border-[#d4604d] pb-0.5">VIEW DETAIL</span>
      </div>
    </div>
  </div>
))
ProductCard.displayName = "ProductCard"

function ProductDetail({ product, onClose }: { product: Upper, onClose: () => void }) {
  const [size, setSize] = useState('UK 9')
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[1000] bg-[#17191d]/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-x-20 md:inset-y-12 z-[1001] bg-[#e5f1ee] border-4 border-[#17191d] shadow-[20px_20px_0px_#17191d] flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[52%] h-[40%] md:h-full bg-white flex items-center justify-center p-10 border-b-4 md:border-b-0 md:border-r-4 border-[#17191d]">
          <img src={product.image} className="max-h-full w-auto object-contain mix-blend-multiply" alt="" />
        </div>
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] bg-[#d4604d] text-white px-3 py-1 uppercase font-bold">{product.category}</span>
              <button onClick={onClose} className="text-2xl font-bold hover:text-[#d4604d] transition-colors">✕</button>
            </div>
            <h2 className="font-display text-6xl leading-[0.82] uppercase tracking-tighter">{product.name}</h2>
            <div className="grid grid-cols-3 gap-4 border-t-2 border-[#17191d] pt-6">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k}><p className="font-mono text-[9px] uppercase opacity-40 mb-1">{k}</p><p className="font-display text-xl uppercase leading-tight">{v as string}</p></div>
              ))}
            </div>
            <div className="border-t-2 border-[#17191d] pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)} className={`font-mono text-[10px] font-bold px-4 py-2 border-2 transition-all ${size === s ? 'bg-[#17191d] text-white border-[#17191d]' : 'border-[#17191d]/30 hover:border-[#17191d]'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t-2 border-[#17191d] flex items-center justify-between mt-4">
            <div>
               <p className="font-mono text-[9px] uppercase opacity-40">Unit Price</p>
               <p className="font-display text-4xl">{product.price}</p>
            </div>
            
            <Link 
              href="/products/soles" 
              className="bg-[#17191d] text-white font-mono text-[11px] font-bold uppercase tracking-[3px] px-10 py-5 hover:bg-[#d4604d] transition-colors flex items-center gap-3 group"
            >
              CHOOSE SOLE UNIT 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  )
}