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
import { siteConfig, travelAgencyLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'

const TITLE = 'Kartikart — Tour & Travel Agency, Deoghar'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: TITLE, template: '%s · Kartikart' },
  description: siteConfig.description,
  applicationName: 'Kartikart',
  keywords: [
    'Deoghar tour',
    'Baba Baidyanath Dham',
    'Deoghar travel agency',
    'Deoghar taxi service',
    'Baidyanath Jyotirlinga darshan',
    'Deoghar hotels',
    'pan India tour packages',
    'Kartikart',
  ],
  authors: [{ name: siteConfig.legalName }],
  alternates: { canonical: '/' },
  icons: { icon: '/icon.png', apple: '/icon.png' },
  openGraph: {
    type: 'website',
    siteName: 'Kartikart',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: TITLE,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Kartikart — Taxi se Hotel tak, Khana se Heritage tak',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  const hasLogo = existsSync(join(process.cwd(), 'public', 'brand', 'logo.png'))

  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${spaceMono.variable}`}>
      <body>
        <a href="#main-content" className="kk-skip">
          Skip to content
        </a>
        <CartProvider>
          <Header whatsappNumber={settings.whatsappNumber} hasLogo={hasLogo} />
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <Footer settings={settings} />
          <WhatsAppFab whatsappNumber={settings.whatsappNumber} />
        </CartProvider>
        <JsonLd data={travelAgencyLd(settings)} />
      </body>
    </html>
  )
}
