import { NextResponse } from 'next/server'
import {prisma} from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { sendStatusUpdate } from '@/lib/mailer'

// Only you (admin) can call this
export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check admin role
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (dbUser?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { status, trackingId } = await req.json()

    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: params.orderId },
      data: { status },
      include: { user: true, address: true },
    })

    // Email the customer about the status change
    await sendStatusUpdate({
      to: order.user.email,
      name: order.user.firstName ?? 'Customer',
      orderId: order.id,
      status,
      trackingId,
    })

    return NextResponse.json(order)
  } catch (e) {
    console.error('[admin order PATCH]', e)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// GET a single order with full details (admin use)
export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (dbUser?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      user: true,
      items: { include: { variant: { include: { product: true } } } },
      address: true,
    },
  })

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}