
import { NextResponse } from 'next/server'
import {prisma} from '@/lib/db'                               
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]  // ← no @prisma/client needed

type CartItemInput = {
  upper: { id: string; price: number }
  sole?: { price: number }
  size: string
  quantity: number
  type: 'build' | 'upper-only'
}

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      addressId, items, totalAmount, couponCode, discountAmount, paymentMethod,
    }: {
      addressId: string
      items: CartItemInput[]
      totalAmount: number
      couponCode?: string | null
      discountAmount?: number
      paymentMethod?: string
    } = await req.json()

    if (!addressId || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const address = await prisma.address.findUnique({ where: { id: addressId } })
    if (!address || address.userId !== user.id) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    const resolvedItems = await Promise.all(
      items.map(async (item: CartItemInput) => {
        const variant = await prisma.productVariant.findUnique({
          where: { productId_size: { productId: item.upper.id, size: item.size } },
        })
        const unitPrice = item.type === 'build'
          ? item.upper.price + (item.sole?.price ?? 1299)
          : item.upper.price
        return {
          variant,
          quantity: item.quantity,
          price: unitPrice,
          productType: item.type === 'build' ? 'build' : 'upper',
        }
      })
    )

    const order = await prisma.$transaction(async (tx: TxClient) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          addressId,
          couponCode: couponCode ?? null,
          discountAmount: discountAmount ?? 0,
          paymentMethod: paymentMethod ?? 'upi',
          status: 'PENDING',
          items: {
            create: resolvedItems
              .filter((i): i is typeof i & { variant: NonNullable<typeof i.variant> } => i.variant !== null)
              .map(i => ({
                variantId: i.variant.id,
                quantity: i.quantity,
                price: i.price,
                productType: i.productType,
              })),
          },
        },
      })

      for (const i of resolvedItems) {
        if (i.variant) {
          await tx.productVariant.update({
            where: { id: i.variant.id },
            data: { stock: { decrement: i.quantity } },
          })
        }
      }

      return newOrder
    })

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (e) {
    console.error('[create-session]', e)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
// import { NextRequest, NextResponse } from 'next/server'
// import { razorpay } from '@/lib/razorpay'
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
// import { prisma } from "@/lib/db"

// export async function POST(req: NextRequest) {
//   const { getUser } = getKindeServerSession()
//   const user = await getUser()
  
//   if (!user?.id) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     const {
//       totalAmount,
//       addressId,
//       couponCode,
//       discountAmount,
//     } = await req.json()

//     // 1. Validation
//     if (!totalAmount || totalAmount < 1) {
//       return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
//     }

//     // 2. Razorpay Order Creation
//     // We use .orders.create (Smallest currency unit: paise)
//     const order = await razorpay.orders.create({
//       amount: Math.round(totalAmount * 100), 
//       currency: 'INR',
//       receipt: `receipt_${Date.now()}`,
//       // Razorpay uses 'notes' for custom metadata/metadata
//       notes: {
//         userId: user.id,
//         addressId: addressId || '',
//         couponCode: couponCode || '',
//         discountAmount: String(discountAmount || 0),
//       },
//     })

//     // 3. Return the Order ID and details
//     // Your frontend will use 'id' to initialize the Razorpay Checkout modal
//     return NextResponse.json({ 
//       id: order.id, 
//       amount: order.amount, 
//       currency: order.currency 
//     })

//   } catch (error) {
//     console.error('[razorpay create-order error]', error)
//     return NextResponse.json(
//       { error: 'Failed to initiate payment' }, 
//       { status: 500 }
//     )
//   }
// }