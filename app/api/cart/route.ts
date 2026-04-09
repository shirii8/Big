import { NextResponse } from "next/server"
import {prisma} from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function GET() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const cart = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { variant: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(cart)
}

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { variantId, quantity = 1, productType = "upper" } = body as {
      variantId: string
      quantity?: number
      productType?: string
    }

    if (!variantId) {
      return NextResponse.json({ error: "variantId is required" }, { status: 400 })
    }

    // Normalise: accept 'upper-only' from context, store as 'upper'
    const normalisedType = productType === "upper-only" ? "upper" : productType
    if (!["upper", "build"].includes(normalisedType)) {
      return NextResponse.json(
        { error: 'productType must be "upper" or "build"' },
        { status: 400 }
      )
    }

    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } })
    if (!variant) {
      // Variant not in DB yet (static IDs) — return a soft success so the
      // client-side cart (localStorage) still works without crashing
      return NextResponse.json({ ok: true, skipped: true }, { status: 200 })
    }

    if (variant.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { userId_variantId: { userId: user.id, variantId } },
      update: { quantity: { increment: quantity }, productType: normalisedType },
      create: { userId: user.id, variantId, quantity, productType: normalisedType },
    })
    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("[cart POST]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}