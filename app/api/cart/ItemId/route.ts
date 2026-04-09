import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function PATCH(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { quantity, productType } = await req.json()

  try {
    const updated = await prisma.cartItem.update({
      where: { id: params.itemId, userId: user.id },
      data: {
        ...(quantity !== undefined && { quantity }),
        ...(productType !== undefined && { productType }),
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[cart PATCH]", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    await prisma.cartItem.delete({
      where: { id: params.itemId, userId: user.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[cart DELETE]", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}