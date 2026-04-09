import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const {
      totalAmount,
      addressId,
      couponCode,
      discountAmount,
    } = await req.json()

    // 1. Validation
    if (!totalAmount || totalAmount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // 2. Razorpay Order Creation
    // We use .orders.create (Smallest currency unit: paise)
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), 
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      // Razorpay uses 'notes' for custom metadata/metadata
      notes: {
        userId: user.id,
        addressId: addressId || '',
        couponCode: couponCode || '',
        discountAmount: String(discountAmount || 0),
      },
    })

    // 3. Return the Order ID and details
    // Your frontend will use 'id' to initialize the Razorpay Checkout modal
    return NextResponse.json({ 
      id: order.id, 
      amount: order.amount, 
      currency: order.currency 
    })

  } catch (error) {
    console.error('[razorpay create-order error]', error)
    return NextResponse.json(
      { error: 'Failed to initiate payment' }, 
      { status: 500 }
    )
  }
}