/**
 * Small date/time helpers for the trip scheduler. Dates are ISO `YYYY-MM-DD`
 * strings (which sort chronologically as plain strings) and times are 24h `HH:MM`.
 */

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/** Local date → `YYYY-MM-DD` (no timezone drift, unlike toISOString). */
export function isoOf(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Today as `YYYY-MM-DD` (client-local). */
export function todayISO(): string {
  return isoOf(new Date())
}

/** Parse `YYYY-MM-DD` into a local Date at midnight. */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** "4 Jul 2026" (or "4 Jul" with `{ year: false }`). */
export function formatNiceDate(iso?: string, opts?: { year?: boolean }): string {
  if (!iso) return ''
  const d = parseISO(iso)
  const base = `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`
  return opts?.year === false ? base : `${base} ${d.getFullYear()}`
}

/** "4–7 Jul 2026" | "28 Jun – 3 Jul 2026" | "4 Jul 2026" (single). */
export function formatDateRange(start?: string, end?: string): string {
  if (!start) return ''
  if (!end || end === start) return formatNiceDate(start)
  const s = parseISO(start)
  const e = parseISO(end)
  const sameYear = s.getFullYear() === e.getFullYear()
  const sameMonth = sameYear && s.getMonth() === e.getMonth()
  if (sameMonth) return `${s.getDate()}–${e.getDate()} ${MONTHS_SHORT[e.getMonth()]} ${e.getFullYear()}`
  if (sameYear) return `${formatNiceDate(start, { year: false })} – ${formatNiceDate(end)}`
  return `${formatNiceDate(start)} – ${formatNiceDate(end)}`
}

/** "06:00" → "6:00 AM". */
export function formatTime(hhmm?: string): string {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const ap = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`
}

/** Whole nights between two ISO dates (0 if missing/invalid). */
export function nightsBetween(start?: string, end?: string): number {
  if (!start || !end) return 0
  const ms = parseISO(end).getTime() - parseISO(start).getTime()
  return Math.max(0, Math.round(ms / 86_400_000))
}

/** Pickup slots, hourly 4:00 AM → 10:00 PM. */
export const TIME_SLOTS: string[] = Array.from({ length: 19 }, (_, i) =>
  `${String(i + 4).padStart(2, '0')}:00`,
)
