import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { sendStatusUpdate } from '@/lib/mailer'

// 1. Updated Type Definition for Next.js 16
type RouteContext = {
  params: Promise<{ orderId: string }>
}

export async function PATCH(
  req: NextRequest, // Use NextRequest for better type safety
  context: RouteContext
) {
  // 2. Await the params promise
  const { orderId } = await context.params

  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
      where: { id: orderId }, // Using the awaited orderId
      data: { status },
      include: { user: true, address: true },
    })

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

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  // 3. Await the params promise here too
  const { orderId } = await context.params

  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (dbUser?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId }, // Using the awaited orderId
    include: {
      user: true,
      items: { include: { variant: { include: { product: true } } } },
      address: true,
    },
  })

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}