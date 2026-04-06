'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type ItemType = 'build' | 'upper-only'

export interface CartItem {
  id: string
  type: ItemType
  upper: {
    id: string
    name: string
    price: number
    image: string
    category: string
  }
  sole?: {
    id: string
    name: string
    price: number
    image: string
    type: string
  }
  size: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemType: (id: string, type: ItemType) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id && i.size === item.size && i.type === item.type)
      if (exists) return prev.map(i => i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateItemType = useCallback((id: string, type: ItemType) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, type } : i))
  }, [])

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => {
    const price = i.type === 'build' ? (i.upper.price + (i.sole?.price ?? 0)) : i.upper.price
    return s + price * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItemType, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}