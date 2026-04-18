'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, XCircle, Clock, Search, RefreshCw,
  ChevronDown, ChevronUp, Loader2, Package, AlertTriangle, Eye,
} from 'lucide-react'

// ── Types ──
interface Product { name: string; image: string }
interface Variant  { size: string; product: Product }
interface OrderItem {
  id: string
  quantity: number
  price: number
  productType: string
  variant: Variant
}
interface Address {
  line1: string; line2?: string | null
  city: string; state: string; postalCode: string
  country: string; phone?: string | null
}
interface OrderUser { email: string; firstName: string | null; lastName: string | null }

interface Order {
  id: string
  totalAmount: number
  status: string
  paymentMethod: string
  paymentScreenshot: string | null
  utrReference: string | null
  paymentVerified: boolean
  verificationNote: string | null
  couponCode: string | null
  discountAmount: number
  createdAt: string
  user: OrderUser
  address: Address
  items: OrderItem[]
}

type FilterStatus = 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED'

const STATUS_CFG: Record<string, { label: string; rowBorder: string; badge: string; dot: string }> = {
  PENDING:   { label: 'Pending',   rowBorder: 'border-amber-300',   badge: 'bg-amber-50  border-amber-300  text-amber-700',  dot: 'bg-amber-500'   },
  PAID:      { label: 'Paid',      rowBorder: 'border-blue-200',    badge: 'bg-blue-50   border-blue-300   text-blue-700',   dot: 'bg-blue-500'    },
  SHIPPED:   { label: 'Shipped',   rowBorder: 'border-purple-200',  badge: 'bg-purple-50 border-purple-300 text-purple-700', dot: 'bg-purple-500'  },
  DELIVERED: { label: 'Delivered', rowBorder: 'border-emerald-200', badge: 'bg-emerald-50 border-emerald-300 text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', rowBorder: 'border-red-200',     badge: 'bg-red-50    border-red-300    text-red-700',    dot: 'bg-red-500'     },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [verifying, setVerifying] = useState<string | null>(null)
  
  // Consistently named 'notes' to avoid errors
  const [notes, setNotes] = useState<Record<string, string>>({})
  
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setOrders(data)
    } catch {
      showToast('Failed to load orders', false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function verifyPayment(orderId: string, action: 'approve' | 'reject') {
    setVerifying(orderId + action)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          note: notes[orderId] || '' 
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Action failed')
      }

      const successMsg = action === 'approve' ? 'Build Locked & Email Sent' : 'Order Rejected'
      showToast(successMsg, true)

      await fetchOrders()
      setExpanded(null)
    } catch (e: any) {
      showToast(e.message || 'Failed to update order', false)
    } finally {
      setVerifying(null)
    }
  }

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'ALL' || o.status === filter
    const q = search.toLowerCase()
    return matchStatus && (
      !q || o.id.toLowerCase().includes(q) || o.user.email.toLowerCase().includes(q)
    )
  })

  const pendingCount = orders.filter(o => o.status === 'PENDING' && o.paymentScreenshot).length

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-[#17191d]">
      
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border-2 font-mono text-[10px] uppercase font-bold shadow-xl
              ${toast.ok ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-red-50 border-red-400 text-red-700'}`}>
            {toast.ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out">
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={lightbox} className="max-w-full max-h-full object-contain shadow-2xl border-4 border-white" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-[#17191d] text-[#e5f1ee] px-8 py-6 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[4px] text-[#d4604d] font-bold">TESSCH_SYSTEM</p>
            <h1 className="font-display text-3xl uppercase tracking-tighter leading-none mt-1">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400 px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="font-mono text-[9px] uppercase font-bold text-amber-400">{pendingCount} Action Required</p>
              </div>
            )}
            <button onClick={fetchOrders} disabled={loading} className="border border-white/20 px-4 py-2 font-mono text-[9px] uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stat Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {(['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as FilterStatus[]).map(s => {
            const count = s === 'ALL' ? orders.length : orders.filter(o => o.status === s).length
            return (
              <button key={s} onClick={() => setFilter(s)} className={`p-4 border-2 text-left transition-all ${filter === s ? 'border-[#17191d] bg-[#17191d] text-white' : 'border-[#17191d]/10 bg-white hover:border-[#17191d]/30'}`}>
                <p className="font-display text-3xl">{count}</p>
                <p className="font-mono text-[8px] uppercase opacity-50">{s.toLowerCase()}</p>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID or email..." className="w-full bg-white border-2 border-[#17191d]/10 p-4 pl-12 font-mono text-xs outline-none focus:border-[#d4604d]" />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map(order => {
            const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.PENDING
            const isExpanded = expanded === order.id
            return (
              <div key={order.id} className={`bg-white border-2 transition-all ${isExpanded ? 'border-[#17191d]' : 'border-[#17191d]/5 shadow-sm'}`}>
                <button className="w-full text-left px-6 py-5 flex items-center gap-4" onClick={() => setExpanded(isExpanded ? null : order.id)}>
                  <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <div className="flex-1">
                    <p className="font-mono text-[11px] font-bold uppercase">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="font-mono text-[8px] opacity-40">{order.user.email}</p>
                  </div>
                  <div className="shrink-0 text-right mr-4">
                    <p className="font-display text-2xl">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div className={`px-4 py-2 border font-mono text-[9px] font-bold uppercase ${cfg.badge}`}>{cfg.label}</div>
                  <ChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} size={18} />
                </button>

                {isExpanded && (
                  <div className="p-8 border-t border-[#17191d]/5 bg-[#fbfbf9] grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Items & Logistics */}
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-mono text-[10px] uppercase font-bold text-[#d4604d] tracking-[2px] mb-4">Build Queue</h4>
                        <div className="space-y-3">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 bg-white border border-[#17191d]/5 p-3">
                              <img src={item.variant.product.image} className="w-12 h-12 object-contain mix-blend-multiply" />
                              <div className="flex-1">
                                <p className="font-display text-base uppercase leading-tight">{item.variant.product.name}</p>
                                <p className="font-mono text-[8px] opacity-50 uppercase">{item.variant.size} · {item.productType} · Qty {item.quantity}</p>
                              </div>
                              <p className="font-mono text-xs font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#17191d]/5">
                        <div>
                          <h4 className="font-mono text-[9px] uppercase font-bold opacity-30 mb-2">Shipping To</h4>
                          <p className="font-mono text-[10px] leading-relaxed">
                            {order.address.line1}<br/>
                            {order.address.city}, {order.address.state} {order.address.postalCode}
                          </p>
                        </div>
                        {order.utrReference && (
                          <div>
                            <h4 className="font-mono text-[9px] uppercase font-bold opacity-30 mb-2">UTR Reference</h4>
                            <p className="font-mono text-[10px] font-bold">{order.utrReference}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Screenshot & Verification */}
                    <div className="space-y-6">
                      <h4 className="font-mono text-[10px] uppercase font-bold text-[#d4604d] tracking-[2px]">Verification</h4>
                      {order.paymentScreenshot ? (
                        <div className="space-y-4">
                          <div className="relative aspect-video bg-white border-2 border-[#17191d]/10 overflow-hidden group cursor-zoom-in" onClick={() => setLightbox(order.paymentScreenshot)}>
                            <img src={order.paymentScreenshot} className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Eye className="text-white" /></div>
                          </div>
                          
                          {order.status === 'PENDING' && (
                            <div className="space-y-4 pt-4 border-t border-[#17191d]/5">
                              <textarea placeholder="Reason for rejection or admin note..." className="w-full bg-white border-2 border-[#17191d]/10 p-4 font-mono text-[10px] outline-none focus:border-[#17191d] resize-none" rows={3} value={notes[order.id] || ''} onChange={(e) => setNotes({...notes, [order.id]: e.target.value})} />
                              <div className="grid grid-cols-2 gap-4">
                                <button disabled={!!verifying} onClick={() => verifyPayment(order.id, 'reject')} className="border-2 border-red-500 text-red-600 py-4 font-mono text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all">Reject</button>
                                <button disabled={!!verifying} onClick={() => verifyPayment(order.id, 'approve')} className="bg-emerald-600 text-white py-4 font-mono text-[10px] font-bold uppercase hover:bg-emerald-700 transition-all">Approve Build</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-20 border-2 border-dashed border-[#17191d]/10 flex flex-col items-center opacity-30">
                          <AlertTriangle size={20} />
                          <p className="font-mono text-[10px] mt-2 uppercase tracking-widest">No Proof Uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}