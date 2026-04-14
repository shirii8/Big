import { NextResponse } from 'next/server'
import {prisma} from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

// ─── UPI Config ───────────────────────────────────────────────────────────────
const UPI_ID   = process.env.UPI_ID   ?? '8459799219@axl'
const UPI_NAME = process.env.UPI_NAME ?? 'TESSCH'

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { orderId, amount }: { orderId: string; amount: number } = await req.json()

    if (!orderId || !amount || amount < 1) {
      return NextResponse.json({ error: 'orderId and amount required' }, { status: 400 })
    }

    // Verify order belongs to this user and is still PENDING
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true, status: true, totalAmount: true },
    })

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: 'Order already processed' }, { status: 400 })
    }

    // Build UPI deep link
    const txnNote = `Order ${orderId.slice(0, 8).toUpperCase()}`
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(txnNote)}`

    // QR code URL (no API key needed — public QR service)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiLink)}&bgcolor=e5f1ee&color=17191d&margin=20&format=png`

    return NextResponse.json({
      upiId:   UPI_ID,
      upiName: UPI_NAME,
      upiLink,
      qrUrl,
      amount,
      orderId,
    })
  } catch (e) {
    console.error('[upi/initiate]', e)
    return NextResponse.json({ error: 'Failed to initiate UPI payment' }, { status: 500 })
  }
}