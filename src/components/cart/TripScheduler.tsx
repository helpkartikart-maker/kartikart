'use client'

import { useState } from 'react'
import { CalendarDays, Check, Clock } from 'lucide-react'
import { useCart, type CartItem, type CartSchedule } from './CartContext'
import { Calendar } from './Calendar'
import { SCHEDULE_CONFIG, describeWhen, rangeCount } from './schedule'
import { formatTime, TIME_SLOTS } from '@/lib/datetime'
import styles from './TripScheduler.module.css'

export function TripScheduler({ item }: { item: CartItem }) {
  const { update } = useCart()
  const cfg = SCHEDULE_CONFIG[item.kind]
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
