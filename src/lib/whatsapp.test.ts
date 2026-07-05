import { describe, it, expect } from 'vitest'
import { normalizeWhatsappNumber, buildWhatsappLink, packageEnquiryMessage } from './whatsapp'

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

describe('packageEnquiryMessage', () => {
  it('includes the bolded title, duration, and region', () => {
    const msg = packageEnquiryMessage({
      title: 'Baba Baidyanath Darshan',
      region: 'Deoghar & Local',
      durationNights: 2,
      durationDays: 3,
    })
    expect(msg).toContain('*Baba Baidyanath Darshan*')
    expect(msg).toContain('(2N/3D)')
    expect(msg).toContain('[Deoghar & Local]')
  })

  it('omits duration when nights/days are missing', () => {
    const msg = packageEnquiryMessage({ title: 'Custom Trip' })
    expect(msg).toContain('*Custom Trip*')
    expect(msg).not.toContain('N/')
  })
})
