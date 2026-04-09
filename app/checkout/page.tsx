'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Check, Tag, MapPin, CreditCard, Loader2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Address {
  id: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

const COUPONS: Record<string, { discount: number; label: string }> = {
  TESSCH15:   { discount: 0.15, label: '15% off — Early Adopter' },
  DROP001:    { discount: 0.10, label: '10% off — Drop 001 Launch' },
  FIRSTBUILD: { discount: 200,  label: '₹200 off — First Build' },
}

type Step = 'delivery' | 'payment' | 'confirm'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isAuthenticated } = useKindeBrowserClient()
  const router = useRouter()

  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep]               = useState<Step>('delivery')
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [savingAddr, setSavingAddr]   = useState(false)
  const [newAddr, setNewAddr]         = useState({
    line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: '',
  })
  const [coupon, setCoupon]           = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; discount: number; label: string }>(null)
  const [couponError, setCouponError] = useState('')
  const [payMethod, setPayMethod]     = useState<'upi' | 'card' | 'cod'>('upi')
  const [placing, setPlacing]         = useState(false)
  const [error, setError]             = useState('')

  // ── Derived ────────────────────────────────────────────────────────────────
  const shipping = subtotal > 10000 ? 0 : 299
  const discountAmt = appliedCoupon
    ? appliedCoupon.discount < 1
      ? Math.round(subtotal * appliedCoupon.discount)
      : appliedCoupon.discount
    : 0
  const codFee     = payMethod === 'cod' ? 49 : 0
  const total      = subtotal + shipping - discountAmt + codFee

  // ── Load saved addresses ───────────────────────────────────────────────────
  const loadAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/address')
      if (res.ok) {
        const data: Address[] = await res.json()
        setSavedAddresses(data)
        if (data.length > 0) setSelectedAddressId(data[0].id)
        else setShowNewForm(true)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (isAuthenticated) loadAddresses()
  }, [isAuthenticated, loadAddresses])

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/api/auth/login')
    }
  }, [isAuthenticated, router])

  // ── Coupon ─────────────────────────────────────────────────────────────────
  function applyCoupon() {
    const c = COUPONS[coupon.toUpperCase()]
    if (!c) {
      setCouponError('Invalid code. Try TESSCH15, DROP001, or FIRSTBUILD')
      return
    }
    setAppliedCoupon({ code: coupon.toUpperCase(), ...c })
    setCouponError('')
  }

  // ── Save new address ───────────────────────────────────────────────────────
  async function saveAddress() {
    if (!newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.postalCode) return
    setSavingAddr(true)
    try {
      const res = await fetch('/api/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr),
      })
      if (res.ok) {
        const saved: Address = await res.json()
        setSavedAddresses(prev => [saved, ...prev])
        setSelectedAddressId(saved.id)
        setShowNewForm(false)
        setNewAddr({ line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: '' })
      }
    } finally {
      setSavingAddr(false)
    }
  }

  // ── Place order (COD or Online via Dodo) ────────────────────────────────────
  async function placeOrder() {
    if (!selectedAddressId) { setError('Please select a delivery address.'); return }
    if (items.length === 0) { setError('Your cart is empty.'); return }

    setPlacing(true)
    setError('')

    try {
      if (payMethod === 'cod') {
        // Save order directly to DB as PENDING
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            addressId: selectedAddressId,
            items,
            totalAmount: total,
            couponCode: appliedCoupon?.code ?? null,
            discountAmount: discountAmt,
            paymentMethod: 'cod',
            dodoSessionId: null,
          }),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? 'Failed to place order')
        }

        clearCart()
        router.push('/checkout/success')
      } else {
        // Create Dodo payment session, then save a pending order
        const sessionRes = await fetch('/api/payments/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            totalAmount: total,
            addressId: selectedAddressId,
            couponCode: appliedCoupon?.code ?? null,
            discountAmount: discountAmt,
          }),
        })

        if (!sessionRes.ok) throw new Error('Payment session creation failed')

        const { url, sessionId } = await sessionRes.json()

        // Save order as PENDING with dodoSessionId so webhook can update it
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            addressId: selectedAddressId,
            items,
            totalAmount: total,
            couponCode: appliedCoupon?.code ?? null,
            discountAmount: discountAmt,
            paymentMethod: payMethod,
            dodoSessionId: sessionId,
          }),
        })

        // Redirect to Dodo payment page
        window.location.href = url
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setPlacing(false)
    }
  }

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId)

  // ── Guard: empty cart ──────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#e5f1ee] flex items-center justify-center flex-col gap-6 text-[#17191d]">
        <p className="font-mono text-[11px] uppercase tracking-[3px] opacity-50">Cart is empty</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-[#17191d] text-white font-mono text-[10px] font-bold uppercase tracking-[3px] px-8 py-4 hover:bg-[#d4604d] transition-colors"
        >
          Browse Products →
        </button>
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
          {(['delivery', 'payment', 'confirm'] as Step[]).map((s, i) => (
            <button
              key={s}
              onClick={() => step !== 'confirm' && setStep(s)}
              className={`font-mono text-[9px] uppercase tracking-[3px] px-6 py-3 font-bold border-r-2 border-[#17191d] last:border-r-0 transition-colors ${
                step === s ? 'bg-[#17191d] text-white' : 'hover:bg-[#17191d]/10'
              }`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 border-2 border-red-400 bg-red-50 px-4 py-3 font-mono text-[11px] text-red-700 uppercase">
            ⚠ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div>
            <AnimatePresence mode="wait">

              {/* ── DELIVERY ─────────────────────────────────────────────── */}
              {step === 'delivery' && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-[#d4604d]" />
                    <h2 className="font-display text-2xl uppercase">Delivery Address</h2>
                  </div>

                  {/* Saved addresses */}
                  {savedAddresses.map(addr => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-4 p-5 border-[3px] cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-[#17191d] bg-white'
                          : 'border-[#17191d]/20 hover:border-[#17191d]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => { setSelectedAddressId(addr.id); setShowNewForm(false) }}
                        className="mt-1"
                      />
                      <div className="font-mono text-[10px] uppercase leading-relaxed">
                        <p className="font-bold">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="opacity-60">{addr.city}, {addr.state} — {addr.postalCode}</p>
                        <p className="opacity-60">{addr.country}{addr.phone ? ` · ${addr.phone}` : ''}</p>
                      </div>
                    </label>
                  ))}

                  {/* Toggle new form */}
                  <button
                    onClick={() => setShowNewForm(v => !v)}
                    className="font-mono text-[10px] uppercase tracking-[3px] font-bold text-[#d4604d] border-b border-[#d4604d] w-fit pb-0.5"
                  >
                    {showNewForm ? '− Cancel' : '+ Add New Address'}
                  </button>

                  {/* New address form */}
                  {showNewForm && (
                    <div className="border-[3px] border-[#17191d]/20 p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'line1',      label: 'Address Line 1 *',  span: true  },
                          { key: 'line2',      label: 'Line 2 (optional)', span: true  },
                          { key: 'city',       label: 'City *',            span: false },
                          { key: 'state',      label: 'State *',           span: false },
                          { key: 'postalCode', label: 'Pincode *',         span: false },
                          { key: 'country',    label: 'Country *',         span: false },
                          { key: 'phone',      label: 'Phone',             span: false },
                        ].map(({ key, label, span }) => (
                          <div key={key} className={span ? 'md:col-span-2' : ''}>
                            <label className="font-mono text-[9px] uppercase tracking-[2px] opacity-50 block mb-1">
                              {label}
                            </label>
                            <input
                              value={newAddr[key as keyof typeof newAddr]}
                              onChange={e => setNewAddr(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-full bg-white border-2 border-[#17191d]/20 font-mono text-[11px] px-3 py-2 focus:border-[#17191d] outline-none transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={saveAddress}
                        disabled={savingAddr}
                        className="font-mono text-[10px] font-bold uppercase tracking-[3px] border-2 border-[#17191d] px-6 py-2 hover:bg-[#17191d] hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {savingAddr && <Loader2 size={12} className="animate-spin" />}
                        {savingAddr ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (!selectedAddressId) { setError('Please select or add an address'); return }
                      setError('')
                      setStep('payment')
                    }}
                    className="bg-[#17191d] text-white font-mono text-[11px] font-bold uppercase tracking-[4px] py-5 px-12 w-fit hover:bg-[#d4604d] transition-colors mt-4"
                  >
                    Continue to Payment →
                  </button>
                </motion.div>
              )}

              {/* ── PAYMENT ──────────────────────────────────────────────── */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={16} className="text-[#d4604d]" />
                    <h2 className="font-display text-2xl uppercase">Payment Method</h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'upi',  label: 'UPI',                   sub: 'GPay, PhonePe, Paytm, BHIM' },
                      { id: 'card', label: 'Credit / Debit Card',    sub: 'Visa, Mastercard, RuPay' },
                      { id: 'cod',  label: 'Cash on Delivery',       sub: '+₹49 handling fee' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setPayMethod(opt.id as 'upi' | 'card' | 'cod')}
                        className={`flex items-center gap-4 p-5 border-2 transition-all text-left ${
                          payMethod === opt.id
                            ? 'border-[#17191d] bg-[#17191d] text-white'
                            : 'border-[#17191d]/30 bg-white hover:border-[#17191d]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          payMethod === opt.id ? 'border-white' : 'border-[#17191d]/40'
                        }`}>
                          {payMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#d4604d]" />}
                        </div>
                        <div>
                          <p className="font-mono text-[11px] font-bold uppercase tracking-[2px]">{opt.label}</p>
                          <p className={`font-mono text-[9px] mt-0.5 ${payMethod === opt.id ? 'opacity-60' : 'opacity-40'}`}>
                            {opt.sub}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="mt-2 border-t-2 border-[#17191d]/10 pt-6">
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
                          placeholder="e.g. TESSCH15"
                          className="flex-1 bg-white border-2 border-[#17191d] font-mono text-[11px] px-4 py-3 focus:outline-none focus:border-[#d4604d] transition-colors placeholder:opacity-30 uppercase"
                        />
                        <button
                          onClick={applyCoupon}
                          className="bg-[#17191d] text-white font-mono text-[10px] font-bold uppercase tracking-[2px] px-6 hover:bg-[#d4604d] transition-colors"
                        >
                          Apply
                        </button>
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

              {/* ── CONFIRM ──────────────────────────────────────────────── */}
              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="font-display text-2xl uppercase mb-2">Review & Confirm</h2>

                  {/* Items */}
                  <div className="flex flex-col gap-3">
                    {items.map(item => {
                      const unitPrice =
                        item.type === 'build'
                          ? item.upper.price + (item.sole?.price ?? 3200)
                          : item.upper.price
                      return (
                        <div key={item.id} className="flex items-center gap-4 bg-white border-2 border-[#17191d] p-4">
                          <img src={item.upper.image} alt="" className="w-14 h-14 object-contain mix-blend-multiply" />
                          <div className="flex-1">
                            <p className="font-display text-lg uppercase leading-tight">{item.upper.name}</p>
                            <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40">
                              {item.type === 'build' ? `Full Build${item.sole ? ' + ' + item.sole.name : ''}` : 'Upper Only'} · {item.size} · Qty {item.quantity}
                            </p>
                          </div>
                          <p className="font-display text-xl">₹{(unitPrice * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Delivery summary */}
                  {selectedAddress && (
                    <div className="bg-white border-2 border-[#17191d] p-5 space-y-1">
                      <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-2">Delivering To</p>
                      <p className="font-mono text-[11px] font-bold">
                        {selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}
                      </p>
                      <p className="font-mono text-[10px] opacity-60">
                        {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.postalCode}
                      </p>
                      <p className="font-mono text-[10px] opacity-60">{selectedAddress.country}</p>
                      <p className="font-mono text-[10px] opacity-60 mt-2">
                        Payment: {payMethod === 'cod' ? 'Cash on Delivery' : payMethod.toUpperCase()}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="bg-[#d4604d] text-white font-mono text-[12px] font-bold uppercase tracking-[4px] py-6 text-center hover:bg-[#17191d] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {placing && <Loader2 size={16} className="animate-spin" />}
                    {placing
                      ? (payMethod === 'cod' ? 'Placing Order...' : 'Redirecting to Payment...')
                      : `${payMethod === 'cod' ? 'PLACE ORDER' : 'PAY NOW'} — ₹${total.toLocaleString('en-IN')} →`
                    }
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Summary — unchanged from your original */}
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
                <p className="font-display text-4xl">₹{total.toLocaleString('en-IN')}</p>
              </div>
              {appliedCoupon && (
                <div className="bg-[#d4604d]/20 border border-[#d4604d] px-4 py-3">
                  <p className="font-mono text-[9px] text-[#d4604d] font-bold uppercase">
                    You save ₹{discountAmt.toLocaleString('en-IN')} with {appliedCoupon.code}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}