import { NextResponse } from 'next/server'
import { dodo } from '@/lib/dodopayments'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      items,
      totalAmount,
      addressId,
      couponCode,
      discountAmount,
    } = await req.json()

    // Build line items for Dodo
    const lineItems = items.map((item: {
      upper: { name: string; price: number }
      sole?: { price: number }
      quantity: number
      type: string
      size: string
    }) => {
      const unitPrice =
        item.type === 'build'
          ? item.upper.price + (item.sole?.price ?? 3200)
          : item.upper.price
      return {
        name: `${item.upper.name}${item.type === 'build' ? ' (Full Build)' : ' (Upper Only)'} — ${item.size}`,
        quantity: item.quantity,
        unit_amount: Math.round(unitPrice * 100), // paise
      }
    })

    // Get user email for Dodo
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

    const session = await dodo.payments.create({
      payment_link: true,
      customer: {
        email: dbUser?.email ?? user.email ?? '',
        name: `${dbUser?.firstName ?? ''} ${dbUser?.lastName ?? ''}`.trim() || 'Customer',
      },
      product_cart: lineItems.map((li: {
        name: string
        quantity: number
        unit_amount: number
      }) => ({
        product_id: 'custom',
        quantity: li.quantity,
      })),
      // Use billing amount directly
      billing: {
        currency: 'INR',
        payment_frequency_interval: 'day',
        payment_frequency_count: 1,
        subscription_period_interval: 'day',
        subscription_period_count: 1,
        trial_period_days: 0,
        price: Math.round(totalAmount * 100),
      },
      return_url: `${process.env.KINDE_SITE_URL}/checkout/success`,
      metadata: {
        userId: user.id,
        addressId,
        couponCode: couponCode ?? '',
        discountAmount: String(discountAmount ?? 0),
      },
    })

    return NextResponse.json({ url: session.payment_link, sessionId: session.payment_id })
  } catch (e) {
    console.error('[dodo create-session]', e)
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 })
  }
}