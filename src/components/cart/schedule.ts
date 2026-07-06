import type { CartItem, CartKind } from './CartContext'
import { formatDateRange, formatNiceDate, formatTime, nightsBetween } from '@/lib/datetime'

export type KindConfig = {
  mode: 'single' | 'range'
  prompt: string
  timeLabel: string
  timeWord: string
  unit?: 'days' | 'nights'
  /** Short line shown in the add-to-trip popup. */
  hint: string
}

/** How each kind of trip item is scheduled — single date vs. a date range, plus its time wording. */
export const SCHEDULE_CONFIG: Record<CartKind, KindConfig> = {
  package: {
    mode: 'single',
    prompt: 'Add trip date & pickup time',
    timeLabel: 'Pickup time',
    timeWord: 'pickup',
    hint: 'When should the trip start, and what pickup time suits you?',
  },
  experience: {
    mode: 'single',
    prompt: 'Add date & time',
    timeLabel: 'Preferred time',
    timeWord: 'around',
    hint: 'Which day works for you?',
  },
  car: {
    mode: 'range',
    prompt: 'Add rental dates & pickup',
    timeLabel: 'Pickup time',
    timeWord: 'pickup',
    unit: 'days',
    hint: 'Which dates do you need the cab, and when should we pick you up?',
  },
  hotel: {
    mode: 'range',
    prompt: 'Add check-in & check-out',
    timeLabel: 'Check-in time',
    timeWord: 'check-in',
    unit: 'nights',
    hint: 'Choose your check-in and check-out dates.',
  },
}

/** Human summary of an item's chosen date/time, e.g. "4–7 Jul 2026 · pickup 6:00 AM". Empty if no date yet. */
export function describeWhen(item: CartItem): string {
  const s = item.schedule
  if (!s?.startDate) return ''
  const cfg = SCHEDULE_CONFIG[item.kind]
  const datePart = cfg.mode === 'range' ? formatDateRange(s.startDate, s.endDate) : formatNiceDate(s.startDate)
  const timePart = s.time ? ` · ${cfg.timeWord} ${formatTime(s.time)}` : ''
  return `${datePart}${timePart}`
}

export function rangeCount(start: string, end: string, unit?: 'days' | 'nights'): string {
  const nights = nightsBetween(start, end)
  if (unit === 'nights') return `${nights} night${nights === 1 ? '' : 's'} stay`
  const days = nights + 1
  return `${days} day${days === 1 ? '' : 's'} selected`
}
