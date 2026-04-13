'use client'
import PolicyModal from './PolicyModal'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#e5f1ee] border-t-2 border-[#17191d] pt-16 pb-8 px-6 md:px-12 text-[#17191d]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* ── BRAND COLUMN ── */}
          <div className="flex flex-col justify-between">
            <div>
              <Link href="/" className="font-display text-[32px] tracking-tighter uppercase font-bold leading-none">
                TESSCH<span className="text-[#d4604d]">.</span>
              </Link>
              <p className="font-mono text-[10px] uppercase tracking-[2px] mt-4 opacity-60 max-w-[240px]">
                Modular footwear architecture. <br/> smarter, not cheaper.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col gap-2">
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40">The Channel</p>
              <div className="flex gap-4">
                <a href="https://instagram.com/tesschstore" target="_blank" rel="noreferrer" className="font-mono text-[11px] font-bold hover:text-[#d4604d] transition-colors">INSTAGRAM</a>
                <a href="https://www.linkedin.com/company/tesschstore/" target="_blank" rel="noreferrer" className="font-mono text-[11px] font-bold hover:text-[#d4604d] transition-colors">LINKEDIN</a>
              </div>
            </div>
          </div>

          {/* ── NAV COLUMN ── */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono text-[9px] tracking-[3px] uppercase opacity-40 mb-6">Explore</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: 'Home', href: '/#home' },
                  { label: 'How It Works', href: '/#how-it-works' },
                  { label: 'Range', href: '/products' },
                  { label: 'Story', href: '/#about' }
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="font-mono text-[11px] uppercase font-bold hover:text-[#d4604d] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[9px] tracking-[3px] uppercase opacity-40 mb-6">Legal</h4>
              <PolicyModal />
              {/* <ul className="flex flex-col gap-3">
                {['Privacy', 'Terms', 'Shipment'].map((item) => (
                  <li key={item} className="font-mono text-[11px] uppercase opacity-60 hover:opacity-100 cursor-pointer">{item}</li>
                ))}
              </ul> */}
            </div>
          </div>

          {/* ── FOUNDERS / CONTACT ── */}
          <div className="bg-[#17191d] text-[#e5f1ee] p-8 flex flex-col justify-between">
            <div>
              <h4 className="font-mono text-[9px] tracking-[3px] uppercase opacity-40 mb-6 text-[#e5f1ee]">Core Team</h4>
              <div className="space-y-4">
                <div className='flex flex-row gap-10 justify-between'>
                  <div>
                      <p className="font-display text-xl uppercase tracking-tight">Mihir Mandloi</p>
                      <p className="font-mono text-[9px] opacity-40 uppercase">Co-founder - Strategy, Operations, Supply Chain</p>
                  </div>
                  
                  <img className='h-15 w-15 rounded-full px-2' src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775941799/virat-kohli_1_mbb9r3.jpg" alt="" />
                </div>
                <div className='flex flex-row gap-10 justify-between'>
                  <div>
                  <p className="font-display text-xl uppercase tracking-tight">Pratham Shah</p>
                  <p className="font-mono text-[9px] opacity-40 uppercase">Co-founder - Branding & Positioning</p>
                </div>
                  
                  <img className='h-15 w-15 rounded-full px-2' src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775941799/virat-kohli_1_mbb9r3.jpg" alt="" />
                </div>
                <div className='flex flex-row gap-10 justify-between'>
                   <div>
                  <p className="font-display text-xl uppercase tracking-tight">Sarthak Patil</p>
                  <p className="font-mono text-[9px] opacity-40 uppercase">Founding Member - Growth & Social Media</p>
                </div>
                  
                  <img className='h-15 w-15 rounded-full px-2' src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775941799/virat-kohli_1_mbb9r3.jpg" alt="" />
                </div>
                <div className='flex flex-row gap-10 justify-between'>
                  <div>
                  <p className="font-display text-xl uppercase tracking-tight">Daksh Battula</p>
                  <p className="font-mono text-[9px] opacity-40 uppercase">Founding Member - Sales & Additional Operations</p>
                </div>
                  
                  <img className='h-15 w-15 rounded-full px-2' src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775941799/virat-kohli_1_mbb9r3.jpg" alt="" />
                </div>
                
               
                
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-[#e5f1ee]/10 flex flex-col gap-2">
              <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40">Contact</p>
              <a href="https://www.linkedin.com/company/tesschstore/" className="font-mono text-[11px] font-bold hover:text-[#d4604d] transition-colors">@TESSCH.IN</a>
              <a href="https://www.instagram.com/tesschstore/" className="font-mono text-[11px] font-bold hover:text-[#d4604d] transition-colors">@TESSCHSTORE</a>
            </div>
          </div>

        </div>

        {/* ── SUB-FOOTER ── */}
        <div className="border-t border-[#17191d]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <p className="font-mono text-[9px] opacity-40 uppercase tracking-[1px]">
               © {new Date().getFullYear()} TESSCH ARCHIVE
             </p>
             <div className="h-3 w-[1px] bg-[#17191d]/20 hidden md:block" />
             {/* <p className="font-mono text-[9px] font-bold uppercase tracking-[2px]">
               Created by — Shriya
             </p> */}
          </div>
          
          <div className="flex gap-6">
            <span className="font-mono text-[9px] opacity-40 uppercase">Break the Norms</span>
          </div>
        </div>
      </div>
    </footer>
  )
}