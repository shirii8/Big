import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TESSCH : Launching 17.04.2026',
  description: 'Modular Sneakers. Smarter by Design. Website coming live on 17th April.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-void">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased selection:bg-acid selection:text-void">
        <main>{children}</main>
      </body>
    </html>
  )
}

// import type { Metadata } from 'next'
// import Script from 'next/script'
// import './globals.css'
// import Nav from '@/components/ui/Nav'
// import Footer from '@/components/ui/Footer'
// import Cursor from '@/components/ui/Cursor'

// export const metadata: Metadata = {
//   title: 'TESSCH — Modular Sneakers. Smarter by Design.',
//   description: 'Keep the sole. Swap the upper. Community first, brand second.',
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       {/* 1. Added suppressHydrationWarning to stop extension errors */}
//       <body suppressHydrationWarning>
//         <Script
//           src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
//           strategy="beforeInteractive"
//         />
//         <Cursor />
//         <Nav />
//         {/* 2. Standard practice: wrap children in a fragment or div if needed, 
//                but direct main is fine. */}
//         <main>{children}</main>
//         <Footer />
//       </body>
//     </html>
//   )
// }