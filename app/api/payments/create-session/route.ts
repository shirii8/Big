import { NextRequest, NextResponse } from 'next/server'
import { dodo } from '@/lib/dodopayments'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      items,
      totalAmount,
      addressId,
      couponCode,
      discountAmount,
    } = await req.json()

    // 1. Get user details from DB
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    // 2. Get the specific address to satisfy "billing" requirements if needed
    const address = await prisma.address.findUnique({ where: { id: addressId } })

    const session = await dodo.payments.create({
      payment_link: true,
      // MOVE currency and total amount here (top-level)
      currency: 'INR',
      total_amount: Math.round(totalAmount * 100), // paise
      
      customer: {
        email: dbUser?.email ?? user.email ?? '',
        name: `${dbUser?.firstName ?? ''} ${dbUser?.lastName ?? ''}`.trim() || 'Customer',
      },
      
      product_cart: items.map((item: any) => ({
        // Ensure this matches your Dodo dashboard product IDs or use 'custom' if supported
        product_id: item.upper.id, 
        quantity: item.quantity,
      })),

      // 3. FIXED: Billing should only contain address/geographic info
      billing: {
        city: address?.city ?? '',
        country: address?.country ?? 'IN',
        line1: address?.line1 ?? '',
        state: address?.state ?? '',
        zip: address?.postalCode ?? '',
      },

      return_url: `${process.env.KINDE_SITE_URL}/checkout/success`,
      metadata: {
        userId: user.id,
        addressId,
        couponCode: couponCode ?? '',
        discountAmount: String(discountAmount ?? 0),
      },
    })

    return NextResponse.json({ url: session.payment_link, sessionId: session.payment_id })
  } catch (e) {
    console.error('[dodo create-session]', e)
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 })
  }
}