import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('[mailer] RESEND_API_KEY not set — emails will be skipped')
}

const resend = new Resend(process.env.RESEND_API_KEY ?? 'missing')
const FROM = process.env.RESEND_FROM_EMAIL ?? 'orders@tessch.com'
const OWNER = process.env.OWNER_EMAIL ?? ''

// ── Helpers ────────────────────────────────────────────────────────────────────
function orderStatusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: '#f59e0b', PAID: '#3b82f6',
    SHIPPED: '#8b5cf6', DELIVERED: '#10b981', CANCELLED: '#ef4444',
  }
  return map[status] ?? '#17191d'
}

// ── Customer: order confirmation ───────────────────────────────────────────────
export async function sendOrderConfirmation(opts: {
  to: string
  name: string
  orderId: string
  items: { name: string; size: string; quantity: number; price: number; productType: string }[]
  total: number
  address: { line1: string; city: string; state: string; postalCode: string; country: string }
  paymentMethod: string
}) {
  const itemRows = opts.items.map(i =>
    `<tr>
      <td style="padding:8px 0;font-family:monospace;font-size:12px;border-bottom:1px solid #e5f1ee">
        ${i.name} (${i.productType === 'build' ? 'Full Build' : 'Upper Only'}) — ${i.size}
      </td>
      <td style="padding:8px 0;font-family:monospace;font-size:12px;text-align:right;border-bottom:1px solid #e5f1ee">
        ₹${(i.price * i.quantity).toLocaleString('en-IN')}
      </td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `TESSCH — Order ${opts.orderId.slice(0, 8).toUpperCase()} Confirmed`,
    html: `
      <div style="background:#17191d;padding:40px;font-family:monospace;color:#e5f1ee;max-width:600px;margin:0 auto">
        <h1 style="font-size:32px;letter-spacing:-1px;text-transform:uppercase;margin:0 0 8px">BUILD LOCKED.</h1>
        <p style="color:#d4604d;font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 32px">Order Confirmed</p>

        <p style="font-size:12px;opacity:0.6;margin:0 0 4px">ORDER ID</p>
        <p style="font-size:14px;font-weight:bold;margin:0 0 24px">${opts.orderId.slice(0, 8).toUpperCase()}</p>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">${itemRows}</table>

        <div style="border-top:2px solid #e5f1ee20;padding-top:16px;display:flex;justify-content:space-between">
          <span style="font-size:12px;opacity:0.6">TOTAL PAID</span>
          <span style="font-size:20px;font-weight:bold;color:#d4604d">₹${opts.total.toLocaleString('en-IN')}</span>
        </div>

        <div style="margin-top:24px;background:#ffffff10;padding:16px">
          <p style="font-size:10px;opacity:0.4;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Delivering To</p>
          <p style="font-size:12px;margin:0">${opts.address.line1}, ${opts.address.city}, ${opts.address.state} — ${opts.address.postalCode}</p>
        </div>

        <p style="margin-top:32px;font-size:10px;opacity:0.4;text-transform:uppercase;letter-spacing:2px">
          Estimated dispatch: 3–5 business days. You'll receive a shipping update when dispatched.
        </p>
      </div>
    `,
  }).catch(e => console.error('[mailer] order confirmation failed:', e))
}

// ── Customer: status update ────────────────────────────────────────────────────
export async function sendStatusUpdate(opts: {
  to: string
  name: string
  orderId: string
  status: string
  trackingId?: string
}) {
  const messages: Record<string, string> = {
    PAID:      'Payment confirmed. Your build is being prepared.',
    SHIPPED:   `Your build is on the way!${opts.trackingId ? ` Tracking: ${opts.trackingId}` : ''}`,
    DELIVERED: 'Your build has been delivered. Enjoy the drop.',
    CANCELLED: 'Your order has been cancelled. Any payment will be refunded within 5–7 days.',
  }

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `TESSCH — Order ${opts.orderId.slice(0, 8).toUpperCase()} · ${opts.status}`,
    html: `
      <div style="background:#17191d;padding:40px;font-family:monospace;color:#e5f1ee;max-width:600px;margin:0 auto">
        <h1 style="font-size:28px;letter-spacing:-1px;text-transform:uppercase;margin:0 0 8px">ORDER UPDATE</h1>
        <p style="color:${orderStatusColor(opts.status)};font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 32px">
          ● ${opts.status}
        </p>
        <p style="font-size:12px;opacity:0.6;margin:0 0 4px">ORDER ${opts.orderId.slice(0, 8).toUpperCase()}</p>
        <p style="font-size:14px;margin:0 0 24px">${messages[opts.status] ?? 'Your order status has been updated.'}</p>
        <a href="${process.env.KINDE_SITE_URL}/orders"
           style="display:inline-block;background:#d4604d;color:white;font-size:10px;text-transform:uppercase;letter-spacing:3px;padding:12px 24px;text-decoration:none">
          VIEW MY ORDERS →
        </a>
      </div>
    `,
  }).catch(e => console.error('[mailer] status update failed:', e))
}

// ── Owner: new order alert ────────────────────────────────────────────────────
export async function sendOwnerAlert(opts: {
  orderId: string
  customerEmail: string
  customerName: string
  total: number
  paymentMethod: string
  address: { line1: string; city: string; state: string; postalCode: string; phone?: string }
  items: { name: string; size: string; quantity: number; productType: string }[]
}) {
  if (!OWNER) return

  const itemList = opts.items.map(i =>
    `• ${i.name} (${i.productType === 'build' ? 'Full Build' : 'Upper Only'}) — ${i.size} × ${i.quantity}`
  ).join('\n')

  await resend.emails.send({
    from: FROM,
    to: OWNER,
    subject: `🛒 New Order — ₹${opts.total.toLocaleString('en-IN')} — ${opts.orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#d4604d">New Order Received</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0;opacity:0.6">Order ID</td><td>${opts.orderId}</td></tr>
          <tr><td style="padding:4px 0;opacity:0.6">Customer</td><td>${opts.customerName} (${opts.customerEmail})</td></tr>
          <tr><td style="padding:4px 0;opacity:0.6">Total</td><td><strong>₹${opts.total.toLocaleString('en-IN')}</strong></td></tr>
          <tr><td style="padding:4px 0;opacity:0.6">Payment</td><td>${opts.paymentMethod.toUpperCase()}</td></tr>
          <tr><td style="padding:4px 0;opacity:0.6">Phone</td><td>${opts.address.phone ?? '—'}</td></tr>
          <tr><td style="padding:4px 0;opacity:0.6">Address</td><td>${opts.address.line1}, ${opts.address.city}, ${opts.address.state} — ${opts.address.postalCode}</td></tr>
        </table>
        <pre style="background:#f5f5f5;padding:16px;margin-top:16px;font-size:12px">${itemList}</pre>
        <a href="${process.env.KINDE_SITE_URL}/admin/orders"
           style="display:inline-block;background:#17191d;color:white;padding:10px 20px;margin-top:16px;text-decoration:none;font-size:12px">
          Manage Orders →
        </a>
      </div>
    `,
  }).catch(e => console.error('[mailer] owner alert failed:', e))
}