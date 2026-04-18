'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, XCircle, Clock, Search, RefreshCw,
  ChevronDown, ChevronUp, Loader2,
  Package, AlertTriangle, Eye
} from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  productType: string
  variant: {
    size: string
    product: { name: string; image: string }
  }
}

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
  updatedAt: string
  user: {
    email: string
    firstName: string | null
    lastName: string | null
  }
  address: {
    line1: string
    line2?: string | null
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string | null
  }
  items: OrderItem[]
}

type FilterStatus = 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED' | 'SHIPPED'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  PENDING:   { label: 'Pending',   color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500'  },
  PAID:      { label: 'Paid',      color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  SHIPPED:   { label: 'Shipped',   color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600',     bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState<Record<string, string>>({})
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
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
      showToast('Failed to load orders', 'err')
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
        body: JSON.stringify({ action, note: noteInput[orderId] ?? '' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      
      showToast(action === 'approve' ? 'Payment Approved' : 'Payment Rejected', action === 'approve' ? 'ok' : 'err')
      fetchOrders()
    } catch (e: any) {
      showToast(e.message, 'err')
    } finally {
      setVerifying(null)
    }
  }

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'ALL' || o.status === filter
    const matchSearch = !search || 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const pendingCount = orders.filter(o => o.status === 'PENDING' && o.paymentScreenshot).length

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-[#17191d] pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border-2 font-mono text-[10px] uppercase font-bold shadow-xl ${
              toast.type === 'ok' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-red-50 border-red-400 text-red-700'
            }`}
          >
            {toast.type === 'ok' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screenshot Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              src={lightbox} 
              className="max-w-full max-h-full object-contain border-4 border-white" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-[#17191d] text-white px-8 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <p className="font-mono text-[10px] text-[#d4604d] tracking-[4px] uppercase font-bold">System_Admin</p>
            <h1 className="font-display text-5xl uppercase tracking-tighter">Orders Archive</h1>
          </div>
          <div className="flex gap-4">
            {pendingCount > 0 && (
              <div className="bg-amber-500/20 border border-amber-500 px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-amber-500 uppercase">{pendingCount} Action Required</span>
              </div>
            )}
            <button onClick={fetchOrders} className="border border-white/20 px-4 py-2 font-mono text-[10px] uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-10 space-y-6">
        {/* Filters */}
        <div className="flex gap-2 border-b border-[#17191d]/10 pb-6 overflow-x-auto">
          {(['ALL', 'PENDING', 'PAID', 'SHIPPED', 'CANCELLED'] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-3 font-mono text-[10px] uppercase tracking-widest border-2 transition-all ${
                filter === s ? 'bg-[#17191d] text-white border-[#17191d]' : 'bg-white border-[#17191d]/10 hover:border-[#17191d]'
              }`}
            >
              {s} ({s === 'ALL' ? orders.length : orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
          <input 
            type="text" 
            placeholder="Search by ID or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-2 border-[#17191d]/10 p-4 pl-12 font-mono text-xs outline-none focus:border-[#d4604d]"
          />
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            const isExpanded = expanded === order.id;

            return (
              <div key={order.id} className={`bg-white border-2 transition-all ${order.paymentScreenshot && order.status === 'PENDING' ? 'border-amber-400 shadow-lg' : 'border-[#17191d]/5'}`}>
                <div 
                  className="p-6 flex items-center gap-6 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <div className="flex-1">
                    <p className="font-mono text-[10px] opacity-40 uppercase">Order ID</p>
                    <p className="font-mono text-sm font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-[10px] opacity-40 uppercase">Customer</p>
                    <p className="font-mono text-sm font-bold">{order.user.email}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-mono text-[10px] opacity-40 uppercase">Total</p>
                    <p className="font-display text-xl">₹{order.totalAmount}</p>
                  </div>
                  <div className={`px-4 py-2 border font-mono text-[10px] font-bold uppercase ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </div>
                  <ChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={20} />
                </div>

                {isExpanded && (
                  <div className="p-8 border-t-2 border-[#17191d]/5 grid grid-cols-2 gap-12 bg-[#fbfbf9]">
                    {/* Left: Info */}
                    <div className="space-y-6">
                       <div>
                        <h4 className="font-mono text-[10px] uppercase font-bold text-[#d4604d] mb-4">Logistics</h4>
                        <p className="font-mono text-xs leading-relaxed">
                          {order.address.line1}<br />
                          {order.address.city}, {order.address.state} {order.address.postalCode}<br />
                          Phone: {order.address.phone}
                        </p>
                       </div>
                       
                       <div>
                        <h4 className="font-mono text-[10px] uppercase font-bold text-[#d4604d] mb-4">Build Queue</h4>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between font-mono text-xs border-b border-[#17191d]/5 py-2">
                            <span>{item.variant.product.name} ({item.variant.size}) x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                       </div>
                    </div>

                    {/* Right: Verification */}
                    <div className="space-y-6">
                      <h4 className="font-mono text-[10px] uppercase font-bold text-[#d4604d]">Payment Proof</h4>
                      {order.paymentScreenshot ? (
                        <div className="space-y-4">
                          <div 
                            className="relative aspect-video bg-white border-2 border-[#17191d]/10 overflow-hidden group cursor-zoom-in"
                            onClick={() => setLightbox(order.paymentScreenshot)}
                          >
                            <img src={order.paymentScreenshot} className="w-full h-full object-contain p-2" alt="Proof" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Eye className="text-white" />
                            </div>
                          </div>
                          
                          {order.status === 'PENDING' && (
                            <div className="space-y-4">
                              <textarea 
                                placeholder="Admin Notes (optional)..."
                                className="w-full bg-white border-2 border-[#17191d]/10 p-3 font-mono text-[10px] outline-none focus:border-[#17191d]"
                                value={noteInput[order.id] || ''}
                                onChange={(e) => setNoteInput({...noteInput, [order.id]: e.target.value})}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <button 
                                  disabled={!!verifying}
                                  onClick={() => verifyPayment(order.id, 'reject')}
                                  className="border-2 border-red-500 text-red-500 py-3 font-mono text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all"
                                >
                                  Reject
                                </button>
                                <button 
                                  disabled={!!verifying}
                                  onClick={() => verifyPayment(order.id, 'approve')}
                                  className="bg-emerald-600 text-white py-3 font-mono text-[10px] font-bold uppercase hover:bg-emerald-700 transition-all"
                                >
                                  Approve Payment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-12 border-2 border-dashed border-[#17191d]/10 flex flex-col items-center opacity-30">
                          <AlertTriangle />
                          <p className="font-mono text-[10px] mt-2">No Screenshot Found</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}