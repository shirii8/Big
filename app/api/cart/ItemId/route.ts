import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const cart = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true }
  })
  return NextResponse.json(cart)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { productId, size, qty } = await req.json()

  const item = await prisma.cartItem.create({
    data: {
      userId: session.user.id,
      productId,
      size,
      qty: qty || 1
    }
  })
  return NextResponse.json(item)
}