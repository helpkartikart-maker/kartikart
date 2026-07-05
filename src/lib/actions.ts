'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Best-effort lead capture: logs a trip-quote request to the Enquiries collection
 * so the team sees leads in /admin even if the WhatsApp chat is missed. Runs
 * server-side via the Local API (bypasses the collection's disabled public create).
 * Never throws — failures are swallowed so the WhatsApp handoff is never blocked.
 */
export async function logEnquiry(input: {
  name?: string
  phone?: string
  message: string
  subjectRef?: string
  travelers?: string
  dates?: string
}): Promise<{ ok: boolean }> {
  try {
    const payload = await getPayload({ config })
    const travelers = input.travelers ? Number(input.travelers) : undefined
    await payload.create({
      collection: 'enquiries',
      overrideAccess: true,
      data: {
        subjectType: 'custom',
        name: input.name,
        phone: input.phone,
        message: input.message,
        subjectRef: input.subjectRef,
        travelers: travelers && !Number.isNaN(travelers) ? travelers : undefined,
        dates: input.dates,
      },
    })
    return { ok: true }
  } catch (err) {
    console.error('logEnquiry failed (non-blocking):', err)
    return { ok: false }
  }
}
