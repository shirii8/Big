import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// ─── GET — fetch current user's cart ─────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cart = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  })
  return NextResponse.json(cart)
}

// ─── POST — add item to cart ──────────────────────────────────────────────────
// Body schema:
//   productId   string   — DB product ID
//   size        string   — e.g. "UK 9"
//   qty         number   — units to add (default 1)
//   productType string   — "upper" | "sneaker"
//
// "upper"   → a lone upper skin; no sole included.
// "sneaker" → a complete pair (upper + sole bundle); single DB product that
//             represents the composite.  Priced and stocked as one unit.
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { productId, size, qty = 1, productType } = body as {
      productId: string
      size: string
      qty?: number
      productType: 'upper' | 'sneaker'
    }

    // ── Validate required fields ──────────────────────────────────────────────
    if (!productId || !size || !productType) {
      return NextResponse.json(
        { error: 'productId, size, and productType are required' },
        { status: 400 }
      )
    }

    if (!['upper', 'sneaker'].includes(productType)) {
      return NextResponse.json(
        { error: 'productType must be "upper" or "sneaker"' },
        { status: 400 }
      )
    }

    // ── Stock check ───────────────────────────────────────────────────────────
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    if (product.stock < qty) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // ── Upsert cart item ──────────────────────────────────────────────────────
    // Composite unique key: userId + productId + size + productType
    // This means an "upper" and a "sneaker" of the same product ID are stored
    // as separate line items, which is intentional — they represent different
    // fulfilment units.
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId_size_productType: {
          userId: session.user.id,
          productId,
          size,
          productType,
        },
      },
      update: {
        qty: { increment: qty },
      },
      create: {
        userId: session.user.id,
        productId,
        size,
        qty,
        productType,
      },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('[cart POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}