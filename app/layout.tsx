
import type { Metadata } from 'next'
import { Syne, Bebas_Neue, Space_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/ui/Nav'
import Footer from '@/components/ui/Footer'
import Cursor from '@/components/ui/Cursor'

const syne = Syne({ subsets: ['latin'], variable: '--font-body' })
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'TESSCH — Modular Sneakers. Smarter by Design.',
  description: 'Keep the sole. Swap the upper. Community first, brand second.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${bebas.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          strategy="lazyOnload"
        />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}