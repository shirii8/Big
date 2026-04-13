import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('[mailer] RESEND_API_KEY not set — emails will be skipped')
}

const resend = new Resend(process.env.RESEND_API_KEY ?? 'missing')
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'orders@tessch.com'
const OWNER  = process.env.OWNER_EMAIL ?? ''

export type EmailItem = {
  name: string
  size: string
  quantity: number
  price: number
  productType: string
}

export type AddressSnap = {
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string | null
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: '#f59e0b', PAID: '#3b82f6',
    SHIPPED: '#8b5cf6', DELIVERED: '#10b981', CANCELLED: '#ef4444',
  }
  return map[status] ?? '#17191d'
}

// ─── Order Confirmation ────────────────────────────────────────────────────────
export async function sendOrderConfirmation(opts: {
  to: string
  name: string
  orderId: string
  items: EmailItem[]
  total: number
  address: AddressSnap
  paymentMethod: string
  discountAmount?: number
  couponCode?: string | null
}): Promise<void> {
  const itemRows = opts.items.map((i) =>
    `<tr>
      <td style="padding:10px 0;font-family:monospace;font-size:12px;border-bottom:1px solid rgba(229,241,238,0.15)">
        ${i.name} (${i.productType === 'build' ? 'Full Build' : 'Upper Only'}) — ${i.size} × ${i.quantity}
      </td>
      <td style="padding:10px 0;font-family:monospace;font-size:12px;text-align:right;border-bottom:1px solid rgba(229,241,238,0.15)">
        ₹${(i.price * i.quantity).toLocaleString('en-IN')}
      </td>
    </tr>`
  ).join('')

  const discountRow = (opts.discountAmount && opts.discountAmount > 0) ? `
    <tr>
      <td style="padding:6px 0;font-family:monospace;font-size:11px;color:#10b981">
        Coupon${opts.couponCode ? ` (${opts.couponCode})` : ''} applied
      </td>
      <td style="padding:6px 0;font-family:monospace;font-size:11px;text-align:right;color:#10b981">
        −₹${opts.discountAmount.toLocaleString('en-IN')}
      </td>
    </tr>` : ''

  const isUPI = opts.paymentMethod.toLowerCase().includes('upi')
  const payNote = isUPI
    ? `<div style="margin-top:16px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);padding:12px 16px">
        <p style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#f59e0b;margin:0">
          UPI Payment Under Verification — Your order will be confirmed within 30 minutes.
        </p>
      </div>`
    : ''

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `TESSCH — Order ${opts.orderId.slice(0, 8).toUpperCase()} ${isUPI ? 'Received' : 'Confirmed'} 🔒`,
    html: `
      <div style="background:#17191d;padding:40px;font-family:monospace;color:#e5f1ee;max-width:600px;margin:0 auto">
        <div style="margin-bottom:32px">
          <h1 style="font-size:36px;letter-spacing:-2px;text-transform:uppercase;margin:0 0 4px;font-weight:900">
            ${isUPI ? 'ORDER RECEIVED.' : 'BUILD LOCKED.'}
          </h1>
          <p style="color:#d4604d;font-size:9px;text-transform:uppercase;letter-spacing:4px;margin:0">
            ${isUPI ? 'Awaiting UPI Verification' : 'Order Confirmed'}
          </p>
        </div>

        <div style="background:rgba(229,241,238,0.05);padding:16px;margin-bottom:24px">
          <p style="font-size:9px;opacity:0.4;text-transform:uppercase;letter-spacing:3px;margin:0 0 4px">Order ID</p>
          <p style="font-size:16px;font-weight:bold;margin:0;letter-spacing:2px">${opts.orderId.slice(0, 8).toUpperCase()}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
          ${itemRows}
          ${discountRow}
        </table>

        <div style="border-top:2px solid rgba(229,241,238,0.1);padding-top:16px;margin-top:8px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:11px;opacity:0.5;text-transform:uppercase;letter-spacing:2px">Total Paid</span>
          <span style="font-size:24px;font-weight:bold;color:#d4604d">₹${opts.total.toLocaleString('en-IN')}</span>
        </div>

        ${payNote}

        <div style="margin-top:24px;background:rgba(255,255,255,0.04);padding:16px;border-left:3px solid #d4604d">
          <p style="font-size:9px;opacity:0.4;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Delivering To</p>
          <p style="font-size:12px;margin:0;line-height:1.6">${opts.address.line1}${opts.address.line2 ? ', ' + opts.address.line2 : ''}<br/>
          ${opts.address.city}, ${opts.address.state} — ${opts.address.postalCode}<br/>
          ${opts.address.country}${opts.address.phone ? ' · ' + opts.address.phone : ''}</p>
        </div>

        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(229,241,238,0.1)">
          <p style="font-size:9px;opacity:0.3;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px">
            Estimated dispatch: 1–3 business days · Delivery: 7–14 days
          </p>
          <a href="${process.env.KINDE_SITE_URL}/orders"
             style="display:inline-block;background:#d4604d;color:white;font-size:9px;text-transform:uppercase;letter-spacing:3px;padding:12px 24px;text-decoration:none;font-weight:bold">
            Track My Order →
          </a>
        </div>

        <p style="margin-top:32px;font-size:9px;opacity:0.2;text-transform:uppercase;letter-spacing:1px">
          Questions? tesschstore@gmail.com
        </p>
      </div>
    `,
  })
}

