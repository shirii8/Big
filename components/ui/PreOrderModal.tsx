'use client'

import { useState, useEffect } from 'react'
import { PRODUCTS, SIZES, type Product } from '@/lib/data'

interface Props {
  open: boolean
  onClose: () => void
  initialProduct?: Product | null
}

type Step = 'choose' | 'form' | 'success'

export default function PreOrderModal({ open, onClose, initialProduct }: Props) {
  const [step, setStep] = useState<Step>('choose')
  const [product, setProduct] = useState<Product>(initialProduct ?? PRODUCTS[0])
  const [size, setSize] = useState('UK 9')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '' })

  useEffect(() => {
    if (open) { 
      setStep('choose')
      setLoading(false)
      if (initialProduct) setProduct(initialProduct) 
    }
  }, [open, initialProduct])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) return
    setLoading(true)
    setTimeout(() => { 
      setOrderId('TS-' + Date.now().toString().slice(-6))
      setStep('success')
      setLoading(false) 
    }, 1800)
  }

  // Safe price conversion to prevent toLocaleString errors
  const getPrice = (p: any) => Number(p.price || 1499);
  const getOgPrice = (p: any) => Number(p.og || getPrice(p) + 500);

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      
      <div className="relative bg-[#0d0520] border border-[#d4604d]/20 w-[92vw] max-w-[520px] max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-5 font-mono text-xl text-white/40 hover:text-[#d4604d] transition-colors z-10">×</button>
        
        <div className="p-8 md:p-10">
          {step === 'choose' && (
            <>
              <p className="font-mono text-[9px] tracking-[3px] uppercase text-white/40 mb-1">Drop 001 — Pre-Order</p>
              <h2 className="font-display text-[38px] tracking-wide mb-7 text-white">PICK YOUR PAIR</h2>
              
              <div className="flex flex-col gap-2 mb-6">
                {PRODUCTS.map((p: any) => (
                  <button key={p.id} onClick={() => setProduct(p)}
                    className={`flex items-center gap-4 p-4 border text-left transition-all ${product.id === p.id ? 'border-[#d4604d] bg-[#d4604d]/5' : 'border-white/[0.06] hover:border-white/20'}`}>
                    
                    <span className="font-mono text-[10px] w-12 shrink-0 text-center opacity-40 text-white">
                       [{String(p.id).padStart(2, '0')}]
                    </span>

                    <div className="flex-1">
                      <div className="font-display text-xl tracking-wide text-white">{p.name}</div>
                      {/* Fixed: Use Category if Tag is missing */}
                      <div className="font-mono text-[9px] tracking-[2px] uppercase text-[#d4604d] mt-0.5">{p.tag || p.category}</div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className="font-mono text-base font-bold text-[#d4604d]">₹{getPrice(p).toLocaleString('en-IN')}</div>
                      <div className="font-mono text-[10px] text-white/20 line-through">₹{getOgPrice(p).toLocaleString('en-IN')}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-7">
                <p className="font-mono text-[9px] tracking-[3px] uppercase text-white/40 mb-3">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => setSize(s)} 
                      className={`font-mono text-[10px] px-3 py-1 border transition-all ${size === s ? 'bg-[#d4604d] border-[#d4604d] text-white' : 'border-white/10 text-white/40'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep('form')}
                className="w-full bg-[#d4604d] text-white font-mono text-[11px] font-bold tracking-[2px] uppercase py-4 hover:bg-white hover:text-black transition-colors">
                Continue — {product.name} / {size}
              </button>
            </>
          )}

          {step === 'form' && (
            <form onSubmit={handlePay}>
              <button type="button" onClick={() => setStep('choose')}
                className="font-mono text-[9px] tracking-[2px] uppercase text-white/40 hover:text-[#d4604d] flex items-center gap-2 mb-6">
                ← Back
              </button>

              <div className="flex items-center gap-6 bg-[#d4604d]/5 border border-[#d4604d]/20 p-5 mb-6">
                <div className="w-12 h-12 flex items-center justify-center border border-[#d4604d]/20">
                   <span className="font-mono text-[10px] text-[#d4604d]">[{String(product.id).padStart(2, '0')}]</span>
                </div>
                <div>
                  <div className="font-display text-xl tracking-wide uppercase text-white">{product.name}</div>
                  <div className="font-mono text-[9px] tracking-[2px] uppercase text-white/40">Size: {size}</div>
                  <div className="font-mono text-base font-bold text-[#d4604d] mt-1">₹{getPrice(product).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <p className="font-mono text-[9px] tracking-[3px] uppercase text-white/40 mb-1">Your Details</p>
              <h2 className="font-display text-[32px] tracking-wider mb-5 text-white">CHECKOUT</h2>
              
              <div className="flex flex-col gap-3 mb-5">
                {(['name', 'email', 'phone', 'city'] as const).map((key) => {
                  const labels: Record<string, string> = { name: 'Full Name', email: 'Email', phone: 'Phone', city: 'Delivery City' }
                  return (
                    <div key={key}>
                      <label className="block font-mono text-[9px] tracking-[2px] uppercase text-white/40 mb-1.5">
                        {labels[key]}{key !== 'city' && <span className="text-[#d4604d] ml-1">*</span>}
                      </label>
                      <input 
                        type={key === 'email' ? 'email' : 'text'} 
                        required={key !== 'city'}
                        value={form[key]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="w-full bg-white/[0.04] border border-white/[0.10] text-white font-mono text-[11px] px-4 py-3 outline-none focus:border-[#d4604d] transition-colors" 
                      />
                    </div>
                  )
                })}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#d4604d] text-white font-mono text-[11px] font-bold tracking-[2px] uppercase py-4 disabled:opacity-50 transition-all">
                {loading ? 'Processing...' : `Complete Pre-Order →`}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#d4604d]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#d4604d] text-2xl">✓</span>
              </div>
              <p className="font-mono text-[9px] tracking-[3px] uppercase text-[#d4604d] mb-2">Order Confirmed</p>
              <h2 className="font-display text-[40px] tracking-wider mb-3 uppercase text-white">YOU&apos;RE IN.</h2>
              
              <div className="bg-[#d4604d]/5 border border-[#d4604d]/15 p-5 mb-7 text-left">
                {[
                  { label: 'Order ID', value: '#' + orderId },
                  { label: 'Model',    value: product.name },
                  { label: 'Size',     value: size },
                  { label: 'Recipient', value: form.name },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between font-mono text-[11px] mb-2">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white uppercase">{value}</span>
                  </div>
                ))}
              </div>

              <button onClick={onClose}
                className="bg-[#d4604d] text-white font-mono text-[10px] font-bold tracking-[2px] uppercase px-10 py-3 hover:bg-white hover:text-black transition-colors">
                Back to Site
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}