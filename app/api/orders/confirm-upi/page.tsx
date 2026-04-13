import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { sendOwnerAlert } from '@/lib/mailer'

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { orderId, txnRef }: { orderId: string; txnRef: string } = await req.json()

    if (!orderId || !txnRef) {
      return NextResponse.json({ error: 'orderId and txnRef required' }, { status: 400 })
    }

    // Verify order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        items: { include: { variant: { include: { product: true } } } },
      },
    })

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Store UTR in dodoPaymentId field (repurposed) and mark as PENDING_VERIFICATION
    await prisma.order.update({
      where: { id: orderId },
      data: {
        dodoPaymentId: `UPI_UTR:${txnRef}`,
        paymentMethod: 'upi',
        // Keep PENDING — owner verifies and manually marks PAID
      },
    })

    // Alert owner with UTR for verification
    const emailItems = order.items.map(i => ({
      name: i.variant.product.name,
      size: i.variant.size,
      quantity: i.quantity,
      price: i.price,
      productType: i.productType,
    }))

    // Send owner alert with UTR details
    await sendOwnerAlert({
      orderId: order.id,
      customerEmail: order.user.email,
      customerName: `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim() || 'Customer',
      total: order.totalAmount,
      paymentMethod: `UPI — UTR: ${txnRef}`,
      address: order.address,
      items: emailItems,
    }).catch((e: unknown) => console.error('[confirm-upi] owner alert failed:', e))

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[confirm-upi]', e)
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 })
  }
}