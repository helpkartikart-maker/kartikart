import { describe, it, expect } from 'vitest'
import { formatDateRange, formatNiceDate, formatTime, nightsBetween, isoOf } from './datetime'

describe('formatNiceDate', () => {
  it('formats an ISO date with and without year', () => {
    expect(formatNiceDate('2026-07-04')).toBe('4 Jul 2026')
    expect(formatNiceDate('2026-07-04', { year: false })).toBe('4 Jul')
    expect(formatNiceDate(undefined)).toBe('')
  })
})

describe('formatDateRange', () => {
  it('collapses a same-month range', () => {
    expect(formatDateRange('2026-07-04', '2026-07-07')).toBe('4–7 Jul 2026')
  })
  it('spans months and falls back to a single date', () => {
    expect(formatDateRange('2026-06-28', '2026-07-03')).toBe('28 Jun – 3 Jul 2026')
    expect(formatDateRange('2026-07-04')).toBe('4 Jul 2026')
    expect(formatDateRange('2026-07-04', '2026-07-04')).toBe('4 Jul 2026')
  })
})

describe('formatTime', () => {
  it('converts 24h to 12h with AM/PM', () => {
    expect(formatTime('06:00')).toBe('6:00 AM')
    expect(formatTime('13:00')).toBe('1:00 PM')
    expect(formatTime('00:00')).toBe('12:00 AM')
    expect(formatTime('')).toBe('')
  })
})

describe('nightsBetween', () => {
  it('counts whole nights', () => {
    expect(nightsBetween('2026-07-04', '2026-07-07')).toBe(3)
    expect(nightsBetween('2026-07-04', '2026-07-04')).toBe(0)
    expect(nightsBetween(undefined, '2026-07-07')).toBe(0)
  })
})

describe('isoOf', () => {
  it('formats a local date without timezone drift', () => {
    expect(isoOf(new Date(2026, 6, 4))).toBe('2026-07-04')
  })
})
