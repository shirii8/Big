'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface OrderItem {
  id: string
  quantity: number
  price: number
  productType: string
  variant: {
    size: string
    product: { name: string; image: string; category: string }
  }
}

interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

interface Order {
  id: string
  totalAmount: number
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentMethod: string
  couponCode?: string
  discountAmount: number
  createdAt: string
  address: Address
  items: OrderItem[]
}

const STATUS_STYLES: Record<Order['status'], string> = {
  PENDING:   'bg-amber-100 text-amber-700 border-amber-300',
  PAID:      'bg-blue-100 text-blue-700 border-blue-300',
  SHIPPED:   'bg-purple-100 text-purple-700 border-purple-300',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  CANCELLED: 'bg-red-100 text-red-700 border-red-300',
}

function estimatedDelivery(createdAt: string, status: Order['status']) {
  if (status === 'DELIVERED') return 'Delivered'
  if (status === 'CANCELLED') return 'Cancelled'
  const est = new Date(new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000)
  return `Est. ${est.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export default function OrdersPage() {
  const [orders, setOrders]     = useState<Order[]>([])
  const [loading, setLoading]   = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [error, setError]       = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.status === 401) { setError('Please sign in to view your orders.'); return }
      if (!res.ok) throw new Error('Failed')
      setOrders(await res.json())
    } catch {
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  if (loading) return (
    <div className="min-h-screen bg-[#e5f1ee] flex items-center justify-center">
      <p className="font-mono text-[11px] uppercase tracking-[3px] animate-pulse">Loading Orders...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#e5f1ee] pt-24 pb-20 px-6 md:px-12 text-[#17191d]">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-[clamp(40px,7vw,100px)] uppercase tracking-tighter leading-[0.85] mb-12">
          ORDER<br /><span className="text-[#d4604d]">HISTORY.</span>
        </h1>

        {error && (
          <div className="border-2 border-red-400 bg-red-50 p-4 font-mono text-[11px] text-red-700 mb-8">{error}</div>
        )}

        {orders.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Package size={48} className="opacity-20" />
            <p className="font-mono text-[11px] uppercase tracking-[3px] opacity-40">No orders yet</p>
            <Link href="/products" className="font-mono text-[10px] font-bold uppercase tracking-[3px] border-2 border-[#17191d] px-6 py-3 hover:bg-[#17191d] hover:text-white transition-colors">
              Start Shopping
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border-[3px] border-[#17191d] overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#f8fcfb] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-4 text-left">
                  <div>
                    <p className="font-mono text-[9px] uppercase opacity-40 tracking-[2px]">Order</p>
                    <p className="font-mono text-[11px] font-bold uppercase">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="w-px h-8 bg-[#17191d]/10 hidden md:block" />
                  <div>
                    <p className="font-mono text-[9px] uppercase opacity-40 tracking-[2px]">Placed</p>
                    <p className="font-mono text-[11px] font-bold">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-[#17191d]/10 hidden md:block" />
                  <div>
                    <p className="font-mono text-[9px] uppercase opacity-40 tracking-[2px]">Delivery</p>
                    <p className="font-mono text-[11px] font-bold text-[#d4604d]">
                      {estimatedDelivery(order.createdAt, order.status)}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-[#17191d]/10 hidden md:block" />
                  <span className={`font-mono text-[9px] font-bold uppercase tracking-[2px] px-3 py-1 border ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-mono text-[9px] uppercase opacity-40">
                    {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-display text-2xl">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              <AnimatePresence>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t-[3px] border-[#17191d]"
                  >
                    <div className="p-6 space-y-4 bg-[#f8fcfb]">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 bg-white border-2 border-[#17191d]/10 p-4">
                          <img
                            src={item.variant?.product?.image ?? ''}
                            alt=""
                            className="w-14 h-14 object-contain mix-blend-multiply"
                          />
                          <div className="flex-1">
                            <p className="font-display text-lg uppercase tracking-tighter">
                              {item.variant?.product?.name ?? 'Product'}
                            </p>
                            <p className="font-mono text-[9px] uppercase opacity-50">
                              Size: {item.variant?.size} · Qty: {item.quantity} · {item.productType === 'build' ? 'Full Build' : 'Upper Only'}
                            </p>
                          </div>
                          <p className="font-display text-xl">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      ))}

                      {order.discountAmount > 0 && (
                        <div className="flex justify-between font-mono text-[10px] uppercase text-emerald-600 px-1">
                          <span>Coupon ({order.couponCode})</span>
                          <span>−₹{order.discountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      <div className="border-t-2 border-[#17191d]/10 pt-4">
                        <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40 mb-2">Delivery Address</p>
                        <p className="font-mono text-[10px] leading-relaxed">
                          {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
                          {order.address.city}, {order.address.state} — {order.address.postalCode}<br />
                          {order.address.country}{order.address.phone ? ` · ${order.address.phone}` : ''}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}