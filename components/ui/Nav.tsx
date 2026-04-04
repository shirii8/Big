'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const NAV_LINKS = [
  { href: '/#home',         id: 'home',         label: 'Home' },
  { href: '/#how-it-works', id: 'how-it-works', label: 'How It Works' },
  { href: '/products',      id: 'range',        label: 'Range' }, 
  { href: '/#about',        id: 'about',        label: 'Story' },
]

export default function Nav() {
  const [activeId, setActiveId] = useState('home')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      // If on product routes, force Range active
      if (pathname.includes('/products')) {
        setActiveId('range')
        return
      }

      const sectionIds = ['home', 'how-it-works', 'range', 'about']
      const scrollPos = window.scrollY + 200

      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id)
        if (el && scrollPos >= el.offsetTop) {
          setActiveId(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return (
    
    <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-6 md:px-12 py-5 bg-[#d4604d]">
      <Link href="/" className="font-display text-2xl text-[#e5f1ee] font-bold">TESSCH.</Link>
      <ul className="hidden lg:flex gap-8 list-none m-0 p-0">
        {NAV_LINKS.map(({ href, label, id }) => {
          const isActive = activeId === id
          return (
            <li key={id} className="relative">
              <Link href={href} className={`font-mono text-[9px] uppercase tracking-[2px] font-bold transition-colors ${isActive ? 'text-[#17191d]' : 'text-[#e5f1ee]/70'}`}>
                {label}
              </Link>
              {isActive && (
                <motion.span layoutId="navDot" className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#17191d]" />
              )}
            </li>
          )
        })}
      </ul>
      <button className="bg-[#17191d] text-white font-mono text-[10px] px-6 py-2 uppercase">Pre-Order</button>
    </nav>
  )
}