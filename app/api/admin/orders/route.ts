import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export async function GET() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (dbUser?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, email: true, firstName: true, lastName: true } },
      items: { include: { variant: { include: { product: true } } } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}