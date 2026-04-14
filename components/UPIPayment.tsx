'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Copy, Loader2, X, RefreshCw } from 'lucide-react'

interface UPIData {
  upiId: string
  upiName: string
  upiLink: string
  qrUrl: string
  amount: number
  orderId: string
}

interface Props {
  amount: number
  orderId: string
  onConfirmed: () => void
  onCancel: () => void
}

type Step = 'loading' | 'qr' | 'confirming' | 'done' | 'error'

export default function UPIPayment({ amount, orderId, onConfirmed, onCancel }: Props) {
  const [step, setStep]       = useState<Step>('loading')
  const [upiData, setUpiData] = useState<UPIData | null>(null)
  const [copied, setCopied]   = useState(false)
  const [txnRef, setTxnRef]   = useState('')
  const [error, setError]     = useState('')
  const [timer, setTimer]     = useState(600)

  const initiate = useCallback(async () => {
    setStep('loading')
    setError('')
    try {
      const res = await fetch('/api/payments/upi/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed')
      const data: UPIData = await res.json()
      setUpiData(data)
      setTimer(600)
      setStep('qr')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payment details')
      setStep('error')
    }
  }, [orderId, amount])

  useEffect(() => { initiate() }, [initiate])

  useEffect(() => {
    if (step !== 'qr') return
    if (timer <= 0) { setStep('error'); setError('Session expired. Please refresh.'); return }
    const t = setInterval(() => setTimer(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [step, timer])

  const mins = String(Math.floor(timer / 60)).padStart(2, '0')
  const secs = String(Math.max(0, timer % 60)).padStart(2, '0')

  async function copyUPI() {
    if (!upiData) return
    await navigator.clipboard.writeText(upiData.upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function confirmPayment() {
    if (!txnRef.trim()) {
      setError('Please enter your UPI transaction / UTR reference number')
      return
    }
    setError('')
    setStep('confirming')
    try {
      const res = await fetch('/api/payments/upi/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, txnRef: txnRef.trim() }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed')
      setStep('done')
      setTimeout(onConfirmed, 2000)
    } catch (e) {
      setStep('qr')
      setError(e instanceof Error ? e.message : 'Something went wrong. Email tesschstore@gmail.com with your UTR.')
    }
  }

  if (step === 'done') return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 py-16 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14, stiffness: 200 }}>
        <CheckCircle2 size={56} className="text-emerald-500" />
      </motion.div>
      <div>
        <p className="font-display text-4xl uppercase tracking-tighter text-[#17191d] leading-none mb-2">Payment<br />Submitted!</p>
        <p className="font-mono text-[10px] uppercase tracking-[2px] text-[#17191d]/50">Redirecting to confirmation...</p>
      </div>
    </motion.div>
  )

  if (step === 'confirming') return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 py-16">
      <Loader2 size={36} className="animate-spin text-[#d4604d]" />
      <p className="font-mono text-[10px] uppercase tracking-[3px] text-[#17191d]/60">Submitting payment details...</p>
    </motion.div>
  )

  if (step === 'loading') return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 py-16">
      <Loader2 size={36} className="animate-spin text-[#17191d]" />
      <p className="font-mono text-[10px] uppercase tracking-[3px] text-[#17191d]/60">Loading payment details...</p>
    </motion.div>
  )

  if (step === 'error') return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 py-12 text-center">
      <p className="font-mono text-[10px] uppercase text-red-500 tracking-[2px]">⚠ {error}</p>
      <div className="flex gap-3">
        <button onClick={initiate} className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[2px] border-2 border-[#17191d] px-6 py-3 hover:bg-[#17191d] hover:text-white transition-colors">
          <RefreshCw size={12} /> Retry
        </button>
        <button onClick={onCancel} className="font-mono text-[10px] font-bold uppercase tracking-[2px] border-2 border-[#17191d]/30 px-6 py-3 hover:border-[#17191d] transition-colors">
          Cancel
        </button>
      </div>
    </motion.div>
  )

  return (
    <AnimatePresence mode="wait">
      <motion.div key="qr" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">

        {/* Timer */}
        <div className="flex items-center justify-between border-b-2 border-[#17191d]/10 pb-4">
          <p className="font-mono text-[9px] uppercase tracking-[3px] text-[#17191d]/50">Session expires in</p>
          <span className={`font-display text-2xl tabular-nums ${timer < 60 ? 'text-red-500' : 'text-[#17191d]'}`}>
            {mins}:{secs}
          </span>
        </div>

        {/* QR Card */}
        <div className="border-4 border-[#17191d] bg-white flex flex-col items-center gap-4 p-6">
          <div className="text-center">
            <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-1">Pay Exactly</p>
            <p className="font-display text-5xl text-[#d4604d] leading-none">₹{amount.toLocaleString('en-IN')}</p>
            <p className="font-mono text-[8px] uppercase tracking-[2px] opacity-30 mt-1">Order {orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          {upiData && (
            <div className="bg-[#e5f1ee] p-3 border-2 border-[#17191d]/10">
              <img src={upiData.qrUrl} alt="UPI QR Code" width={240} height={240} className="block" />
            </div>
          )}

          <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40">Scan with any UPI app</p>

          {upiData && (
            <div className="flex items-center justify-between w-full bg-[#f8fcfb] border-2 border-[#17191d]/10 px-4 py-3">
              <div>
                <p className="font-mono text-[8px] uppercase opacity-40 mb-0.5">UPI ID</p>
                <p className="font-mono text-[12px] font-bold">{upiData.upiId}</p>
              </div>
              <button onClick={copyUPI}
                className={`flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[2px] px-4 py-2 border-2 transition-all ${copied ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#17191d] hover:bg-[#17191d] hover:text-white'}`}>
                {copied ? <><CheckCircle2 size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
              </button>
            </div>
          )}
        </div>

        {/* App buttons */}
        {upiData && (
          <div className="space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40">Or open directly in</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'GPay',    href: `tez://upi/pay?pa=${upiData.upiId}&pn=${upiData.upiName}&am=${amount}&cu=INR&tn=Order%20${orderId.slice(0,8).toUpperCase()}` },
                { name: 'PhonePe', href: `phonepe://pay?pa=${upiData.upiId}&pn=${upiData.upiName}&am=${amount}&cu=INR` },
                { name: 'Paytm',   href: `paytmmp://upi/pay?pa=${upiData.upiId}&pn=${upiData.upiName}&am=${amount}&cu=INR` },
                { name: 'BHIM',    href: upiData.upiLink },
              ].map(app => (
                <a key={app.name} href={app.href}
                  className="font-mono text-[9px] font-bold uppercase tracking-[1px] border-2 border-[#17191d] py-2.5 text-center hover:bg-[#17191d] hover:text-white transition-colors">
                  {app.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="bg-[#17191d]/5 border-l-4 border-[#d4604d] pl-4 py-3 space-y-2">
          {[
            `Scan QR code or tap an app button above`,
            `Pay exactly ₹${amount.toLocaleString('en-IN')} — do not change the amount`,
            `After payment, find the UTR / Ref number in your UPI app`,
            `Paste it below and click "I've Paid"`,
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-display text-[#d4604d] text-sm leading-none mt-0.5 shrink-0">{i + 1}</span>
              <p className="font-mono text-[9px] uppercase tracking-[1px] text-[#17191d]/60 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>

        {/* UTR Input */}
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[3px] text-[#17191d]/50 block mb-2">
            UTR / Transaction Reference Number *
          </label>
          <input
            value={txnRef}
            onChange={e => { setTxnRef(e.target.value); setError('') }}
            placeholder="12-digit UTR e.g. 408124567890"
            className="w-full bg-white border-2 border-[#17191d] font-mono text-[12px] px-4 py-3.5 focus:border-[#d4604d] outline-none transition-colors placeholder:opacity-20"
          />
          {error && <p className="font-mono text-[9px] text-red-500 uppercase tracking-[1px] mt-2">⚠ {error}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[2px] border-2 border-[#17191d]/30 px-5 py-3.5 hover:border-[#17191d] transition-colors shrink-0">
            <X size={11} /> Cancel
          </button>
          <button onClick={confirmPayment}
            className="flex-1 bg-[#d4604d] text-white font-mono text-[10px] font-bold uppercase tracking-[3px] py-4 hover:bg-[#17191d] transition-colors">
            I&apos;ve Paid — Confirm Order →
          </button>
        </div>

        <p className="font-mono text-[8px] uppercase tracking-[1px] opacity-25 text-center leading-relaxed">
          Your order will be confirmed after our team verifies the UTR. This usually takes under 30 minutes.
        </p>
      </motion.div>
    </AnimatePresence>
  )
}