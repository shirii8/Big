'use client'

import { useState } from 'react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Package, Settings, ShieldCheck, LogOut } from 'lucide-react'

// Mock order history — replace with real DB calls later
const MOCK_ORDERS = [
  {
    id: 'ORD-001-TSC',
    date: '28 Mar 2026',
    status: 'Dispatched',
    items: [{ name: 'NEON VAPOR', type: 'Full Build + CLOUD RUNNER', size: 'UK 9', price: '₹9,600' }],
    total: '₹9,899',
  },
  {
    id: 'ORD-002-TSC',
    date: '31 Mar 2026',
    status: 'Processing',
    items: [
      { name: 'CARBON SHIELD', type: 'Upper Only', size: 'UK 10', price: '₹8,200' },
      { name: 'GHOST WHITE', type: 'Full Build + ZERO-G', size: 'UK 10', price: '₹9,100' },
    ],
    total: '₹17,599',
  },
]

const STATUS_COLOR: Record<string, string> = {
  Dispatched: 'text-green-400',
  Processing: 'text-[#d4604d]',
  Delivered: 'text-[#e5f1ee]/40',
}

type Tab = 'profile' | 'orders' | 'settings'

export default function ProfilePage() {
  const { user, isLoading } = useKindeBrowserClient()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({ phone: '', address: '', city: '', pin: '' })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#17191d] flex items-center justify-center">
        <p className="font-mono text-[#e5f1ee] text-[11px] uppercase tracking-[4px] animate-pulse">Loading session...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#17191d] flex items-center justify-center text-[#e5f1ee]">
        <p className="font-mono text-[11px] uppercase tracking-[4px]">No active session. Please sign in.</p>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={13} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={13} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={13} /> },
  ]

  return (
    <div className="min-h-screen bg-[#17191d] text-[#e5f1ee] pt-24 pb-20">

      {/* ── TOP HEADER BAR ── */}
      <div className="px-6 md:px-12 border-b border-[#e5f1ee]/10 pb-8 mb-10">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-[#d4604d] flex items-center justify-center font-display text-3xl text-white border-4 border-[#e5f1ee]/10">
              {user.given_name?.[0]?.toUpperCase() ?? 'T'}
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-1">Verified Member</p>
              <h1 className="font-display text-4xl uppercase leading-none">
                {user.given_name} {user.family_name}
              </h1>
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
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 font-mono text-[9px] uppercase tracking-[3px] px-6 py-3 border-r-2 border-[#e5f1ee]/10 last:border-r-0 transition-colors ${activeTab === tab.id ? 'bg-[#d4604d] text-white' : 'hover:bg-[#e5f1ee]/5'}`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-8">
              
              {/* Identity */}
              <div className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 p-8">
                <div className="flex justify-between items-center mb-6">
                  <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold">Identity</p>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="font-mono text-[9px] uppercase tracking-[2px] border border-[#e5f1ee]/20 px-4 py-2 hover:bg-[#e5f1ee]/10 transition-colors"
                  >
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', value: user.given_name ?? '—' },
                    { label: 'Last Name', value: user.family_name ?? '—' },
                    { label: 'Email', value: user.email ?? '—' },
                    { label: 'Kinde ID', value: user.id?.slice(0, 20) + '...' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-2">{label}</p>
                      <p className="font-mono text-[12px] font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 p-8">
                <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-6">Saved Address</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Phone', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
                    { label: 'City', key: 'city', placeholder: 'City' },
                    { label: 'Address', key: 'address', placeholder: 'Street, Building' },
                    { label: 'PIN Code', key: 'pin', placeholder: '6-digit PIN' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 block mb-2">{label}</label>
                      {editMode ? (
                        <input
                          value={profileData[key as keyof typeof profileData]}
                          onChange={e => setProfileData(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-[#17191d] border border-[#e5f1ee]/20 font-mono text-[11px] text-[#e5f1ee] px-4 py-3 focus:outline-none focus:border-[#d4604d] placeholder:opacity-20 transition-colors"
                        />
                      ) : (
                        <p className="font-mono text-[12px] font-bold opacity-80">{profileData[key as keyof typeof profileData] || '—'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold">Order History</p>

              {MOCK_ORDERS.length === 0 ? (
                <div className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 p-12 text-center">
                  <p className="font-mono text-[11px] uppercase tracking-[3px] opacity-40">No orders yet. Start building.</p>
                </div>
              ) : (
                MOCK_ORDERS.map(order => (
                  <div key={order.id} className="bg-[#e5f1ee]/5 border border-[#e5f1ee]/10 overflow-hidden">
                    {/* Order header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5f1ee]/10">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="font-mono text-[9px] opacity-40 uppercase">Order ID</p>
                          <p className="font-mono text-[11px] font-bold">{order.id}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] opacity-40 uppercase">Date</p>
                          <p className="font-mono text-[11px]">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono text-[10px] font-bold uppercase ${STATUS_COLOR[order.status] ?? ''}`}>● {order.status}</p>
                        <p className="font-display text-2xl">{order.total}</p>
                      </div>
                    </div>

                    {/* Order items */}
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-[#e5f1ee]/5 last:border-b-0">
                        <div>
                          <p className="font-mono text-[11px] font-bold uppercase">{item.name}</p>
                          <p className="font-mono text-[9px] opacity-40 uppercase">{item.type} · {item.size}</p>
                        </div>
                        <p className="font-mono text-[11px]">{item.price}</p>
                      </div>
                    ))}
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
                  { label: 'Email Notifications', desc: 'Drop alerts, dispatch updates', enabled: true },
                  { label: 'Early Access', desc: 'Get notified before public drops', enabled: true },
                  { label: 'Marketing Emails', desc: 'Occasional news from TESSCH', enabled: false },
                ].map(({ label, desc, enabled }) => (
                  <div key={label} className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="font-mono text-[11px] font-bold uppercase">{label}</p>
                      <p className="font-mono text-[9px] opacity-40 mt-0.5">{desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-[#d4604d]' : 'bg-[#e5f1ee]/20'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Danger zone */}
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