import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
// Use your central prisma export to prevent connection pooling issues
import { prisma } from "@/lib/db";
import { sendOrderConfirmation, sendOwnerAlert } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { orderId, txnRef, screenshotUrl } = body

    if (!orderId || !screenshotUrl) {
      return NextResponse.json({ 
        error: 'orderId and screenshotUrl are required' 
      }, { status: 400 })
    }

    // Verify order exists and belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
        address: true,
      },
    })

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order with screenshot + UTR. 
    // We set status explicitly to PENDING to ensure it's in the right queue.
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentScreenshot: screenshotUrl,
        utrReference: txnRef || null,
        status: 'PENDING',
      },
    })

    // Prepare items for email
    const emailItems = order.items.map(i => ({
      name: i.variant.product.name,
      size: i.variant.size,
      quantity: i.quantity,
      price: i.price,
      productType: i.productType,
    }))

    // Wrap mailers in try/catch or await them so they don't crash the response
    try {
      await sendOrderConfirmation({
        to: user.email ?? '',
        name: user.given_name ?? 'Customer',
        orderId: order.id,
        items: emailItems,
        total: order.totalAmount,
        address: order.address,
        paymentMethod: 'upi',
        discountAmount: order.discountAmount,
        couponCode: order.couponCode,
      })

      await sendOwnerAlert({
        orderId: order.id,
        customerEmail: user.email ?? '',
        customerName: `${user.given_name ?? ''} ${user.family_name ?? ''}`.trim(),
        total: order.totalAmount,
        paymentMethod: 'upi',
        address: order.address,
        items: emailItems,
        couponCode: order.couponCode,
        discountAmount: order.discountAmount,
      })
    } catch (mailError) {
      console.error('[Mail Error]:', mailError)
      // We don't return an error to the user because the DB update succeeded
    }

    return NextResponse.json({ success: true, status: 'pending_verification' })

  } catch (error) {
    console.error('[upi/confirm CRASH]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// import { NextResponse } from 'next/server'
// import {prisma} from '@/lib/db'
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
// import { sendOrderConfirmation, sendOwnerAlert } from '@/lib/mailer'

// export async function POST(req: Request) {
//   const { getUser } = getKindeServerSession()
//   const user = await getUser()
//   if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

//   try {
//     const { orderId, txnRef }: { orderId: string; txnRef: string } = await req.json()

//     if (!orderId || !txnRef?.trim()) {
//       return NextResponse.json({ error: 'orderId and txnRef required' }, { status: 400 })
//     }

//     // Verify order belongs to user
//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//       include: {
//         user: true,
//         address: true,
//         items: { include: { variant: { include: { product: true } } } },
//       },
//     })

//     if (!order || order.userId !== user.id) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 })
//     }

//     if (order.status !== 'PENDING') {
//       return NextResponse.json({ error: 'Order already confirmed' }, { status: 400 })
//     }

//     // Store UTR — dodoPaymentId field reused for UPI UTR
//     await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         dodoPaymentId: `UPI:${txnRef.trim()}`,
//         paymentMethod: 'upi',
//         // Keep PENDING — owner verifies manually then marks PAID via admin API
//       },
//     })

//     // Build email items
//     const emailItems = order.items.map((i: typeof order.items[number]) => ({
//       name: i.variant.product.name,
//       size: i.variant.size,
//       quantity: i.quantity,
//       price: i.price,
//       productType: i.productType,
//     }))

//     // Customer confirmation email (shows "awaiting verification")
//     sendOrderConfirmation({
//       to: order.user.email,
//       name: order.user.firstName ?? 'Customer',
//       orderId: order.id,
//       items: emailItems,
//       total: order.totalAmount,
//       address: order.address,
//       paymentMethod: `UPI — UTR: ${txnRef.trim()}`,
//       discountAmount: order.discountAmount ?? 0,
//       couponCode: order.couponCode,
//     }).catch((e: unknown) => console.error('[upi/confirm] customer email failed:', e))

//     // Owner alert with UTR highlighted for manual verification
//     sendOwnerAlert({
//       orderId: order.id,
//       customerEmail: order.user.email,
//       customerName: `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim() || 'Customer',
//       total: order.totalAmount,
//       paymentMethod: `UPI — UTR: ${txnRef.trim()} ← VERIFY THIS`,
//       address: order.address,
//       items: emailItems,
//       couponCode: order.couponCode,
//       discountAmount: order.discountAmount ?? 0,
//     }).catch((e: unknown) => console.error('[upi/confirm] owner email failed:', e))

//     return NextResponse.json({ success: true })
//   } catch (e) {
//     console.error('[upi/confirm]', e)
//     return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 })
//   }
// }