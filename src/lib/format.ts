/** Format a number as Indian rupees, or null when there's no price. */
export function formatPrice(n?: number | null): string | null {
  if (n === null || n === undefined) return null
  return `₹${Number(n).toLocaleString('en-IN')}`
}

export const CATEGORY_LABELS: Record<string, string> = {
  spiritual: 'Spiritual',
  adventure: 'Adventure',
  wildlife: 'Wildlife',
  beach: 'Beach',
  cultural: 'Cultural',
}

export const SUITED_LABELS: Record<string, string> = {
  families: 'Families',
  couples: 'Couples',
  groups: 'Groups',
  solo: 'Solo Travelers',
}

export function regionLabel(r?: string | null): string {
  return r === 'pan-india' ? 'Pan-India' : 'Deoghar & Local'
}

export function categoryLabel(c?: string | null): string {
  return c ? (CATEGORY_LABELS[c] ?? c) : ''
}

/** "2N / 3D" | "3D" | null */
export function durationLabel(nights?: number | null, days?: number | null): string | null {
  if (nights && days) return `${nights}N / ${days}D`
  if (days) return `${days}D`
  if (nights) return `${nights}N`
  return null
}
