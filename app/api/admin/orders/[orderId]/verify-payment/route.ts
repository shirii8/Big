import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { prisma } from '@/lib/db'
import { OrderStatus } from '@prisma/client' // Use standard client path
import { sendStatusUpdate } from '@/lib/mailer'
import { Resend } from 'resend'

// Initialise Resend inside the route to ensure it picks up latest env
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'orders@tessch.com'

type RouteContext = {
  params: Promise<{ orderId: string }>
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    // 1. Await Params (Next.js 15 requirement)
    const { orderId } = await context.params
    const { action, note } = await req.json()

    // 2. Auth & Role Validation
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    const dbUser = user?.id 
      ? await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } }) 
      : null

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Fetch Order with Relations
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

    // 4. Handle Actions
    if (action === 'approve') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          paymentVerified: true,
          verificationNote: note || 'Payment verified by Admin',
        },
      })

      // Send Success Email
      await sendStatusUpdate({
        to: order.user.email,
        name: order.user.firstName ?? 'Customer',
        orderId: order.id,
        status: 'PAID',
      })

    } else if (action === 'reject') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          paymentVerified: false,
          verificationNote: note || 'Payment proof rejected.',
        },
      })

      // Send Rejection Email
      await sendPaymentRejectionEmail({
        to: order.user.email,
        name: order.user.firstName ?? 'Customer',
        orderId: order.id,
        total: order.totalAmount,
        note: note || 'We were unable to verify your UPI payment screenshot.',
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true, action })

  } catch (error) {
    console.error('[Admin Verify Payment Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * HELPER: Send Rejection Email via Resend
 */
async function sendPaymentRejectionEmail(opts: {
  to: string; name: string; orderId: string; total: number; note: string
}) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `TESSCH — Payment Issue: Order #${opts.orderId.slice(-8).toUpperCase()}`,
    html: `
      <div style="background:#17191d;padding:40px;font-family:monospace;color:#e5f1ee;max-width:600px;margin:0 auto">
        <h1 style="font-size:28px;letter-spacing:-1px;text-transform:uppercase;margin:0 0 8px;font-weight:900;color:#ef4444">
          PAYMENT REJECTED
        </h1>
        <p style="color:#ef4444;font-size:9px;text-transform:uppercase;letter-spacing:4px;margin:0 0 32px">● Resolution Required</p>
        
        <p style="font-size:11px;opacity:0.5;margin:0 0 4px;text-transform:uppercase;letter-spacing:2px">Order ID: ${opts.orderId.slice(-8).toUpperCase()}</p>
        <p style="font-size:24px;font-weight:bold;color:#d4604d;margin:0 0 24px">₹${opts.total.toLocaleString('en-IN')}</p>
        
        <div style="background:rgba(239,68,68,0.1);border-left:3px solid #ef4444;padding:16px;margin-bottom:24px">
          <p style="font-size:11px;margin:0;line-height:1.6;opacity:0.85;color:#fca5a5">Reason: ${opts.note}</p>
        </div>

        <p style="font-size:12px;opacity:0.7;line-height:1.8;margin:0 0 24px">
          We could not verify your payment. Please ensure the screenshot shows the <strong>UTR number</strong> and <strong>Success status</strong>. 
          Reply to this email or contact <strong>tesschstore@gmail.com</strong> to resolve this.
        </p>

        <a href="${process.env.KINDE_SITE_URL}/checkout" style="display:inline-block;background:#d4604d;color:white;font-size:10px;text-transform:uppercase;letter-spacing:2px;padding:14px 28px;text-decoration:none;font-weight:bold">
          Retry Payment Proof →
        </a>

        <p style="margin-top:40px;font-size:9px;opacity:0.3;text-transform:uppercase;letter-spacing:1px">
          TESSCH · The Street Archive
        </p>
      </div>
    `,
  })
}