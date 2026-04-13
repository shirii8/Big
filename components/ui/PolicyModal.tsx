'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type PolicyKey = 'privacy' | 'terms' | 'shipping'

const POLICIES: Record<PolicyKey, { title: string; content: React.ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="space-y-6 font-mono text-[11px] leading-relaxed text-[#17191d]/80">
        <p className="font-bold text-[#d4604d] uppercase tracking-[2px] text-[9px]">Effective Date: 16/04/2026</p>
        <p>At Tessch, we value your privacy and are committed to protecting your personal information.</p>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">1. Information We Collect</p>
          <p>We may collect: name, email address, and phone number; shipping and billing address; payment details (processed securely via third-party gateways); device and browsing information via cookies and analytics tools.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">2. How We Use Your Information</p>
          <p>We use your information to process and deliver orders, communicate regarding orders or support, improve our website and customer experience, and send promotional offers (only if you opt in).</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">3. Sharing of Information</p>
          <p>We do not sell your personal data. We may share with payment gateways (e.g., Razorpay), shipping and logistics partners, and analytics and marketing tools.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">4. Data Security</p>
          <p>We implement appropriate security measures to protect your personal information from unauthorised access, misuse, or disclosure.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">5. Your Rights</p>
          <p>You have the right to access or update your personal information, request deletion of your data, and opt out of marketing communications. Contact us at: <span className="text-[#d4604d]">tesschstore@gmail.com</span></p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">6. Cookies</p>
          <p>We use cookies and tracking technologies to enhance your browsing experience and analyse website traffic.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">7. Contact Us</p>
          <p>Email: <span className="text-[#d4604d]">tesschstore@gmail.com</span></p>
        </div>
      </div>
    ),
  },
  terms: {
    title: 'Terms & Conditions',
    content: (
      <div className="space-y-6 font-mono text-[11px] leading-relaxed text-[#17191d]/80">
        <p className="font-bold text-[#d4604d] uppercase tracking-[2px] text-[9px]">Effective Date: 16/04/2026</p>
        <p>By using the Tessch website, you agree to the following terms.</p>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">1. General</p>
          <p>Tessch operates this website and offers products subject to these terms and conditions.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">2. Product Information</p>
          <p>We strive to display products as accurately as possible. However, slight variations in colour or design may occur.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">3. Pricing & Payments</p>
          <p>All prices are listed in INR. Payments are processed securely via third-party gateways. We reserve the right to change prices at any time.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">4. Orders</p>
          <p>Order confirmation does not guarantee acceptance. We reserve the right to cancel or refuse any order (e.g., suspected fraud or errors).</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">5. Shipping</p>
          <p>Shipping and delivery are governed by our Shipping Policy.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">6. Returns & Refunds</p>
          <p>Returns and refunds are subject to our Return Policy.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">7. Intellectual Property</p>
          <p>All content on this website, including designs, logos, and images, is the property of Tessch and may not be used without permission.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">8. Limitation of Liability</p>
          <p>Tessch is not liable for delays caused by logistics partners or indirect/incidental damages.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">9. Governing Law</p>
          <p>These terms are governed by the laws of India.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">10. Contact</p>
          <p>Email: <span className="text-[#d4604d]">tesschstore@gmail.com</span></p>
        </div>
      </div>
    ),
  },
  shipping: {
    title: 'Shipping Policy',
    content: (
      <div className="space-y-6 font-mono text-[11px] leading-relaxed text-[#17191d]/80">
        <p className="font-bold text-[#d4604d] uppercase tracking-[2px] text-[9px]">Effective Date: 16/04/2026</p>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">1. Order Processing</p>
          <p>Orders are processed within 1–3 business days after confirmation.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">2. Delivery Time</p>
          <p>Estimated delivery: 7–14 business days.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">3. Shipping Charges</p>
          <p>Flat ₹170 charge per order.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">4. Order Tracking</p>
          <p>Once your order is shipped, you will receive a tracking link via email or WhatsApp.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">5. Delays</p>
          <p>Delivery timelines may be affected by weather conditions, strikes, logistics or manufacturing issues.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">6. Service Area</p>
          <p>We currently ship across India.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">7. Failed Deliveries</p>
          <p>If delivery fails due to incorrect address or unavailability, reattempts may be made by the courier. Additional charges may apply in certain cases.</p>
        </div>

        <div><p className="font-bold uppercase tracking-[2px] text-[9px] text-[#17191d] mb-2">8. Contact</p>
          <p>Email: <span className="text-[#d4604d]">tesschstore@gmail.com</span></p>
        </div>
      </div>
    ),
  },
}

interface Props {
  defaultOpen?: PolicyKey
}

export function usePolicyModal() {
  const [open, setOpen] = useState<PolicyKey | null>(null)
  return { open, setOpen }
}

export default function PolicyModal({ defaultOpen }: Props) {
  const [active, setActive] = useState<PolicyKey | null>(defaultOpen ?? null)

  return (
    <>
      {/* Trigger links — use these anywhere in your footer */}
      <div className="flex flex-wrap gap-6">
        {(['privacy', 'terms', 'shipping'] as PolicyKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="font-mono text-[9px] uppercase tracking-[3px] opacity-50 hover:opacity-100 hover:text-[#d4604d] transition-all underline underline-offset-4"
          >
            {key === 'privacy' ? 'Privacy Policy' : key === 'terms' ? 'Terms & Conditions' : 'Shipping Policy'}
          </button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 z-[2000] bg-[#17191d]/70 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-x-4 bottom-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[680px] top-[10vh] md:top-[8vh] z-[2001] bg-[#e5f1ee] flex flex-col overflow-hidden rounded-t-2xl md:rounded-2xl"
              style={{ maxHeight: '88vh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b-2 border-[#17191d]/10 shrink-0">
                {/* Tab switcher */}
                <div className="flex gap-0 border-2 border-[#17191d] overflow-hidden">
                  {(['privacy', 'terms', 'shipping'] as PolicyKey[]).map(key => (
                    <button
                      key={key}
                      onClick={() => setActive(key)}
                      className={`font-mono text-[8px] uppercase tracking-[2px] font-bold px-4 py-2 border-r-2 border-[#17191d] last:border-r-0 transition-colors ${
                        active === key ? 'bg-[#17191d] text-white' : 'hover:bg-[#17191d]/10'
                      }`}
                    >
                      {key === 'privacy' ? 'Privacy' : key === 'terms' ? 'Terms' : 'Shipping'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActive(null)}
                  className="w-8 h-8 flex items-center justify-center border-2 border-[#17191d] hover:bg-[#17191d] hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Title */}
              <div className="px-8 pt-6 pb-4 shrink-0">
                <h2 className="font-display text-3xl uppercase tracking-tighter text-[#17191d]">
                  {POLICIES[active].title}
                </h2>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-8 pb-10">
                {POLICIES[active].content}
              </div>

              {/* Footer */}
              <div className="shrink-0 px-8 py-4 border-t-2 border-[#17191d]/10 flex items-center justify-between bg-[#e5f1ee]">
                <span className="font-mono text-[8px] uppercase tracking-[2px] opacity-30">
                  TESSCH © 2026
                </span>
                <button
                  onClick={() => setActive(null)}
                  className="font-mono text-[9px] uppercase tracking-[2px] font-bold bg-[#17191d] text-white px-6 py-2 hover:bg-[#d4604d] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}