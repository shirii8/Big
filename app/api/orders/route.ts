import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/db"
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { sendOrderConfirmation, sendOwnerAlert } from '@/lib/mailer'

export async function GET() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: { include: { variant: { include: { product: true } } } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      addressId, items, totalAmount,
      couponCode, discountAmount, paymentMethod, razorpayOrderId,
    } = await req.json()

    if (!addressId || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const address = await prisma.address.findUnique({ where: { id: addressId } })
    if (!address || address.userId !== user.id) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    const resolvedItems = await Promise.all(
      items.map(async (item: any) => {
        const variant = await prisma.productVariant.findUnique({
          where: { productId_size: { productId: item.upper.id, size: item.size } },
        })
        const unitPrice =
          item.type === 'build'
            ? item.upper.price + (item.sole?.price ?? 3200)
            : item.upper.price
        return { 
          variant, 
          quantity: item.quantity, 
          price: unitPrice, 
          productType: item.type === 'build' ? 'build' : 'upper' 
        }
      })
    )

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          addressId,
          couponCode: couponCode ?? null,
          discountAmount: discountAmount ?? 0,
          paymentMethod: paymentMethod ?? 'online',
          dodoSessionId: razorpayOrderId ?? null,
          status: 'PENDING',
          items: {
            create: resolvedItems
              .filter(i => i.variant !== null)
              .map(i => ({
                variantId: i.variant!.id,
                quantity: i.quantity,
                price: i.price,
                productType: i.productType,
              })),
          },
        },
        include: {
          items: { include: { variant: { include: { product: true } } } },
          address: true,
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

    if (paymentMethod === 'cod') {
      const emailItems = order.items.map(i => ({
        name: i.variant.product.name,
        size: i.variant.size,
        quantity: i.quantity,
        price: i.price,
        productType: i.productType,
      }))

      // CRITICAL FIX: Explicitly map fields to remove 'line2', 'id', etc.
      // and convert 'null' to 'undefined' for the phone number.
      const sanitizedAddress = {
        line1: order.address.line1,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        phone: order.address.phone ?? undefined, 
      }

      // Using sanitizedAddress for both mailer functions
      sendOrderConfirmation({
        to: dbUser!.email,
        name: dbUser?.firstName ?? 'Customer',
        orderId: order.id,
        items: emailItems,
        total: order.totalAmount,
        address: sanitizedAddress,
        paymentMethod: 'Cash on Delivery',
      })

      sendOwnerAlert({
        orderId: order.id,
        customerEmail: dbUser!.email,
        customerName: `${dbUser?.firstName ?? ''} ${dbUser?.lastName ?? ''}`.trim(),
        total: order.totalAmount,
        paymentMethod: 'COD',
        address: sanitizedAddress,
        items: emailItems,
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (e) {
    console.error('[orders POST]', e)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}