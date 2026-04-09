import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export async function GET() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(addresses)
}

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { line1, line2, city, state, postalCode, country, phone } = await req.json()

    if (!line1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const address = await prisma.address.create({
      data: { userId: user.id, line1, line2, city, state, postalCode, country, phone },
    })
    return NextResponse.json(address, { status: 201 })
  } catch (e) {
    console.error('[address POST]', e)
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 })
  }
}