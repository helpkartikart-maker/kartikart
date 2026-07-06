/** Strip everything but digits (so "+91 62012 34567" → "916201234567" for wa.me). */
export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/\D/g, '')
}

/** Build a click-to-chat WhatsApp deep link with a URL-encoded prefilled message. */
export function buildWhatsappLink(params: { whatsappNumber: string; message: string }): string {
  const digits = normalizeWhatsappNumber(params.whatsappNumber)
  return `https://wa.me/${digits}?text=${encodeURIComponent(params.message)}`
}

function rupee(n: number): string {
  return `₹${Number(n).toLocaleString('en-IN')}`
}

/** A single line item in a trip quote (a package, car, hotel or experience). */
export type QuoteItem = {
  title: string
  meta?: string | null
  priceFrom?: number | null
}

/** Traveller-supplied details captured at checkout. */
export type QuoteContact = {
  name?: string
  phone?: string
  travelers?: string | number
  dates?: string
  notes?: string
}

/**
 * Compose the full itemized trip-quote message sent to Kartikart at checkout.
 * WhatsApp fires ONLY here (final checkout) — not per item.
 */
export function formatTripQuoteMessage(params: { items: QuoteItem[]; contact?: QuoteContact }): string {
  const { items, contact = {} } = params
  const L: string[] = []
  L.push('*Kartikart — Trip Quote Request*')
  L.push('━━━━━━━━━━━━━━━━━━')
  L.push('')

  if (contact.name || contact.phone) {
    L.push('*Traveller*')
    if (contact.name) L.push(contact.name)
    if (contact.phone) L.push(contact.phone)
    L.push('')
  }

  if (contact.travelers || contact.dates) {
    L.push('*Trip*')
    if (contact.travelers) L.push(`Travellers: ${contact.travelers}`)
    if (contact.dates) L.push(`Dates: ${contact.dates}`)
    L.push('')
  }

  L.push(`*Selected (${items.length})*`)
  items.forEach((i) => {
    const meta = i.meta ? ` (${i.meta})` : ''
    const price = i.priceFrom ? ` — from ${rupee(i.priceFrom)}` : ''
    L.push(`• ${i.title}${meta}${price}`)
  })
  L.push('')

  if (contact.notes) {
    L.push('*Notes*')
    L.push(contact.notes)
    L.push('')
  }

  L.push('Please apply my *5% website discount* and share your best quote. 🙏')
  L.push('— Sent from kartikart.in')
  return L.join('\n')
}

/** A general "plan my trip" opener for the contact / FAB button (not per-item booking). */
export function generalEnquiryMessage(): string {
  return 'Hi Kartikart! I would like to plan a trip. Please help me with a quote.'
}
