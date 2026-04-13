'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Copy, Loader2, X } from 'lucide-react'
import Image from 'next/image'

// ─── Your UPI details ─────────────────────────────────────────────────────────
const UPI_ID   = '8459799219@axl'   // ← replace with your actual UPI ID
const UPI_NAME = 'TESSCH'

interface Props {
  amount: number
  orderId: string
  onConfirmed: () => void
  onCancel: () => void
}

type UPIStep = 'qr' | 'confirming' | 'done'

export default function UPIPayment({ amount, orderId, onConfirmed, onCancel }: Props) {
  const [step, setStep]       = useState<UPIStep>('qr')
  const [copied, setCopied]   = useState(false)
  const [txnRef, setTxnRef]   = useState('')
  const [error, setError]     = useState('')
  const [timer, setTimer]     = useState(600) // 10 min countdown

  // UPI deep-link for QR
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId.slice(0, 8).toUpperCase()}`)}`

  // QR code via Google Charts API (CSP-safe CDN alternative)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&bgcolor=e5f1ee&color=17191d&margin=16`

  useEffect(() => {
    if (step !== 'qr') return
    const t = setInterval(() => setTimer(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [step])

  const mins = String(Math.floor(timer / 60)).padStart(2, '0')
  const secs = String(Math.max(0, timer % 60)).padStart(2, '0')

  async function copyUPI() {
    await navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function confirmPayment() {
    if (!txnRef.trim()) { setError('Please enter your UPI transaction reference number'); return }
    setError('')
    setStep('confirming')

    // Save COD-style order as PENDING — owner will verify UPI ref manually
    try {
      const res = await fetch('/api/orders/confirm-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, txnRef: txnRef.trim() }),
      })
      if (!res.ok) throw new Error('Failed to confirm')
      setStep('done')
      setTimeout(onConfirmed, 1800)
    } catch {
      setStep('qr')
      setError('Something went wrong. Please contact tesschstore@gmail.com with your UTR number.')
    }
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'done' ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-10 text-center"
        >
          <CheckCircle2 size={48} className="text-emerald-500" />
          <p className="font-display text-3xl uppercase tracking-tighter text-[#17191d]">Payment Submitted!</p>
          <p className="font-mono text-[10px] uppercase tracking-[2px] opacity-60">Redirecting to confirmation...</p>
        </motion.div>
      ) : step === 'confirming' ? (
        <motion.div
          key="confirming"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 py-10"
        >
          <Loader2 size={32} className="animate-spin text-[#d4604d]" />
          <p className="font-mono text-[10px] uppercase tracking-[3px]">Verifying payment...</p>
        </motion.div>
      ) : (
        <motion.div
          key="qr"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Timer */}
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[3px] text-[#17191d]/60">
              Session expires in
            </p>
            <span className={`font-display text-2xl ${timer < 60 ? 'text-red-500' : 'text-[#17191d]'}`}>
              {mins}:{secs}
            </span>
          </div>

          {/* QR + Amount */}
          <div className="bg-[#e5f1ee] border-4 border-[#17191d] p-6 flex flex-col items-center gap-4">
            <div className="bg-white p-2 border-2 border-[#17191d]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="UPI QR Code"
                width={220}
                height={220}
                className="block"
              />
            </div>

            <div className="text-center">
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-50 mb-1">Scan with any UPI app</p>
              <p className="font-display text-3xl text-[#d4604d]">₹{amount.toLocaleString('en-IN')}</p>
              <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40 mt-1">
                Order {orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* UPI ID copy */}
            <div className="flex items-center gap-2 bg-white border-2 border-[#17191d] px-4 py-2 w-full justify-between">
              <span className="font-mono text-[11px] font-bold">{UPI_ID}</span>
              <button onClick={copyUPI} className="flex items-center gap-1 font-mono text-[9px] uppercase text-[#d4604d] hover:opacity-70 transition-opacity">
                {copied ? <><CheckCircle2 size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
          </div>

          {/* UPI app buttons */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-50 mb-3">Or open directly in</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'GPay',     scheme: `tez://upi/pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${amount}&cu=INR` },
                { name: 'PhonePe',  scheme: `phonepe://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${amount}&cu=INR` },
                { name: 'Paytm',    scheme: `paytmmp://upi/pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${amount}&cu=INR` },
                { name: 'BHIM',     scheme: upiLink },
              ].map(app => (
                <a
                  key={app.name}
                  href={app.scheme}
                  className="font-mono text-[9px] font-bold uppercase tracking-[2px] border-2 border-[#17191d] px-4 py-2 hover:bg-[#17191d] hover:text-white transition-colors"
                >
                  {app.name}
                </a>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white border-2 border-[#17191d]/10 p-4 space-y-2">
            {[
              '1. Scan QR or tap your UPI app above',
              '2. Pay ₹' + amount.toLocaleString('en-IN') + ' to complete order',
              '3. Copy the UTR / transaction ref number',
              '4. Paste it below and click Confirm',
            ].map(s => (
              <p key={s} className="font-mono text-[9px] uppercase tracking-[1px] text-[#17191d]/60">{s}</p>
            ))}
          </div>

          {/* UTR input */}
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[3px] opacity-50 block mb-2">
              UPI Transaction / UTR Reference Number *
            </label>
            <input
              value={txnRef}
              onChange={e => { setTxnRef(e.target.value); setError('') }}
              placeholder="e.g. 123456789012"
              className="w-full bg-white border-2 border-[#17191d] font-mono text-[11px] px-4 py-3 focus:border-[#d4604d] outline-none transition-colors"
            />
            {error && <p className="font-mono text-[9px] text-red-500 uppercase mt-2">⚠ {error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="font-mono text-[9px] font-bold uppercase tracking-[2px] border-2 border-[#17191d]/30 px-6 py-3 hover:border-[#17191d] transition-colors flex items-center gap-2"
            >
              <X size={12} /> Cancel
            </button>
            <button
              onClick={confirmPayment}
              className="flex-1 bg-[#d4604d] text-white font-mono text-[10px] font-bold uppercase tracking-[3px] py-4 hover:bg-[#17191d] transition-colors"
            >
              I&apos;ve Paid — Confirm Order →
            </button>
          </div>

          <p className="font-mono text-[8px] uppercase tracking-[1px] opacity-30 text-center">
            Your order will be confirmed after manual UPI verification by our team within 30 minutes.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}