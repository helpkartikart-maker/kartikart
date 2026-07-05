import type { Package, SiteSetting } from '@/payload-types'

export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kartikart.in').replace(/\/$/, ''),
  name: 'Kartikart',
  legalName: 'Kartikart Tour & Travel Agency',
  description:
    'Taxi se Hotel tak, Khana se Heritage tak — Sab Kuch Best, Sirf Aapke Liye. Deoghar-based tour & travel packages across India, booked on WhatsApp.',
  ogImage: '/og.jpg',
  locale: 'en_IN',
}

export function absoluteUrl(path = ''): string {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}

/** Site-wide TravelAgency / LocalBusiness structured data. */
export function travelAgencyLd(settings: SiteSetting) {
  const ig = settings.instagram?.replace('@', '')
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl('/brand/logo.png'),
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Deoghar',
      addressRegion: 'Jharkhand',
      postalCode: '814112',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'Country', name: 'India' },
    ...(ig ? { sameAs: [`https://instagram.com/${ig}`] } : {}),
  }
}

/** Per-package Product structured data (enables price rich results). */
export function packageLd(pkg: Package) {
  const region = pkg.region === 'pan-india' ? 'Pan-India' : 'Deoghar & Local'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    ...(pkg.shortPitch ? { description: pkg.shortPitch } : {}),
    category: `${region} tour package`,
    brand: { '@type': 'Brand', name: 'Kartikart' },
    ...(pkg.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            price: pkg.priceFrom,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: absoluteUrl(`/packages/${pkg.slug}`),
          },
        }
      : {}),
  }
}
