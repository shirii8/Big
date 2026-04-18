// app/api/admin/orders/[orderId]/verify-payment/route.ts
// Next.js 15: params is a Promise — must be awaited

import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { prisma } from '@/lib/db'
import { OrderStatus } from '@/generated/prisma/client'
import { sendStatusUpdate } from '@/lib/mailer'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'orders@tessch.com'

type RouteContext = {
  params: Promise<{ orderId: string }>
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { orderId } = await context.params

    const { getUser } = getKindeServerSession()
    const user = await getUser()

    const dbUser = user?.id
      ? await prisma.user.findUnique({ where: { id: user.id } })
      : null

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action, note } = await req.json() // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (action === 'approve') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          paymentVerified: true,
          verificationNote: note ?? null,
        },
      })

      await sendStatusUpdate({
        to: order.user.email,
        name: order.user.firstName ?? 'Customer',
        orderId: order.id,
        status: 'PAID',
      })

    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          paymentVerified: false,
          verificationNote: note ?? 'Payment could not be verified.',
        },
      })

      await sendPaymentRejectionEmail({
        to: order.user.email,
        name: order.user.firstName ?? 'Customer',
        orderId: order.id,
        total: order.totalAmount,
        note: note ?? 'Payment could not be verified. Please contact support.',
      })
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error('[admin/verify-payment]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendPaymentRejectionEmail(opts: {
  to: string; name: string; orderId: string; total: number; note: string
}) {
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `TESSCH — Payment Issue with Order ${opts.orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="background:#17191d;padding:40px;font-family:monospace;color:#e5f1ee;max-width:600px;margin:0 auto">
        <h1 style="font-size:28px;letter-spacing:-1px;text-transform:uppercase;margin:0 0 8px;font-weight:900">
          PAYMENT NOT VERIFIED
        </h1>
        <p style="color:#ef4444;font-size:9px;text-transform:uppercase;letter-spacing:4px;margin:0 0 32px">● Action Required</p>
        <p style="font-size:11px;opacity:0.5;margin:0 0 4px;text-transform:uppercase;letter-spacing:2px">
          Order ${opts.orderId.slice(0, 8).toUpperCase()}
        </p>
        <p style="font-size:24px;font-weight:bold;color:#d4604d;margin:0 0 24px">
          ₹${opts.total.toLocaleString('en-IN')}
        </p>
        <div style="background:rgba(239,68,68,0.1);border-left:3px solid #ef4444;padding:16px;margin-bottom:24px">
          <p style="font-size:11px;margin:0;line-height:1.6;opacity:0.85">${opts.note}</p>
        </div>
        <p style="font-size:12px;opacity:0.7;line-height:1.8;margin:0 0 24px">
          We were unable to verify your UPI payment. Please reply to this email with a clear
          payment screenshot or contact <strong>tesschstore@gmail.com</strong>.
        </p>
        <p style="font-size:9px;opacity:0.3;text-transform:uppercase;letter-spacing:1px;margin:0">
          TESSCH · tesschstore@gmail.com
        </p>
      </div>
    `,
  })
}