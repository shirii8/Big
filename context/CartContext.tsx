'use client'

import {
  createContext, useContext, useEffect,
  useState, useCallback, ReactNode
} from 'react'

export type ItemType = 'build' | 'upper-only'

export interface UpperItem {
  id: string
  name: string
  category: string
  price: number
  image: string
}

export interface SoleItem {
  id: string
  name: string
  price: number
  image: string
}

export interface CartItem {
  id: string
  upper: UpperItem
  sole?: SoleItem
  size: string
  quantity: number
  type: ItemType
}

interface CartContextValue {
  items: CartItem[]
  addItem: (upper: UpperItem, size: string, type?: ItemType, sole?: SoleItem) => void
  removeItem: (id: string) => void
  updateItemType: (id: string, type: ItemType) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  totalItems: number
  loading: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'tessch_cart_v2'

const DEFAULT_SOLE: SoleItem = {
  id: 'sole-default',
  name: 'CLOUD RUNNER',
  price: 3200,
  image: 'https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775151261/WhatsApp_Image_2026-04-01_at_02.28.39_1_bqptrs.jpg',
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  // Persist on every change
  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loading])

  // Best-effort API sync — never blocks the UI
  const syncAdd = useCallback(async (upper: UpperItem, size: string, type: ItemType) => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: `${upper.id}_${size}`,
          quantity: 1,
          productType: type === 'build' ? 'build' : 'upper',
        }),
      })
    } catch { /* silently ignore */ }
  }, [])

  const addItem = useCallback((
    upper: UpperItem,
    size: string,
    type: ItemType = 'upper-only',
    sole?: SoleItem
  ) => {
    const cartId = `${upper.id}_${size}`
    setItems(prev => {
      const existing = prev.find(i => i.id === cartId)
      if (existing) {
        return prev.map(i =>
          i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, {
        id: cartId,
        upper,
        sole: sole ?? (type === 'build' ? DEFAULT_SOLE : undefined),
        size,
        quantity: 1,
        type,
      }]
    })
    syncAdd(upper, size, type)
  }, [syncAdd])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    fetch(`/api/cart/${id}`, { method: 'DELETE' }).catch(() => {})
  }, [])

  const updateItemType = useCallback((id: string, type: ItemType) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i
      return {
        ...i,
        type,
        sole: type === 'build' ? (i.sole ?? DEFAULT_SOLE) : undefined,
      }
    }))
    fetch(`/api/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productType: type === 'build' ? 'build' : 'upper' }),
    }).catch(() => {})
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) { removeItem(id); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
    fetch(`/api/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    }).catch(() => {})
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const subtotal = items.reduce((sum, item) => {
    const base = item.upper.price * item.quantity
    const sole = item.type === 'build' ? (item.sole?.price ?? 0) * item.quantity : 0
    return sum + base + sole
  }, 0)

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateItemType,
      updateQuantity, clearCart, subtotal, totalItems, loading,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}