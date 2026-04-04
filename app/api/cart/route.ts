import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { productId, size, qty } = await req.json()

    // Industry Grade: Verify stock before adding
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product || product.stock < qty) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { 
        // Unique constraint logic here
        id: `${session.user.id}-${productId}-${size}` 
      },
      update: { qty: { increment: qty } },
      create: {
        userId: session.user.id,
        productId,
        size,
        qty
      }
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}