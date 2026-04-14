import type { Metadata } from 'next'
import { Syne, Bebas_Neue, Space_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/ui/Nav'
import Footer from '@/components/ui/Footer'
import Cursor from '@/components/ui/Cursor'
import { AuthProvider } from './AuthProvider'
import { CartProvider } from '@/context/CartContext'

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
      <head>
        {/* Meta Pixel NoScript Fallback */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=988911026819470&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body suppressHydrationWarning>
        {/* 1. Meta Pixel Script */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '988911026819470');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* 2. Other Third-Party Scripts */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          strategy="lazyOnload"
        />

        <AuthProvider>
          <CartProvider>
            <Cursor />
            <Nav />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}