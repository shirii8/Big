'use client'

import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    const res = await fetch('/api/checkout', { method: 'POST' })
    const data = await res.json()
    
    if (data.url) {
      window.location.href = data.url // Redirect to secure Stripe page
    } else {
      alert("Checkout failed. Try again.")
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-[#17191d] text-[#e5f1ee] py-5 font-mono font-bold uppercase tracking-[3px] hover:bg-[#d4604d] transition-all"
    >
      {loading ? "GENERATING SECURE LINK..." : "PROCEED TO CHECKOUT →"}
    </button>
  )
}