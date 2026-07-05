import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fraunces, hanken, spaceMono } from './fonts'
import './theme.css'
import { CartProvider } from '@/components/cart/CartContext'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { WhatsAppFab } from '@/components/chrome/WhatsAppFab'
import { getSiteSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: {
    default: 'Kartikart — Tour & Travel Agency, Deoghar',
    template: '%s · Kartikart',
  },
  description:
    'Taxi se Hotel tak, Khana se Heritage tak — Sab Kuch Best, Sirf Aapke Liye. Deoghar-based tour & travel packages across India, booked in a tap on WhatsApp.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  const hasLogo = existsSync(join(process.cwd(), 'public', 'brand', 'logo.png'))

  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${spaceMono.variable}`}>
      <body>
        <CartProvider>
          <Header whatsappNumber={settings.whatsappNumber} hasLogo={hasLogo} />
          {children}
          <Footer settings={settings} />
          <WhatsAppFab whatsappNumber={settings.whatsappNumber} />
        </CartProvider>
      </body>
    </html>
  )
}
