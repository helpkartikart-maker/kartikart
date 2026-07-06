import { describe, it, expect } from 'vitest'
import {
  normalizeWhatsappNumber,
  buildWhatsappLink,
  formatTripQuoteMessage,
  generalEnquiryMessage,
} from './whatsapp'

describe('normalizeWhatsappNumber', () => {
  it('strips spaces, plus, and punctuation to digits only', () => {
    expect(normalizeWhatsappNumber('+91 62012 34567')).toBe('916201234567')
  })
})

describe('buildWhatsappLink', () => {
  it('builds a wa.me link with a URL-encoded message', () => {
    const url = buildWhatsappLink({ whatsappNumber: '+91 6201234567', message: 'Hi & welcome!' })
    expect(url).toBe('https://wa.me/916201234567?text=Hi%20%26%20welcome!')
  })
})

describe('formatTripQuoteMessage', () => {
  it('lists selected items with meta and from-price, plus traveller details', () => {
    const msg = formatTripQuoteMessage({
      items: [
        { title: 'Baba Baidyanath Darshan', meta: '2N/3D', priceFrom: 5999 },
        { title: 'Innova Crysta (cab)', priceFrom: null },
      ],
      contact: { name: 'Ramesh', phone: '+91 90000 00000', travelers: 4, dates: 'March', notes: 'Need a big car' },
    })
    expect(msg).toContain('*Kartikart — Trip Quote Request*')
    expect(msg).toContain('*Selected (2)*')
    expect(msg).toContain('• Baba Baidyanath Darshan (2N/3D) — from ₹5,999')
    expect(msg).toContain('• Innova Crysta (cab)')
    expect(msg).toContain('Ramesh')
    expect(msg).toContain('Travellers: 4')
    expect(msg).toContain('Need a big car')
    expect(msg).toContain('website discount (up to 10%)')
  })

  it('works with items only (no contact details)', () => {
    const msg = formatTripQuoteMessage({ items: [{ title: 'Golden Triangle' }] })
    expect(msg).toContain('*Selected (1)*')
    expect(msg).toContain('• Golden Triangle')
    expect(msg).not.toContain('*Traveller*')
  })

  it("includes each item's chosen date/time when provided", () => {
    const msg = formatTripQuoteMessage({
      items: [{ title: 'Deoghar ⇄ Ranchi Taxi', priceFrom: 4499, when: '4–7 Jul 2026 · pickup 6:00 AM' }],
    })
    expect(msg).toContain('• Deoghar ⇄ Ranchi Taxi — from ₹4,499')
    expect(msg).toContain('🗓️ 4–7 Jul 2026 · pickup 6:00 AM')
  })
})

describe('generalEnquiryMessage', () => {
  it('returns a friendly opener', () => {
    expect(generalEnquiryMessage()).toMatch(/plan a trip/i)
  })
})
