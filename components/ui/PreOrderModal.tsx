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

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center bg-void/95 backdrop-blur-2xl"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      
      <div className="relative bg-[#0d0520] border border-acid/20 w-[92vw] max-w-[520px] max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-5 font-mono text-xl text-muted hover:text-acid bg-transparent border-0 cursor-none transition-colors z-10">×</button>
        
        <div className="p-8 md:p-10">
          {step === 'choose' && (
            <>
              <p className="font-mono text-[9px] tracking-[3px] uppercase text-muted mb-1">Drop 001 — Pre-Order</p>
              <h2 className="font-display text-[38px] tracking-wide mb-7">PICK YOUR PAIR</h2>
              
              <div className="flex flex-col gap-2 mb-6">
                {PRODUCTS.map((p) => (
                  <button key={p.id} onClick={() => setProduct(p)}
                    className={`flex items-center gap-4 p-4 border text-left cursor-none transition-all ${product.id === p.id ? 'border-acid bg-acid/5' : 'border-white/[0.06] hover:border-white/20 bg-transparent'}`}>
                    
                    {/* Technical ID replace Emoji */}
                    <span className="font-mono text-[10px] w-12 flex-shrink-0 text-center opacity-40">
                       [{p.id.toString().padStart(2, '0')}]
                    </span>

                    <div className="flex-1">
                      <div className="font-display text-xl tracking-wide">{p.name}</div>
                      <div className="font-mono text-[9px] tracking-[2px] uppercase text-fire mt-0.5">{p.tag}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-base font-bold text-acid">₹{p.price.toLocaleString('en-IN')}</div>
                      <div className="font-mono text-[10px] text-muted line-through">₹{p.og.toLocaleString('en-IN')}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-7">
                <p className="font-mono text-[9px] tracking-[3px] uppercase text-muted mb-3">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`size-chip ${size === s ? 'active' : ''}`}>{s}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep('form')}
                className="clip-btn w-full bg-acid text-void font-mono text-[11px] font-bold tracking-[2px] uppercase py-4 border-0 cursor-none hover:bg-white transition-colors">
                Continue — {product.name} / {size}
              </button>
            </>
          )}

          {step === 'form' && (
            <form onSubmit={handlePay}>
              <button type="button" onClick={() => setStep('choose')}
                className="font-mono text-[9px] tracking-[2px] uppercase text-muted hover:text-acid bg-transparent border-0 cursor-none transition-colors flex items-center gap-2 mb-6">
                ← Back
              </button>

              {/* Order Summary Box */}
              <div className="flex items-center gap-6 bg-acid/[0.04] border border-acid/[0.12] p-5 mb-6">
                <div className="w-12 h-12 flex items-center justify-center border border-acid/20 bg-acid/5">
                   <span className="font-mono text-[10px] text-acid">[{product.id.toString().padStart(2, '0')}]</span>
                </div>
                <div>
                  <div className="font-display text-xl tracking-wide uppercase">{product.name}</div>
                  <div className="font-mono text-[9px] tracking-[2px] uppercase text-muted">Size: {size}</div>
                  <div className="font-mono text-base font-bold text-acid mt-1">₹{product.price.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <p className="font-mono text-[9px] tracking-[3px] uppercase text-muted mb-1">Your Details</p>
              <h2 className="font-display text-[32px] tracking-wider mb-5">CHECKOUT</h2>
              
              <div className="flex flex-col gap-3 mb-5">
                {(['name', 'email', 'phone', 'city'] as const).map((key) => {
                  const labels: any = { name: 'Full Name', email: 'Email', phone: 'Phone', city: 'Delivery City' }
                  const placeholders: any = { name: 'Arjun Kumar', email: 'arjun@mail.com', phone: '+91 98765 43210', city: 'Mumbai, Maharashtra' }
                  return (
                    <div key={key}>
                      <label className="block font-mono text-[9px] tracking-[2px] uppercase text-muted mb-1.5">
                        {labels[key]}{key !== 'city' && <span className="text-fire ml-1">*</span>}
                      </label>
                      <input 
                        type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} 
                        placeholder={placeholders[key]} 
                        required={key !== 'city'}
                        value={form[key]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="w-full bg-white/[0.04] border border-white/[0.10] text-chrome font-mono text-[11px] px-4 py-3 outline-none focus:border-acid transition-colors placeholder:text-muted" 
                      />
                    </div>
                  )
                })}
              </div>

              <button type="submit" disabled={loading}
                className="clip-btn w-full bg-acid text-void font-mono text-[11px] font-bold tracking-[2px] uppercase py-4 border-0 cursor-none hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-60">
                {loading ? (
                  <><span className="w-3 h-3 border border-void border-t-transparent rounded-full animate-spin" />Processing...</>
                ) : <>Complete Pre-Order →</>}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-acid/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-acid text-2xl">✓</span>
              </div>
              <p className="font-mono text-[9px] tracking-[3px] uppercase text-acid mb-2">Order Confirmed</p>
              <h2 className="font-display text-[40px] tracking-wider mb-3 uppercase">YOU&apos;RE IN.</h2>
              
              <div className="bg-acid/[0.04] border border-acid/[0.15] p-5 mb-7 text-left">
                <p className="font-mono text-[9px] tracking-[3px] uppercase text-muted mb-4">Transmission Receipt</p>
                {[
                  { label: 'Order ID', value: '#' + orderId, hi: true },
                  { label: 'Model',    value: product.name,    hi: false },
                  { label: 'Size',     value: size,            hi: false },
                  { label: 'Recipient', value: form.name,       hi: false },
                ].map(({ label, value, hi }) => (
                  <div key={label} className="flex justify-between font-mono text-[11px] mb-2">
                    <span className="text-muted">{label}</span>
                    <span className={hi ? 'text-acid font-bold' : 'text-chrome uppercase'}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-mono text-[11px] border-t border-white/[0.06] pt-2 mt-2">
                  <span className="text-muted">Total Paid</span>
                  <span className="text-acid font-bold text-sm">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button onClick={onClose}
                className="clip-btn bg-acid text-void font-mono text-[10px] font-bold tracking-[2px] uppercase px-10 py-3 border-0 cursor-none hover:bg-white transition-colors">
                Back to Site
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}