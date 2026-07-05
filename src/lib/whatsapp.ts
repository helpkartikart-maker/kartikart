/** Strip everything but digits (so "+91 62012 34567" → "916201234567" for wa.me). */
export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/\D/g, '')
}

/** Build a click-to-chat WhatsApp deep link with a URL-encoded prefilled message. */
export function buildWhatsappLink(params: { whatsappNumber: string; message: string }): string {
  const digits = normalizeWhatsappNumber(params.whatsappNumber)
  return `https://wa.me/${digits}?text=${encodeURIComponent(params.message)}`
}

/** Compose a friendly, prefilled enquiry message for a tour package. */
export function packageEnquiryMessage(pkg: {
  title: string
  region?: string
  durationNights?: number | null
  durationDays?: number | null
}): string {
  const dur =
    pkg.durationNights && pkg.durationDays ? ` (${pkg.durationNights}N/${pkg.durationDays}D)` : ''
  const region = pkg.region ? ` [${pkg.region}]` : ''
  return `Hi Kartikart! I'd like a quote for *${pkg.title}*${dur}${region}. Please share details & availability.`
}
