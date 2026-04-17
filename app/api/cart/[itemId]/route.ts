import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

type RouteContext = {
  params: Promise<{ itemId: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { itemId } = await params
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { quantity, productType } = await req.json()
    
    // Normalise productType to match your DB schema if necessary
    const normalisedType = productType === "upper-only" ? "upper" : productType

    const updated = await prisma.cartItem.update({
      where: { id: itemId, userId: user.id },
      data: {
        ...(quantity !== undefined && { quantity }),
        ...(productType !== undefined && { productType: normalisedType }),
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[cart PATCH]", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { itemId } = await params
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    await prisma.cartItem.delete({
      where: { id: itemId, userId: user.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[cart DELETE]", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

// // Define the context type for Next.js 16 dynamic routes
// type RouteContext = {
//   params: Promise<{ itemId: string }>
// }

// export async function PATCH(
//   req: NextRequest,
//   context: RouteContext
// ) {
//   // 1. Await the params to get the itemId
//   const { itemId } = await context.params
  
//   const { getUser } = getKindeServerSession()
//   const user = await getUser()
  
//   if (!user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const { quantity, productType } = await req.json()

//     const updated = await prisma.cartItem.update({
//       // 2. Use the awaited itemId
//       where: { id: itemId, userId: user.id },
//       data: {
//         ...(quantity !== undefined && { quantity }),
//         ...(productType !== undefined && { productType }),
//       },
//     })
//     return NextResponse.json(updated)
//   } catch (error) {
//     console.error("[cart PATCH]", error)
//     return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   context: RouteContext
// ) {
//   // 3. Await the params here as well
//   const { itemId } = await context.params

//   const { getUser } = getKindeServerSession()
//   const user = await getUser()
  
//   if (!user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     await prisma.cartItem.delete({
//       // 4. Use the awaited itemId
//       where: { id: itemId, userId: user.id },
//     })
//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("[cart DELETE]", error)
//     return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
//   }
// }