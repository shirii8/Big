'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Tag, MapPin, CreditCard, Loader2 } from 'lucide-react'
import UPIPayment from '@/components/UPIPayment'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Address {
  id: string; line1: string; line2?: string; city: string
  state: string; postalCode: string; country: string; phone?: string
}

type Step = 'delivery' | 'payment' | 'confirm' | 'upi'

// ─── Coupon logic ─────────────────────────────────────────────────────────────
// Named coupons
const NAMED_COUPONS: Record<string, { discount: number; label: string; type: 'percent' | 'flat' }> = {
  TESSCH15:   { discount: 0.15, label: '15% off — Early Adopter',        type: 'percent' },
  DROP001:    { discount: 0.10, label: '10% off — Drop 001 Launch',      type: 'percent' },
  FIRSTBUILD: { discount: 200,  label: '₹200 off — First Build',         type: 'flat'    },
  BUNDLE2:    { discount: 0.10, label: '10% off — 2 Uppers + Sole deal', type: 'percent' },
}

// MRP-based offer (from business rules)
function getMRPOffer(mrp: number): { label: string; maxOff: number } | null {
  if (mrp >= 7500)  return { label: 'Up to ₹2,000 off (MRP ≥ ₹7,500)',  maxOff: 2000 }
  if (mrp >= 5000)  return { label: 'Up to ₹1,500 off (MRP ₹5,000–₹7,499)', maxOff: 1500 }
  if (mrp >= 0)     return { label: 'Up to ₹1,000 off (MRP < ₹5,000)',  maxOff: 1000 }
  return null
}

// One-time coupon codes (first 2 chars = %)
const ONE_TIME_CODES: string[] = [
  '732705ZEES','251401EKLV','251109LUXY','250312ARPI','301203GAUR',
  '253005SAKS','691409SAUR','302802SUMI','692506ATHA','691511ROHI',
  '692604ATHA','352712UJJA','400711GUNJ','691809PARI','402405SHRU',
  '401505YASH','401705UTK1','252812KRIS','251109TARU','301601KAND',
  '350210RITI','300712NITI','303105HARS','302510RAVI','301007NICK',
  '252403VIDI','302608HEMA','300707PRAS','300303ADIT','301006shry',
  '400307SPAN','252109SHAU','252111ANKU','352207hari','902006JANA',
  '301107RAVI','300312ANKI','301808KULD','692309DEVT','302208RISH',
  '302112AASH','251301ANJA','711406RIJO','71290IMELV','691311KART',
  '250011alfr','350301KINS','692603KUSH','400602RAJV','151511KART',
  '401708NISH','402412SATY','400609RAVI','402201RISH','401305TUSH',
  '400401SWAT','403008TUSH','302309ATIN','300507SHIV','300604ARNA',
  '252305MANY','400509AMAN','401405RISH','401712TEJU','402806HIRU',
  '301012ASHi','301105ARUL',
]

// Codes used this session (persisted in localStorage)
const USED_KEY = 'tessch_used_codes'

function getUsedCodes(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(USED_KEY) ?? '[]') } catch { return [] }
}
function markCodeUsed(code: string) {
  const used = getUsedCodes()
  localStorage.setItem(USED_KEY, JSON.stringify([...used, code.toUpperCase()]))
}

