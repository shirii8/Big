import { NextResponse } from 'next/server'
import crypto from 'crypto'
import {prisma} from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('x-razorpay-signature') ?? ''

  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.error('[webhook] RAZORPAY_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  if (expected !== sig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: { event: string; payload: { payment: { entity: { id: string; notes?: Record<string, string> } } } }

  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (event.event === 'payment.captured') {
    const paymentId = event.payload.payment.entity.id
    const notes = event.payload.payment.entity.notes ?? {}
    if (notes.orderId) {
      await prisma.order.updateMany({
        where: { id: notes.orderId, status: 'PENDING' },
        data: { status: 'PAID', dodoPaymentId: paymentId },
      }).catch((e: unknown) => console.error('[webhook] update PAID failed:', e))
    }
  }

  if (event.event === 'payment.failed') {
    const notes = event.payload.payment.entity.notes ?? {}
    if (notes.orderId) {
      await prisma.order.updateMany({
        where: { id: notes.orderId, status: 'PENDING' },
        data: { status: 'CANCELLED' },
      }).catch((e: unknown) => console.error('[webhook] cancel failed:', e))
    }
  }

  return NextResponse.json({ ok: true })
}