'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Check, Tag, MapPin, CreditCard } from 'lucide-react'

const COUPONS: Record<string, { discount: number; label: string }> = {
  'TESSCH15': { discount: 0.15, label: '15% off — Early Adopter' },
  'DROP001':  { discount: 0.10, label: '10% off — Drop 001 Launch' },
  'FIRSTBUILD': { discount: 200, label: '₹200 off — First Build' },
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useKindeBrowserClient()
  const router = useRouter()

  const [step, setStep] = useState<'delivery' | 'payment' | 'confirm'>('delivery')
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; discount: number; label: string }>(null)
  const [couponError, setCouponError] = useState('')
  const [address, setAddress] = useState({ name: user?.given_name ?? '', phone: '', line1: '', line2: '', city: '', state: '', pin: '' })
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'cod'>('upi')
  const [ordered, setOrdered] = useState(false)

  const shipping = subtotal > 10000 ? 0 : 299
  const discountAmt = appliedCoupon
    ? typeof appliedCoupon.discount === 'number' && appliedCoupon.discount < 1
      ? Math.round(subtotal * appliedCoupon.discount)
      : appliedCoupon.discount
    : 0
  const total = subtotal + shipping - discountAmt

  function applyCoupon() {
    const c = COUPONS[coupon.toUpperCase()]
    if (!c) { setCouponError('Invalid code. Try TESSCH15, DROP001, or FIRSTBUILD'); return }
    setAppliedCoupon({ code: coupon.toUpperCase(), ...c })
    setCouponError('')
  }

  function placeOrder() {
    clearCart()
    setOrdered(true)
  }

  if (ordered) {
    return (
      <div className="min-h-screen bg-[#17191d] flex items-center justify-center px-6 text-[#e5f1ee]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-lg">
          <div className="w-20 h-20 bg-[#d4604d] rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={36} className="text-white" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] mb-4">Order Confirmed</p>
          <h1 className="font-display text-[clamp(48px,8vw,100px)] leading-none uppercase tracking-tighter mb-6">
            BUILD<br />LOCKED.
          </h1>
          <p className="font-mono text-[11px] opacity-60 uppercase tracking-[2px] mb-10">
            Your modular build is in the queue. Dispatch within 7–10 days.
          </p>
          <button onClick={() => router.push('/')} className="bg-[#d4604d] text-white font-mono text-[11px] font-bold uppercase tracking-[4px] px-12 py-5 hover:bg-white hover:text-[#17191d] transition-colors">
            Back to Home →
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e5f1ee] text-[#17191d] pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b-2 border-[#17191d] pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-2">Secure Checkout</p>
          <h1 className="font-display text-[clamp(36px,6vw,80px)] leading-none uppercase tracking-tighter">
            FINALISE<br /><span className="text-[#d4604d]">YOUR ORDER.</span>
          </h1>
        </div>

        {/* Step tabs */}
        <div className="flex gap-0 mb-12 border-2 border-[#17191d] overflow-hidden w-fit">
          {(['delivery', 'payment', 'confirm'] as const).map((s, i) => (
            <button
              key={s}
              onClick={() => step !== 'confirm' && setStep(s)}
              className={`font-mono text-[9px] uppercase tracking-[3px] px-6 py-3 font-bold border-r-2 border-[#17191d] last:border-r-0 transition-colors ${step === s ? 'bg-[#17191d] text-white' : 'hover:bg-[#17191d]/10'}`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div>
            <AnimatePresence mode="wait">
              {/* DELIVERY STEP */}
              {step === 'delivery' && (
                <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin size={16} className="text-[#d4604d]" />
                    <h2 className="font-display text-2xl uppercase">Delivery Address</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', key: 'name', placeholder: 'As on ID' },
                      { label: 'Phone', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
                      { label: 'Address Line 1', key: 'line1', placeholder: 'Building, Street' },
                      { label: 'Address Line 2', key: 'line2', placeholder: 'Area, Landmark (optional)' },
                      { label: 'City', key: 'city', placeholder: 'City' },
                      { label: 'State', key: 'state', placeholder: 'State' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className={key === 'line1' || key === 'line2' ? 'md:col-span-2' : ''}>
                        <label className="font-mono text-[9px] uppercase tracking-[3px] opacity-60 block mb-2">{label}</label>
                        <input
                          value={address[key as keyof typeof address]}
                          onChange={e => setAddress(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-white border-2 border-[#17191d] font-mono text-[11px] px-4 py-3 focus:outline-none focus:border-[#d4604d] transition-colors placeholder:opacity-30"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-[3px] opacity-60 block mb-2">PIN Code</label>
                      <input
                        value={address.pin}
                        onChange={e => setAddress(prev => ({ ...prev, pin: e.target.value }))}
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className="w-full bg-white border-2 border-[#17191d] font-mono text-[11px] px-4 py-3 focus:outline-none focus:border-[#d4604d] transition-colors placeholder:opacity-30"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className="bg-[#17191d] text-white font-mono text-[11px] font-bold uppercase tracking-[4px] py-5 px-12 w-fit hover:bg-[#d4604d] transition-colors mt-4"
                  >
                    Continue to Payment →
                  </button>
                </motion.div>
              )}

              {/* PAYMENT STEP */}
              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard size={16} className="text-[#d4604d]" />
                    <h2 className="font-display text-2xl uppercase">Payment Method</h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'upi', label: 'UPI', sub: 'GPay, PhonePe, Paytm, BHIM' },
                      { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                      { id: 'cod', label: 'Cash on Delivery', sub: '+₹49 handling fee' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setPayMethod(opt.id as any)}
                        className={`flex items-center gap-4 p-5 border-2 transition-all text-left ${payMethod === opt.id ? 'border-[#17191d] bg-[#17191d] text-white' : 'border-[#17191d]/30 bg-white hover:border-[#17191d]'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === opt.id ? 'border-white' : 'border-[#17191d]/40'}`}>
                          {payMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#d4604d]" />}
                        </div>
                        <div>
                          <p className="font-mono text-[11px] font-bold uppercase tracking-[2px]">{opt.label}</p>
                          <p className={`font-mono text-[9px] mt-0.5 ${payMethod === opt.id ? 'opacity-60' : 'opacity-40'}`}>{opt.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="mt-4 border-t-2 border-[#17191d]/10 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={14} className="text-[#d4604d]" />
                      <p className="font-mono text-[10px] uppercase tracking-[3px] font-bold">Coupon Code</p>
                    </div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-[#d4604d]/10 border border-[#d4604d] px-4 py-3">
                        <div>
                          <p className="font-mono text-[10px] font-bold text-[#d4604d] uppercase">{appliedCoupon.code}</p>
                          <p className="font-mono text-[9px] opacity-70">{appliedCoupon.label}</p>
                        </div>
                        <button onClick={() => setAppliedCoupon(null)} className="font-mono text-[9px] text-[#d4604d] hover:opacity-70">Remove ✕</button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <input
                          value={coupon}
                          onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                          placeholder="Enter code (e.g. TESSCH15)"
                          className="flex-1 bg-white border-2 border-[#17191d] font-mono text-[11px] px-4 py-3 focus:outline-none focus:border-[#d4604d] transition-colors placeholder:opacity-30 uppercase"
                        />
                        <button onClick={applyCoupon} className="bg-[#17191d] text-white font-mono text-[10px] font-bold uppercase tracking-[2px] px-6 hover:bg-[#d4604d] transition-colors">Apply</button>
                      </div>
                    )}
                    {couponError && <p className="font-mono text-[9px] text-[#d4604d] mt-2">{couponError}</p>}
                  </div>

                  <button
                    onClick={() => setStep('confirm')}
                    className="bg-[#17191d] text-white font-mono text-[11px] font-bold uppercase tracking-[4px] py-5 px-12 w-fit hover:bg-[#d4604d] transition-colors mt-4"
                  >
                    Review Order →
                  </button>
                </motion.div>
              )}

              {/* CONFIRM STEP */}
              {step === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                  <h2 className="font-display text-2xl uppercase mb-2">Review & Confirm</h2>

                  {/* Items preview */}
                  <div className="flex flex-col gap-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-white border-2 border-[#17191d] p-4">
                        <img src={item.upper.image} alt="" className="w-14 h-14 object-contain mix-blend-multiply" />
                        <div className="flex-1">
                          <p className="font-display text-lg uppercase leading-tight">{item.upper.name}</p>
                          <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40">{item.type === 'build' ? `Full Build${item.sole ? ' + ' + item.sole.name : ''}` : 'Upper Only'} · {item.size} · Qty {item.quantity}</p>
                        </div>
                        <p className="font-display text-xl">₹{((item.type === 'build' ? item.upper.price + (item.sole?.price ?? 0) : item.upper.price) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  {/* Delivery info */}
                  <div className="bg-white border-2 border-[#17191d] p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-2">Delivering To</p>
                    <p className="font-mono text-[11px] font-bold">{address.name || 'No name'}</p>
                    <p className="font-mono text-[10px] opacity-60">{[address.line1, address.city, address.state, address.pin].filter(Boolean).join(', ') || 'No address entered'}</p>
                    <p className="font-mono text-[10px] opacity-60 mt-1">Payment: {payMethod.toUpperCase()}</p>
                  </div>

                  <button onClick={placeOrder} className="bg-[#d4604d] text-white font-mono text-[12px] font-bold uppercase tracking-[4px] py-6 text-center hover:bg-[#17191d] transition-colors">
                    LOCK IN BUILD — ₹{(total + (payMethod === 'cod' ? 49 : 0)).toLocaleString('en-IN')} →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-[#17191d] text-[#e5f1ee] p-8 flex flex-col gap-5">
              <p className="font-mono text-[9px] uppercase tracking-[4px] text-[#d4604d] font-bold">Price Breakdown</p>

              <div className="flex flex-col gap-3 text-[10px] font-mono uppercase">
                <div className="flex justify-between">
                  <span className="opacity-60">MRP ({items.reduce((s, i) => s + i.quantity, 0)} units)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#d4604d]">
                    <span>{appliedCoupon.code}</span>
                    <span>−₹{discountAmt.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-60">Shipping</span>
                  <span className={shipping === 0 ? 'text-[#d4604d]' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {payMethod === 'cod' && (
                  <div className="flex justify-between opacity-60">
                    <span>COD Handling</span>
                    <span>₹49</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#e5f1ee]/10 pt-5 flex justify-between items-end">
                <p className="font-mono text-[9px] uppercase opacity-60">You Pay</p>
                <p className="font-display text-4xl">₹{(total + (payMethod === 'cod' ? 49 : 0)).toLocaleString('en-IN')}</p>
              </div>

              {appliedCoupon && (
                <div className="bg-[#d4604d]/20 border border-[#d4604d] px-4 py-3">
                  <p className="font-mono text-[9px] text-[#d4604d] font-bold uppercase">You save ₹{discountAmt.toLocaleString('en-IN')} with {appliedCoupon.code}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}