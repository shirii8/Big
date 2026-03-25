'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/products',     label: 'Range' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/ar-view',      label: 'AR View' },
  { href: '/about',        label: 'Our Story' },
  { href: '/drop',         label: 'Drop 001' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-void/95 backdrop-blur-xl shadow-[0_1px_0_rgba(198,255,0,0.06)]'
          : 'py-5 bg-gradient-to-b from-void/90 to-transparent backdrop-blur-sm'
      }`}>
        <Link href="/" className="font-display text-[28px] tracking-[4px] text-acid no-underline cursor-none leading-none">
          TESSCH<span className="text-chrome">.</span>
        </Link>

        <ul className="hidden md:flex gap-7 list-none">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`nav-underline font-mono text-[10px] tracking-[2px] uppercase no-underline transition-colors duration-200 cursor-none ${
                pathname === href ? 'text-acid' : 'text-muted hover:text-acid'
              }`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/drop" className="hidden md:inline-block clip-btn bg-acid text-void font-mono text-[10px] font-bold tracking-[2px] uppercase px-5 py-3 no-underline cursor-none transition-colors hover:bg-white">
          Pre-Order Now
        </Link>

        <button
          className="md:hidden flex flex-col gap-[5px] p-1 bg-transparent border-0 cursor-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-chrome transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-6 h-px bg-chrome transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-chrome transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </nav>

      <div className={`mobile-menu fixed inset-0 z-[490] bg-void/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 ${menuOpen 
    ? 'opacity-100 pointer-events-auto translate-y-0' 
    : 'opacity-0 pointer-events-none -translate-y-10'
  }`}>
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className="font-display text-[48px] tracking-[4px] text-chrome no-underline hover:text-acid transition-colors duration-200 cursor-none">
            {label}
          </Link>
        ))}
        <Link href="/drop" className="clip-btn bg-acid text-void font-mono text-xs font-bold tracking-widest uppercase px-10 py-4 no-underline cursor-none mt-4 hover:bg-white transition-colors inline-block">
          Pre-Order Now
        </Link>
        <p className="shriya-credit mt-6">Created by — Shriya</p>
      </div>
    </>
  )
}