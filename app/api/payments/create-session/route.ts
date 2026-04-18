
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

type CartItemInput = {
  upper: { id: string; name: string; price: number; image: string }
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

    // Resolve variants — always keep cart data as denormalized fallback
    const resolvedItems = await Promise.all(
      items.map(async (item: CartItemInput) => {
        const variant = await prisma.productVariant.findUnique({
          where: { productId_size: { productId: item.upper.id, size: item.size } },
          include: { product: true },
        }).catch(() => null)

        const unitPrice = item.type === 'build'
          ? item.upper.price + (item.sole?.price ?? 1299)
          : item.upper.price

        return {
          variant,
          variantId: variant?.id ?? null,
          productName:  variant?.product?.name  ?? item.upper.name,
          productImage: variant?.product?.image ?? item.upper.image,
          size: item.size,
          quantity: item.quantity,
          price: unitPrice,
          productType: item.type === 'build' ? 'build' : 'upper',
        }
      })
    )

    if (resolvedItems.length === 0) {
      return NextResponse.json({ error: 'No valid items to order' }, { status: 400 })
    }

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
            create: resolvedItems.map(i => ({
              variantId:    i.variantId,
              quantity:     i.quantity,
              price:        i.price,
              productType:  i.productType,
              productName:  i.productName,
              productImage: i.productImage,
              size:         i.size,
            })),
          },
        },
      })

      // Decrement stock only for resolved variants
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