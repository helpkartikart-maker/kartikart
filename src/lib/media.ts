import type { Media } from '@/payload-types'

/** Turn a Payload upload field (id | populated Media | null) into a usable image, or null. */
export function resolveMedia(
  m: number | Media | null | undefined,
): { url: string; alt: string } | null {
  if (m && typeof m === 'object' && 'url' in m && m.url) {
    return { url: m.url, alt: m.alt || '' }
  }
  return null
}
