'use client'

import { useState } from 'react'
import { CalendarDays, Check, Clock } from 'lucide-react'
import { useCart, type CartItem, type CartKind, type CartSchedule } from './CartContext'
import { Calendar } from './Calendar'
import { formatDateRange, formatNiceDate, formatTime, nightsBetween, TIME_SLOTS } from '@/lib/datetime'
import styles from './TripScheduler.module.css'

type KindConfig = {
  mode: 'single' | 'range'
  prompt: string
  timeLabel: string
  timeWord: string
  unit?: 'days' | 'nights'
}

const CONFIG: Record<CartKind, KindConfig> = {
  package: { mode: 'single', prompt: 'Add trip date & pickup time', timeLabel: 'Pickup time', timeWord: 'pickup' },
  experience: { mode: 'single', prompt: 'Add date & time', timeLabel: 'Preferred time', timeWord: 'around' },
  car: { mode: 'range', prompt: 'Add rental dates & pickup', timeLabel: 'Pickup time', timeWord: 'pickup', unit: 'days' },
  hotel: { mode: 'range', prompt: 'Add check-in & check-out', timeLabel: 'Check-in time', timeWord: 'check-in', unit: 'nights' },
}

/** Human summary of an item's chosen date/time, e.g. "4–7 Jul 2026 · pickup 6:00 AM". Empty if no date yet. */
export function describeWhen(item: CartItem): string {
  const s = item.schedule
  if (!s?.startDate) return ''
  const cfg = CONFIG[item.kind]
  const datePart = cfg.mode === 'range' ? formatDateRange(s.startDate, s.endDate) : formatNiceDate(s.startDate)
  const timePart = s.time ? ` · ${cfg.timeWord} ${formatTime(s.time)}` : ''
  return `${datePart}${timePart}`
}

function rangeCount(start: string, end: string, unit?: 'days' | 'nights'): string {
  const nights = nightsBetween(start, end)
  if (unit === 'nights') return `${nights} night${nights === 1 ? '' : 's'} stay`
  const days = nights + 1
  return `${days} day${days === 1 ? '' : 's'} selected`
}

export function TripScheduler({ item }: { item: CartItem }) {
  const { update } = useCart()
  const cfg = CONFIG[item.kind]
  const s = item.schedule ?? {}
  const [open, setOpen] = useState(false)
  const summary = describeWhen(item)
  const hasDate = Boolean(s.startDate)

  const setSched = (patch: Partial<CartSchedule>) => update(item.id, { schedule: { ...s, ...patch } })

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.toggle} ${hasDate ? styles.set : styles.unset}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <CalendarDays size={15} />
        <span className={styles.summary}>{summary || cfg.prompt}</span>
        <span className={styles.chev}>{open ? 'Done' : hasDate ? 'Edit' : 'Choose'}</span>
      </button>

      {open ? (
        <div className={styles.panel}>
          <Calendar
            mode={cfg.mode}
            start={s.startDate}
            end={s.endDate}
            onSelect={(startDate, endDate) => setSched({ startDate, endDate })}
          />
          {cfg.mode === 'range' && s.startDate && s.endDate ? (
            <p className={styles.count}>{rangeCount(s.startDate, s.endDate, cfg.unit)}</p>
          ) : null}
          <label className={styles.timeField}>
            <span className={styles.timeLabel}>
              <Clock size={13} /> {cfg.timeLabel}
            </span>
            <select
              className={styles.timeSelect}
              value={s.time ?? ''}
              onChange={(e) => setSched({ time: e.target.value || undefined })}
            >
              <option value="">Flexible</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {formatTime(t)}
                </option>
              ))}
            </select>
          </label>
          {hasDate ? (
            <button type="button" className={styles.done} onClick={() => setOpen(false)}>
              <Check size={15} /> Done
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