// ─── Status Update ─────────────────────────────────────────────────────────────
export async function sendStatusUpdate(opts: {
  to: string
  name: string
  orderId: string
  status: string
  trackingId?: string
}): Promise<void> {
  const messages: Record<string, string> = {
    PAID:      'Payment confirmed. Your build is being assembled and will ship soon.',
    SHIPPED:   `Your build is on the way!${opts.trackingId ? ` Tracking ID: <strong>${opts.trackingId}</strong>` : ' Check your email for tracking details.'}`,
    DELIVERED: 'Your build has been delivered. Welcome to the modular revolution.',
    CANCELLED: 'Your order has been cancelled. Any payment will be refunded within 5–7 business days.',
  }

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `TESSCH — Order ${opts.orderId.slice(0, 8).toUpperCase()} · ${opts.status}`,
    html: `
      <div style="background:#17191d;padding:40px;font-family:monospace;color:#e5f1ee;max-width:600px;margin:0 auto">
        <h1 style="font-size:28px;letter-spacing:-1px;text-transform:uppercase;margin:0 0 8px;font-weight:900">ORDER UPDATE</h1>
        <p style="color:${statusColor(opts.status)};font-size:9px;text-transform:uppercase;letter-spacing:4px;margin:0 0 32px">
          ● ${opts.status}
        </p>
        <p style="font-size:11px;opacity:0.5;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px">
          Order ${opts.orderId.slice(0, 8).toUpperCase()}
        </p>
        <p style="font-size:14px;margin:0 0 32px;line-height:1.6;opacity:0.85">
          ${messages[opts.status] ?? 'Your order status has been updated.'}
        </p>
        <a href="${process.env.KINDE_SITE_URL}/orders"
           style="display:inline-block;background:#d4604d;color:white;font-size:9px;text-transform:uppercase;letter-spacing:3px;padding:12px 24px;text-decoration:none;font-weight:bold">
          View My Orders →
        </a>
        <p style="margin-top:40px;font-size:9px;opacity:0.2;text-transform:uppercase">
          tesschstore@gmail.com
        </p>
      </div>
    `,
  })
}

// ─── Owner Alert ───────────────────────────────────────────────────────────────
export async function sendOwnerAlert(opts: {
  orderId: string
  customerEmail: string
  customerName: string
  total: number
  paymentMethod: string
  address: AddressSnap
  items: EmailItem[]
  couponCode?: string | null
  discountAmount?: number
}): Promise<void> {
  if (!OWNER) return

  const itemList = opts.items.map((i) =>
    `• ${i.name} (${i.productType === 'build' ? 'Full Build' : 'Upper Only'}) — Size: ${i.size} × ${i.quantity} = ₹${(i.price * i.quantity).toLocaleString('en-IN')}`
  ).join('\n')

  const isUPI = opts.paymentMethod.toLowerCase().includes('upi')
  const urgencyBadge = isUPI
    ? `<div style="background:#f59e0b;color:#17191d;font-weight:bold;padding:8px 16px;margin-bottom:16px;font-size:11px;text-transform:uppercase;letter-spacing:2px">
        ⚠ UPI PAYMENT — MANUAL VERIFICATION REQUIRED
      </div>`
    : ''

  await resend.emails.send({
    from: FROM,
    to: OWNER,
    subject: `${isUPI ? '⚡ UPI VERIFY' : '🛒 New Order'} — ₹${opts.total.toLocaleString('en-IN')} — ${opts.orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#fff">
        ${urgencyBadge}
        <h2 style="color:#d4604d;margin:0 0 20px">New Order Received</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tr style="background:#f8f8f8"><td style="padding:8px;font-weight:bold">Order ID</td><td style="padding:8px">${opts.orderId}</td></tr>
          <tr><td style="padding:8px;opacity:0.6">Customer</td><td style="padding:8px">${opts.customerName} &lt;${opts.customerEmail}&gt;</td></tr>
          <tr style="background:#f8f8f8"><td style="padding:8px;opacity:0.6">Total</td><td style="padding:8px;font-weight:bold;color:#d4604d">₹${opts.total.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding:8px;opacity:0.6">Payment</td><td style="padding:8px">${opts.paymentMethod.toUpperCase()}</td></tr>
          ${opts.couponCode ? `<tr style="background:#f8f8f8"><td style="padding:8px;opacity:0.6">Coupon</td><td style="padding:8px;color:#10b981">${opts.couponCode} (−₹${(opts.discountAmount ?? 0).toLocaleString('en-IN')})</td></tr>` : ''}
          <tr><td style="padding:8px;opacity:0.6">Phone</td><td style="padding:8px">${opts.address.phone ?? '—'}</td></tr>
          <tr style="background:#f8f8f8"><td style="padding:8px;opacity:0.6">Address</td><td style="padding:8px">${opts.address.line1}, ${opts.address.city}, ${opts.address.state} — ${opts.address.postalCode}, ${opts.address.country}</td></tr>
        </table>
        <pre style="background:#f5f5f5;padding:16px;margin-top:16px;font-size:12px;border-left:3px solid #d4604d">${itemList}</pre>
        <div style="margin-top:20px;display:flex;gap:12px">
          <a href="${process.env.KINDE_SITE_URL}/admin/orders"
             style="display:inline-block;background:#17191d;color:white;padding:10px 20px;text-decoration:none;font-size:12px;font-weight:bold">
            Manage Orders →
          </a>
        </div>
      </div>
    `,
  })
}