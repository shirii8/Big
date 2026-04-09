import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { totalAmount, orderId } = await req.json()

    if (!totalAmount || totalAmount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: 'INR',
      receipt: orderId ?? `rcpt_${Date.now()}`,
      notes: { userId: user.id, orderId: orderId ?? '' },
    })

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    })
  } catch (e) {
    console.error('[razorpay create-order]', e)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}