import type { User, Order, OrderItem, Product, CartItem, Session } from '@prisma/client'

// ─── Auth ────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  age?: number | null;
  teamId? : string;
  team?: Team;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description? : string| null;
  code: string;
  members: User[];
  email: string;
  phone?: string | null;
  age?: number | null;
   createdAt: Date;
  updatedAt: Date;
}

export interface SessionPayload {
  userId: string
  sessionId: string
  email: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  phone?: string
  age?: number
}

// ─── Cart ────────────────────────────────────────────────────────────────
export type CartItemWithProduct = CartItem & {
  product: Product
}

export interface CartSummary {
  items: CartItemWithProduct[]
  subtotal: number
  itemCount: number
}

// ─── Order ───────────────────────────────────────────────────────────────
export type OrderWithItems = Order & {
  items: OrderItem[]
}

export interface CheckoutInput {
  // Shipping
  name: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country?: string
}

// ─── API Responses ───────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ─── Product ─────────────────────────────────────────────────────────────
export type ProductWithStock = Product & {
  inStock: boolean
}