import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from "@/lib/db"

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('x-razorpay-signature') ?? ''

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (expected !== sig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)

  // payment.captured = fully paid
  if (event.event === 'payment.captured') {
    const paymentId: string = event.payload.payment.entity.id
    const notes = event.payload.payment.entity.notes ?? {}

    if (notes.orderId) {
      await prisma.order.updateMany({
        where: { id: notes.orderId, status: 'PENDING' },
        data: { status: 'PAID', dodoPaymentId: paymentId },
      }).catch(e => console.error('[webhook] order update failed:', e))
    }
  }

  if (event.event === 'payment.failed') {
    const notes = event.payload.payment.entity.notes ?? {}
    if (notes.orderId) {
      await prisma.order.updateMany({
        where: { id: notes.orderId, status: 'PENDING' },
        data: { status: 'CANCELLED' },
      }).catch(e => console.error('[webhook] cancel failed:', e))
    }
  }

  return NextResponse.json({ ok: true })
}