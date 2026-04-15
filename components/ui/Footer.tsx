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
              <Link href="/" className="flex flex-row text-[32px] tracking-tighter uppercase font-bold leading-none">
                 <img className="h-8 w-24" src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1776261459/logotext_sa4h8x.svg" alt="" /><span className="text-[#d4604d]">.</span>
              </Link>
              <p className="font-mono text-[10px] uppercase tracking-[2px] mt-4 opacity-60 max-w-[240px]">
                Modular footwear architecture. <br/> Breaking The Norms!
              </p>
            </div>
            
            <div className="mt-8 flex flex-col gap-2">
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-80">The Channel</p>
              <div className="flex gap-4">
                <a href="https://instagram.com/tesschstore" target="_blank" rel="noreferrer" className="font-mono text-[11px] font-bold hover:text-[#d4604d] transition-colors uppercase">Instagram</a>
                <a href="https://www.linkedin.com/company/tesschstore/" target="_blank" rel="noreferrer" className="font-mono text-[11px] font-bold hover:text-[#d4604d] transition-colors uppercase">Linkedin</a>
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
            </div>
          </div>

          {/* ── CORE TEAM COLUMN ── */}
          <div className="bg-[#17191d] text-[#e5f1ee] p-8 flex flex-col justify-between border-l border-[#e5f1ee]/10">
            <div>
              <h4 className="font-mono text-[9px] tracking-[4px] uppercase opacity-60 mb-8">Core Team</h4>
              <div className="space-y-8">
                
                {/* 1. MIHIR MANDLOI */}
                <div className="flex flex-row justify-between items-center group">
                  <div className="flex flex-col gap-1">
                    <p className="font-display text-xl uppercase tracking-tighter">Mihir Mandloi</p>
                    <p className="font-mono text-[9px] opacity-80 uppercase tracking-widest leading-tight max-w-[180px]">
                      Co-founder — Strategy, Ops, Supply Chain
                    </p>
                    <TeamLinkedIn href="https://www.linkedin.com/in/mihirmandloi?utm_source=share_via&utm_content=profile&utm_medium=member_android" />
                  </div>
                  <img className="h-14 w-14 rounded-full grayscale group-hover:grayscale-0 border border-[#e5f1ee]/20 transition-all object-cover" src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1776242225/WhatsApp_Image_2026-04-13_at_21.19.56_bcmljn.jpg" alt="" />
                </div>

                {/* 2. PRATHAM SHAH */}
                <div className="flex flex-row justify-between items-center group">
                  <div className="flex flex-col gap-1">
                    <p className="font-display text-xl uppercase tracking-tighter">Pratham Shah</p>
                    <p className="font-mono text-[9px] opacity-80 uppercase tracking-widest leading-tight">
                      Co-founder — Branding <br/>
                      <span className="opacity-100 text-[#d4604d]">IIT KANPUR</span>
                    </p>
                    <TeamLinkedIn href="https://www.linkedin.com/in/pratham-shah-iitkanpur?utm_source=share_via&utm_content=profile&utm_medium=member_android" />
                  </div>
                  <img className="h-14 w-14 rounded-full grayscale group-hover:grayscale-0 border border-[#e5f1ee]/20 transition-all object-cover" src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1776242225/WhatsApp_Image_2026-04-13_at_21.19.58_1_a5upby.jpg" alt="" />
                </div>

                {/* 3. SARTHAK PATIL */}
                <div className="flex flex-row justify-between items-center group">
                  <div className="flex flex-col gap-1">
                    <p className="font-display text-xl uppercase tracking-tighter">Sarthak Patil</p>
                    <p className="font-mono text-[9px] opacity-80 uppercase tracking-widest leading-tight">
                      Founding Member — Growth <br/>
                      <span className="opacity-100 text-[#d4604d]">IIT KANPUR</span>
                    </p>
                    <TeamLinkedIn href="https://www.linkedin.com/in/sarthak-patil-140aa2256?utm_source=share_via&utm_content=profile&utm_medium=member_android" />
                  </div>
                  <img className="h-14 w-14 rounded-full grayscale group-hover:grayscale-0 border border-[#e5f1ee]/20 transition-all object-cover" src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1776242225/WhatsApp_Image_2026-04-13_at_21.19.58_zl6wzg.jpg" alt="" />
                </div>

                {/* 4. DAKSH BATTULA */}
                <div className="flex flex-row justify-between items-center group">
                  <div className="flex flex-col gap-1">
                    <p className="font-display text-xl uppercase tracking-tighter">Daksh  Battula</p>
                    <p className="font-mono text-[9px] opacity-80 uppercase tracking-widest leading-tight">
                      Founding Member — Sales <br/>
                      <span className="opacity-100 text-[#d4604d]">IIT KANPUR</span>
                    </p>
                    <TeamLinkedIn href="https://www.linkedin.com/in/daksh-battula-48151436a?utm_source=share_via&utm_content=profile&utm_medium=member_android" />
                  </div>
                  <img className="h-14 w-14 rounded-full grayscale group-hover:grayscale-0 border border-[#e5f1ee]/20 transition-all object-cover" src="https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1776242225/WhatsApp_Image_2026-04-13_at_21.19.57_j7ztme.jpg" alt="" />
                </div>

              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t border-[#e5f1ee]/10 flex flex-col gap-2">
              <p className="font-mono text-[8px] uppercase tracking-[3px] opacity-40">Contact</p>
              <a href="https://www.linkedin.com/company/tesschstore/" className="font-mono text-[10px] font-bold hover:text-[#d4604d] transition-colors tracking-[2px]">@TESSCH.IN</a>
              <a href="https://www.instagram.com/tesschstore/" className="font-mono text-[10px] font-bold hover:text-[#d4604d] transition-colors tracking-[2px]">@TESSCHSTORE</a>
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
          </div>
          
          <div className="flex gap-6">
            <span className="font-mono text-[9px] opacity-40 uppercase tracking-[2px]">Break the Norms</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── LOCAL HELPER COMPONENT ───
function TeamLinkedIn({ href }: { href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="flex items-center gap-2 mt-1 group/link w-fit"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
        alt="LinkedIn" 
        className="w-2.5 h-2.5 grayscale group-hover/link:grayscale-0 transition-all"
      />
      <span className="font-mono text-[8px] font-bold text-[#e5f1ee] opacity-60 group-hover/link:opacity-100 group-hover/link:text-[#d4604d] transition-all tracking-[2px]">
        LINKEDIN
      </span>
    </a>
  );
}