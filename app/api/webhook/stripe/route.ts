import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId

    // 1. Create Order in DB
    await prisma.order.create({
      data: {
        userId: userId!,
        totalAmount: session.amount_total! / 100,
        status: 'PAID',
        stripeId: session.id
      }
    })

    // 2. Clear Cart
    await prisma.cartItem.deleteMany({ where: { userId } })
  }

  return new Response(null, { status: 200 })
}