'use client'

import { useState, useEffect, useCallback } from 'react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Package, Settings, ShieldCheck, LogOut, ChevronDown, ChevronUp } from 'lucide-react'

interface OrderItem {
  id: string; quantity: number; price: number; productType: string
  variant: { size: string; product: { name: string; image: string } }
}
interface Address {
  id: string; line1: string; line2?: string; city: string
  state: string; postalCode: string; country: string; phone?: string
}
interface Order {
  id: string; totalAmount: number; status: string; paymentMethod: string
  couponCode?: string; discountAmount: number; createdAt: string
  address: Address; items: OrderItem[]
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-amber-400', PAID: 'text-blue-400',
  SHIPPED: 'text-purple-400', DELIVERED: 'text-green-400', CANCELLED: 'text-red-400',
}
const STATUS_DOT: Record<string, string> = {
  PENDING: '●', PAID: '●', SHIPPED: '●', DELIVERED: '●', CANCELLED: '●',
}

type Tab = 'profile' | 'orders' | 'settings'

export default function ProfilePage() {
  const { user, isLoading } = useKindeBrowserClient()
  const [activeTab, setActiveTab]     = useState<Tab>('profile')
  const [orders, setOrders]           = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [addresses, setAddresses]     = useState<Address[]>([])
  const [editMode, setEditMode]       = useState(false)
  const [saving, setSaving]           = useState(false)
  const [settings, setSettings]       = useState({
    emailNotifications: true, earlyAccess: true, marketingEmails: false,
  })

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const res = await fetch('/api/orders')
      if (res.ok) setOrders(await res.json())
    } finally { setOrdersLoading(false) }
  }, [])

  const fetchAddresses = useCallback(async () => {
    const res = await fetch('/api/address')
    if (res.ok) setAddresses(await res.json())
  }, [])

  useEffect(() => {
    if (user) { fetchOrders(); fetchAddresses() }
  }, [user, fetchOrders, fetchAddresses])

  function estimatedDelivery(createdAt: string, status: string) {
    if (status === 'DELIVERED') return 'Delivered'
    if (status === 'CANCELLED') return 'Cancelled'
    const est = new Date(new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000)
    return `Est. ${est.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
  }

  if (isLoading) return (
    <div className="min-h-screen bg-[#17191d] flex items-center justify-center">
      <p className="font-mono text-[#e5f1ee] text-[11px] uppercase tracking-[4px] animate-pulse">Loading session...</p>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen bg-[#17191d] flex items-center justify-center text-[#e5f1ee]">
      <p className="font-mono text-[11px] uppercase tracking-[4px]">No active session. Please sign in.</p>
    </div>
  )

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={13} /> },
    { id: 'orders',  label: 'Orders',  icon: <Package size={13} /> },
    { id: 'settings',label: 'Settings',icon: <Settings size={13} /> },
  ]

  return (
    <div className="min-h-screen bg-[#17191d] text-[#e5f1ee] pt-24 pb-20">

      {/* Header */}
      <div className="px-6 md:px-12 border-b border-[#e5f1ee]/10 pb-8 mb-10">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#d4604d] flex items-center justify-center font-display text-3xl text-white border-4 border-[#e5f1ee]/10">
              {user.given_name?.[0]?.toUpperCase() ?? 'T'}
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-1">Verified Member</p>
              <h1 className="font-display text-4xl uppercase leading-none">{user.given_name} {user.family_name}</h1>
              <p className="font-mono text-[10px] opacity-40 mt-1 uppercase">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={12} className="text-[#d4604d]" />
            <span className="font-mono text-[9px] uppercase tracking-[2px] opacity-60">ID: {user.id?.slice(0, 12)}...</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Tabs */}
        <div className="flex gap-0 border-2 border-[#e5f1ee]/10 mb-10 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 font-mono text-[9px] uppercase tracking-[3px] px-6 py-3 border-r-2 border-[#e5f1ee]/10 last:border-r-0 transition-colors ${activeTab === tab.id ? 'bg-[#d4604d] text-white' : 'hover:bg-[#e5f1ee]/5'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-8">
              <div className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 p-8">
                <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-6">Identity</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', value: user.given_name ?? '—' },
                    { label: 'Last Name',  value: user.family_name ?? '—' },
                    { label: 'Email',      value: user.email ?? '—' },
                    { label: 'Member ID',  value: user.id?.slice(0, 16) + '...' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-2">{label}</p>
                      <p className="font-mono text-[12px] font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 p-8">
                <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-6">Saved Addresses</p>
                {addresses.length === 0 ? (
                  <p className="font-mono text-[10px] opacity-40 uppercase">No addresses saved. Add one at checkout.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="border border-[#e5f1ee]/10 p-4">
                        <p className="font-mono text-[11px] font-bold">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="font-mono text-[10px] opacity-60">{addr.city}, {addr.state} — {addr.postalCode}, {addr.country}</p>
                        {addr.phone && <p className="font-mono text-[10px] opacity-60">{addr.phone}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold">Order History</p>

              {ordersLoading ? (
                <p className="font-mono text-[11px] uppercase tracking-[3px] opacity-40 animate-pulse">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 p-12 text-center">
                  <p className="font-mono text-[11px] uppercase tracking-[3px] opacity-40">No orders yet. Start building.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 overflow-hidden">
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="w-full flex items-center justify-between px-6 py-4 border-b border-[#e5f1ee]/10 hover:bg-[#e5f1ee]/5 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-6 text-left">
                        <div>
                          <p className="font-mono text-[9px] opacity-40 uppercase tracking-[2px]">Order ID</p>
                          <p className="font-mono text-[11px] font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] opacity-40 uppercase tracking-[2px]">Date</p>
                          <p className="font-mono text-[11px]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] opacity-40 uppercase tracking-[2px]">Delivery</p>
                          <p className="font-mono text-[10px] text-[#d4604d] font-bold">{estimatedDelivery(order.createdAt, order.status)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-mono text-[10px] font-bold uppercase ${STATUS_COLOR[order.status] ?? ''}`}>
                            {STATUS_DOT[order.status]} {order.status}
                          </p>
                          <p className="font-display text-2xl">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                        {expandedOrderId === order.id ? <ChevronUp size={14} className="opacity-40" /> : <ChevronDown size={14} className="opacity-40" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedOrderId === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between px-6 py-4 border-b border-[#e5f1ee]/5 last:border-b-0">
                              <div className="flex items-center gap-3">
                                <img src={item.variant?.product?.image ?? ''} alt="" className="w-10 h-10 object-contain mix-blend-multiply opacity-80" />
                                <div>
                                  <p className="font-mono text-[11px] font-bold uppercase">{item.variant?.product?.name ?? 'Product'}</p>
                                  <p className="font-mono text-[9px] opacity-40 uppercase">
                                    {item.productType === 'build' ? 'Full Build' : 'Upper Only'} · {item.variant?.size} · Qty {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-mono text-[11px]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                          ))}
                          <div className="px-6 py-4 border-t border-[#e5f1ee]/10 bg-[#e5f1ee]/5">
                            <p className="font-mono text-[9px] opacity-40 uppercase tracking-[2px] mb-1">Delivering To</p>
                            <p className="font-mono text-[10px]">
                              {order.address?.line1}, {order.address?.city}, {order.address?.state} — {order.address?.postalCode}
                            </p>
                            {order.address?.phone && (
                              <p className="font-mono text-[10px] opacity-60">{order.address.phone}</p>
                            )}
                            <p className="font-mono text-[9px] opacity-40 uppercase mt-2">
                              Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold">Account Settings</p>

              <div className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 divide-y divide-[#e5f1ee]/10">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Drop alerts, dispatch updates' },
                  { key: 'earlyAccess',        label: 'Early Access',        desc: 'Get notified before public drops' },
                  { key: 'marketingEmails',    label: 'Marketing Emails',    desc: 'Occasional news from TESSCH' },
                ].map(({ key, label, desc }) => {
                  const enabled = settings[key as keyof typeof settings]
                  return (
                    <div key={key} className="flex items-center justify-between px-6 py-5">
                      <div>
                        <p className="font-mono text-[11px] font-bold uppercase">{label}</p>
                        <p className="font-mono text-[9px] opacity-40 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }))}
                        className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-[#d4604d]' : 'bg-[#e5f1ee]/20'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="bg-[#e5f1ee]/5 border border-[#d4604d]/30 p-6">
                <p className="font-mono text-[9px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-4">Danger Zone</p>
                <LogoutLink postLogoutRedirectURL="/">
                  <button className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[2px] border-2 border-[#d4604d] text-[#d4604d] px-6 py-3 hover:bg-[#d4604d] hover:text-white transition-colors">
                    <LogOut size={12} /> Terminate Session
                  </button>
                </LogoutLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}