function validateCoupon(
  code: string,
  subtotal: number
): { discountAmt: number; label: string; isOneTime: boolean } | { error: string } {
  const upper = code.toUpperCase()

  // Check named coupons first
  const named = NAMED_COUPONS[upper]
  if (named) {
    const mrpOffer = getMRPOffer(subtotal)
    const cap = mrpOffer?.maxOff ?? 1000
    const raw = named.type === 'flat' ? named.discount : Math.round(subtotal * named.discount)
    return { discountAmt: Math.min(raw, cap), label: named.label, isOneTime: false }
  }

  // Check one-time codes
  const found = ONE_TIME_CODES.find(c => c.toUpperCase() === upper)
  if (!found) return { error: 'Invalid coupon code.' }

  const used = getUsedCodes()
  if (used.includes(upper)) return { error: 'This code has already been used.' }

  const pctStr = found.slice(0, 2)
  const pct    = parseInt(pctStr, 10)
  if (isNaN(pct) || pct <= 0) return { error: 'Invalid code format.' }

  const mrpOffer = getMRPOffer(subtotal)
  const cap      = mrpOffer?.maxOff ?? 1000
  const raw      = Math.round(subtotal * (pct / 100))
  const discountAmt = Math.min(raw, cap)

  return {
    discountAmt,
    label: `${pct}% off — max ₹${cap} (${mrpOffer?.label ?? ''})`,
    isOneTime: true,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient()
  const router = useRouter()

  const [authChecked, setAuthChecked]           = useState(false)
  const [step, setStep]                         = useState<Step>('delivery')
  const [savedAddresses, setSavedAddresses]     = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [showNewForm, setShowNewForm]           = useState(false)
  const [savingAddr, setSavingAddr]             = useState(false)
  const [newAddr, setNewAddr]                   = useState({
    line1: '', line2: '', city: '', state: '',
    postalCode: '', country: 'India', phone: '',
  })
  const [coupon, setCoupon]                     = useState('')
  const [appliedCoupon, setAppliedCoupon]       = useState<{
    code: string; discountAmt: number; label: string; isOneTime: boolean
  } | null>(null)
  const [couponError, setCouponError]           = useState('')
  const [payMethod, setPayMethod]               = useState<'upi' | 'cod'>('upi')
  const [placing, setPlacing]                   = useState(false)
  const [error, setError]                       = useState('')
  const [createdOrderId, setCreatedOrderId]     = useState('')

  const SHIPPING  = 170 // flat per policy
  const discountAmt = appliedCoupon?.discountAmt ?? 0
  const codFee      = payMethod === 'cod' ? 49 : 0
  const total       = subtotal + SHIPPING - discountAmt + codFee

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

  // Auth guard
  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) { router.push('/api/auth/login'); return }
    setAuthChecked(true)
    loadAddresses()
  }, [isLoading, isAuthenticated, router, loadAddresses])

  function applyCouponCode() {
    const result = validateCoupon(coupon, subtotal)
    if ('error' in result) { setCouponError(result.error); return }
    setAppliedCoupon({ code: coupon.toUpperCase(), ...result })
    setCouponError('')
  }

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
    } finally { setSavingAddr(false) }
  }

  async function placeOrder() {
    if (!selectedAddressId) { setError('Please select a delivery address.'); return }
    if (items.length === 0) { setError('Your cart is empty.'); return }
    setPlacing(true)
    setError('')

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items,
          totalAmount: total,
          couponCode: appliedCoupon?.code ?? null,
          discountAmount: discountAmt,
          paymentMethod: payMethod,
        }),
      })
      if (!orderRes.ok) throw new Error((await orderRes.json()).error ?? 'Order creation failed')
      const internalOrder = await orderRes.json()

      // Mark one-time code as used only after DB order created successfully
      if (appliedCoupon?.isOneTime) markCodeUsed(appliedCoupon.code)

      if (payMethod === 'cod') {
        clearCart()
        router.push('/checkout/success')
        return
      }

      // UPI — show QR payment screen
      setCreatedOrderId(internalOrder.id)
      setStep('upi')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setPlacing(false)
    }
  }

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId)

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (isLoading || !authChecked) return (
    <div className="min-h-screen bg-[#e5f1ee] flex items-center justify-center gap-3">
      <Loader2 size={16} className="animate-spin text-[#17191d]" />
      <p className="font-mono text-[11px] uppercase tracking-[3px] text-[#17191d]">Verifying session...</p>
    </div>
  )

  if (items.length === 0) return (
    <div className="min-h-screen bg-[#e5f1ee] flex items-center justify-center flex-col gap-6 text-[#17191d]">
      <p className="font-mono text-[11px] uppercase tracking-[3px] opacity-50">Your cart is empty</p>
      <button onClick={() => router.push('/products')} className="bg-[#17191d] text-white font-mono text-[10px] font-bold uppercase tracking-[3px] px-8 py-4 hover:bg-[#d4604d] transition-colors">
        Browse Products →
      </button>
    </div>
  )

  // ── UPI Payment screen ────────────────────────────────────────────────────
  if (step === 'upi') return (
    <div className="min-h-screen bg-[#e5f1ee] text-[#17191d] pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-2">Step 3 — Pay</p>
          <h1 className="font-display text-[clamp(36px,6vw,72px)] leading-none uppercase tracking-tighter">
            UPI<br /><span className="text-[#d4604d]">PAYMENT.</span>
          </h1>
        </div>
        <UPIPayment
          amount={total}
          orderId={createdOrderId}
          onConfirmed={() => { clearCart(); router.push('/checkout/success') }}
          onCancel={() => setStep('confirm')}
        />
      </div>
    </div>
  )

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
            <button key={s}
              onClick={() => !placing && setStep(s)}
              className={`font-mono text-[9px] uppercase tracking-[3px] px-6 py-3 font-bold border-r-2 border-[#17191d] last:border-r-0 transition-colors
                ${step === s ? 'bg-[#17191d] text-white' : !placing ? 'hover:bg-[#d4604d] hover:text-white cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 border-2 border-red-400 bg-red-50 px-4 py-3 font-mono text-[11px] text-red-700 uppercase tracking-[1px]">
            ⚠ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div>
            <AnimatePresence mode="wait">

              {/* ── DELIVERY ──────────────────────────────────────────────── */}
              {step === 'delivery' && (
                <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-[#d4604d]" />
                    <h2 className="font-display text-2xl uppercase">Delivery Address</h2>
                  </div>

                  {savedAddresses.map(addr => (
                    <label key={addr.id} className={`flex items-start gap-4 p-5 border-[3px] cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#17191d] bg-white' : 'border-[#17191d]/20 hover:border-[#17191d]/50'}`}>
                      <input type="radio" name="address" checked={selectedAddressId === addr.id}
                        onChange={() => { setSelectedAddressId(addr.id); setShowNewForm(false) }} className="mt-1" />
                      <div className="font-mono text-[10px] uppercase leading-relaxed">
                        <p className="font-bold">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="opacity-60">{addr.city}, {addr.state} — {addr.postalCode}</p>
                        <p className="opacity-60">{addr.country}{addr.phone ? ` · ${addr.phone}` : ''}</p>
                      </div>
                    </label>
                  ))}

                  <button onClick={() => setShowNewForm(v => !v)}
                    className="font-mono text-[10px] uppercase tracking-[3px] font-bold text-[#d4604d] border-b border-[#d4604d] w-fit pb-0.5">
                    {showNewForm ? '− Cancel' : '+ Add New Address'}
                  </button>

                  {showNewForm && (
                    <div className="border-[3px] border-[#17191d]/20 p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'line1',      label: 'Address Line 1 *', span: true  },
                          { key: 'line2',      label: 'Line 2 (optional)', span: true },
                          { key: 'city',       label: 'City *',           span: false },
                          { key: 'state',      label: 'State *',          span: false },
                          { key: 'postalCode', label: 'Pincode *',        span: false },
                          { key: 'country',    label: 'Country *',        span: false },
                          { key: 'phone',      label: 'Phone',            span: false },
                        ].map(({ key, label, span }) => (
                          <div key={key} className={span ? 'md:col-span-2' : ''}>
                            <label className="font-mono text-[9px] uppercase tracking-[2px] opacity-50 block mb-1">{label}</label>
                            <input value={newAddr[key as keyof typeof newAddr]}
                              onChange={e => setNewAddr(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-full bg-white border-2 border-[#17191d]/20 font-mono text-[11px] px-3 py-2 focus:border-[#17191d] outline-none transition-colors" />
                          </div>
                        ))}
                      </div>
                      <button onClick={saveAddress} disabled={savingAddr}
                        className="font-mono text-[10px] font-bold uppercase tracking-[3px] border-2 border-[#17191d] px-6 py-2 hover:bg-[#17191d] hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2">
                        {savingAddr && <Loader2 size={12} className="animate-spin" />}
                        {savingAddr ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  )}

                  <button onClick={() => { if (!selectedAddressId) { setError('Select or add an address first'); return } setError(''); setStep('payment') }}
                    className="bg-[#17191d] text-white font-mono text-[11px] font-bold uppercase tracking-[4px] py-5 px-12 w-fit hover:bg-[#d4604d] transition-colors mt-4">
                    Continue to Payment →
                  </button>
                </motion.div>
              )}

              {/* ── PAYMENT ───────────────────────────────────────────────── */}
              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <CreditCard size={16} className="text-[#d4604d]" />
                    <h2 className="font-display text-2xl uppercase">Payment Method</h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'upi', label: 'UPI Payment',        sub: 'GPay, PhonePe, Paytm, BHIM — scan QR at next step' },
                      { id: 'cod', label: 'Cash on Delivery',    sub: '+₹49 handling fee — pay when your build arrives' },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setPayMethod(opt.id as typeof payMethod)}
                        className={`flex items-center gap-4 p-5 border-2 transition-all text-left ${payMethod === opt.id ? 'border-[#17191d] bg-[#17191d] text-white' : 'border-[#17191d]/30 bg-white hover:border-[#17191d]'}`}>
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
                  <div className="mt-2 border-t-2 border-[#17191d]/10 pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={14} className="text-[#d4604d]" />
                      <p className="font-mono text-[10px] uppercase tracking-[3px] font-bold">Coupon Code</p>
                    </div>

                    {/* MRP offer banner */}
                    {(() => {
                      const offer = getMRPOffer(subtotal)
                      return offer ? (
                        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 mb-3">
                          <p className="font-mono text-[9px] text-emerald-700 uppercase tracking-[1px] font-bold">
                            🎉 {offer.label}
                          </p>
                        </div>
                      ) : null
                    })()}

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-[#d4604d]/10 border border-[#d4604d] px-4 py-3">
                        <div>
                          <p className="font-mono text-[10px] font-bold text-[#d4604d] uppercase">{appliedCoupon.code}</p>
                          <p className="font-mono text-[9px] opacity-70">{appliedCoupon.label} — saving ₹{appliedCoupon.discountAmt.toLocaleString('en-IN')}</p>
                        </div>
                        <button onClick={() => setAppliedCoupon(null)} className="font-mono text-[9px] text-[#d4604d] hover:opacity-70">Remove ✕</button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <input value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                          placeholder="Enter code"
                          className="flex-1 bg-white border-2 border-[#17191d] font-mono text-[11px] px-4 py-3 focus:outline-none focus:border-[#d4604d] transition-colors placeholder:opacity-30 uppercase" />
                        <button onClick={applyCouponCode} className="bg-[#17191d] text-white font-mono text-[10px] font-bold uppercase tracking-[2px] px-6 hover:bg-[#d4604d] transition-colors">
                          Apply
                        </button>
                      </div>
                    )}
                    {couponError && <p className="font-mono text-[9px] text-red-500 mt-2 uppercase">{couponError}</p>}
                    <p className="font-mono text-[8px] uppercase tracking-[1px] opacity-30 mt-2">
                      One-time codes can only be used once. Max discount: ₹1,000.
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setStep('delivery')}
                      className="font-mono text-[10px] font-bold uppercase tracking-[3px] border-2 border-[#17191d] px-6 py-3 hover:bg-[#17191d] hover:text-white transition-colors">
                      ← Back
                    </button>
                    <button onClick={() => setStep('confirm')}
                      className="flex-1 bg-[#17191d] text-white font-mono text-[11px] font-bold uppercase tracking-[4px] py-4 hover:bg-[#d4604d] transition-colors">
                      Review Order →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── CONFIRM ───────────────────────────────────────────────── */}
              {step === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                  <h2 className="font-display text-2xl uppercase mb-2">Review & Confirm</h2>

                  {/* Items */}
                  <div className="flex flex-col gap-3">
                    {items.map(item => {
                      const unitPrice = item.type === 'build' ? item.upper.price + (item.sole?.price ?? 3200) : item.upper.price
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

                  {/* Address */}
                  {selectedAddress && (
                    <div className="bg-white border-2 border-[#17191d] p-5 space-y-1">
                      <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-2">Delivering To</p>
                      <p className="font-mono text-[11px] font-bold">{selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}</p>
                      <p className="font-mono text-[10px] opacity-60">{selectedAddress.city}, {selectedAddress.state} — {selectedAddress.postalCode}</p>
                      <p className="font-mono text-[10px] opacity-60">{selectedAddress.country}{selectedAddress.phone ? ` · ${selectedAddress.phone}` : ''}</p>
                      <p className="font-mono text-[10px] opacity-60 mt-2 uppercase">
                        Payment: {payMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}
                      </p>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="bg-emerald-50 border-2 border-emerald-300 px-5 py-3">
                      <p className="font-mono text-[9px] text-emerald-700 uppercase font-bold">
                        Coupon {appliedCoupon.code} applied — saving ₹{appliedCoupon.discountAmt.toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button onClick={() => !placing && setStep('payment')} disabled={placing}
                      className="font-mono text-[10px] font-bold uppercase tracking-[3px] border-2 border-[#17191d] px-6 py-3 w-fit hover:bg-[#17191d] hover:text-white transition-colors disabled:opacity-30">
                      ← Edit Payment
                    </button>
                    <button onClick={placeOrder} disabled={placing}
                      className="bg-[#d4604d] text-white font-mono text-[12px] font-bold uppercase tracking-[4px] py-6 text-center hover:bg-[#17191d] transition-colors disabled:opacity-50 flex items-center justify-center gap-3">
                      {placing && <Loader2 size={16} className="animate-spin" />}
                      {placing
                        ? (payMethod === 'cod' ? 'Placing Order...' : 'Preparing UPI...')
                        : `${payMethod === 'cod' ? 'PLACE ORDER' : 'PROCEED TO PAY'} — ₹${total.toLocaleString('en-IN')} →`
                      }
                    </button>
                  </div>
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
                  <div className="flex justify-between text-emerald-400">
                    <span>{appliedCoupon.code}</span>
                    <span>−₹{appliedCoupon.discountAmt.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-60">Shipping</span>
                  <span>₹{SHIPPING}</span>
                </div>
                {payMethod === 'cod' && (
                  <div className="flex justify-between opacity-60">
                    <span>COD Handling</span><span>₹49</span>
                  </div>
                )}
              </div>
              <div className="border-t border-[#e5f1ee]/10 pt-5 flex justify-between items-end">
                <p className="font-mono text-[9px] uppercase opacity-60">You Pay</p>
                <p className="font-display text-4xl">₹{total.toLocaleString('en-IN')}</p>
              </div>
              {appliedCoupon && (
                <div className="bg-emerald-500/20 border border-emerald-400 px-4 py-3">
                  <p className="font-mono text-[9px] text-emerald-400 font-bold uppercase">
                    Saving ₹{appliedCoupon.discountAmt.toLocaleString('en-IN')} with {appliedCoupon.code}
                  </p>
                </div>
              )}

              {/* MRP tier info */}
              {(() => {
                const offer = getMRPOffer(subtotal)
                return offer && !appliedCoupon ? (
                  <div className="bg-[#d4604d]/10 border border-[#d4604d]/30 px-4 py-3">
                    <p className="font-mono text-[8px] text-[#d4604d] uppercase tracking-[1px]">
                      {offer.label} — apply a code in payment step
                    </p>
                  </div>
                ) : null
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}