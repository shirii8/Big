import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/db"
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { sendOrderConfirmation } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

try {
  // 1. Destructure orderId from the body (assuming Razorpay sends it or you pass it)
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is missing' }, { status: 400 });
  }

  // 2. Use 'prisma' (the name you imported) instead of 'db'
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      },
      address: true,
      user: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

    // 2. Map items for the email
    const emailItems = order.items.map((i) => ({
      name: i.variant.product.name,
      size: i.variant.size,
      quantity: i.quantity,
      price: i.price,
      productType: (i as any).productType, // Cast to any to bypass the strict inclusion check
    }))

    // 3. Sanitize the address
    const sanitizedAddress = {
      line1: order.address.line1,
      city: order.address.city,
      state: order.address.state,
      postalCode: order.address.postalCode,
      country: order.address.country,
      phone: order.address.phone ?? undefined,
    }

    // 4. Send Confirmation (Using order.user to avoid 'dbUser' not found error)
    await sendOrderConfirmation({
      to: order.user.email,
      name: order.user.firstName ?? 'Customer',
      orderId: order.id,
      items: emailItems,
      total: order.totalAmount,
     paymentMethod: (order as any).paymentMethod,
      address: sanitizedAddress,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[verify error]', error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}