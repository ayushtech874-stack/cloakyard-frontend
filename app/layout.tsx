import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { Navbar } from '@/components/navbar/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { LoginModal } from '@/components/auth/LoginModal'
import { Toaster } from '@/components/ui/Toaster'
import Script from 'next/script'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Cloakyard — Wear the Yard',
  description: 'Premium streetwear. Oversized, Boxy, Custom. Indian brand.',
  keywords: 'streetwear, oversized tshirts, boxy fit, custom tshirts, India',
  openGraph: {
    title: 'Cloakyard',
    description: 'Premium streetwear. Wear the Yard.',
    url: 'https://cloakyard.in',
    siteName: 'Cloakyard',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Public+Sans:wght@300;400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <CartDrawer />
          <LoginModal />
          <main>{children}</main>
          <Toaster />
          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        </ThemeProvider>
      </body>
    </html>
  )
}
