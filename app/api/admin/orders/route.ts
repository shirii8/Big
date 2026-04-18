import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export async function GET() {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    // 1. Security Check
    const dbUser = await prisma.user.findUnique({ where: { id: user?.id } })
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch with deep includes to fix your missing history
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            variant: {
              include: { product: true } // This syncs names/images
            }
          }
        }
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Fetch Error:", error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}