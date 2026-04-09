import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { sendOrderConfirmation, sendOwnerAlert } from '@/lib/mailer'

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      internalOrderId,
    } = await req.json()

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSig !== razorpay_signature) {
      console.error('[verify] Signature mismatch')
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Update order status to PAID
    const order = await prisma.order.update({
      where: { id: internalOrderId },
      data: {
        status: 'PAID',
        dodoPaymentId: razorpay_payment_id, // reusing field for razorpay payment id
        dodoSessionId: razorpay_order_id,   // reusing field for razorpay order id
      },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        address: true,
        user: true,
      },
    })

    // Send confirmation emails (non-blocking)
    const emailItems = order.items.map(i => ({
      name: i.variant.product.name,
      size: i.variant.size,
      quantity: i.quantity,
      price: i.price,
      productType: i.productType,
    }))

    sendOrderConfirmation({
      to: order.user.email,
      name: order.user.firstName ?? 'Customer',
      orderId: order.id,
      items: emailItems,
      total: order.totalAmount,
      address: order.address,
      paymentMethod: order.paymentMethod,
    })

    sendOwnerAlert({
      orderId: order.id,
      customerEmail: order.user.email,
      customerName: `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim(),
      total: order.totalAmount,
      paymentMethod: order.paymentMethod,
      address: order.address,
      items: emailItems,
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (e) {
    console.error('[verify]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}