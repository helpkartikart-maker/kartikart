'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, Check, Clock, X } from 'lucide-react'
import type { CartItem, CartSchedule } from './CartContext'
import { Calendar } from './Calendar'
import { SCHEDULE_CONFIG, rangeCount } from './schedule'
import { formatTime, TIME_SLOTS } from '@/lib/datetime'
import styles from './ScheduleModal.module.css'

/** Quick date/time popup shown when adding an item to the trip. */
export function ScheduleModal({
  item,
  onConfirm,
  onClose,
}: {
  item: CartItem
  onConfirm: (schedule?: CartSchedule) => void
  onClose: () => void
}) {
  const cfg = SCHEDULE_CONFIG[item.kind]
  const [sched, setSched] = useState<CartSchedule>(item.schedule ?? {})
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!mounted) return null
  const hasDate = Boolean(sched.startDate)

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Choose dates for ${item.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className={styles.head}>
          <span className={styles.eyebrow}>
            <CalendarDays size={14} /> {cfg.mode === 'range' ? 'Choose your dates' : 'Choose your date'}
          </span>
          <h3>{item.title}</h3>
          <p>{cfg.hint}</p>
        </div>

        <div className={styles.body}>
          <Calendar
            mode={cfg.mode}
            start={sched.startDate}
            end={sched.endDate}
            onSelect={(startDate, endDate) => setSched((s) => ({ ...s, startDate, endDate }))}
          />
          {cfg.mode === 'range' && sched.startDate && sched.endDate ? (
            <p className={styles.count}>{rangeCount(sched.startDate, sched.endDate, cfg.unit)}</p>
          ) : null}
          <label className={styles.time}>
            <span className={styles.timeLabel}>
              <Clock size={13} /> {cfg.timeLabel}
            </span>
            <select
              className={styles.timeSelect}
              value={sched.time ?? ''}
              onChange={(e) => setSched((s) => ({ ...s, time: e.target.value || undefined }))}
            >
              <option value="">Flexible</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {formatTime(t)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.skip} onClick={() => onConfirm(undefined)}>
            Skip for now
          </button>
          <button
            type="button"
            className={styles.confirm}
            onClick={() => onConfirm(hasDate ? sched : undefined)}
          >
            <Check size={16} /> Add to trip
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
