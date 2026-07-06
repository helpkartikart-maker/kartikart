'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isoOf, MONTHS_LONG, parseISO, todayISO, WEEKDAYS } from '@/lib/datetime'
import styles from './Calendar.module.css'

type Props = {
  mode: 'single' | 'range'
  start?: string
  end?: string
  onSelect: (start?: string, end?: string) => void
}

/** Inline month calendar. Single mode picks one date; range mode picks start then end. Past dates are disabled. */
export function Calendar({ mode, start, end, onSelect }: Props) {
  const today = todayISO()
  const anchor = parseISO(start ?? today)
  const [view, setView] = useState({ y: anchor.getFullYear(), m: anchor.getMonth() })

  const firstDow = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells: (string | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(isoOf(new Date(view.y, view.m, d)))

  const t = parseISO(today)
  const canPrev = view.y > t.getFullYear() || (view.y === t.getFullYear() && view.m > t.getMonth())

  const go = (delta: number) => {
    let m = view.m + delta
    let y = view.y
    if (m < 0) {
      m = 11
      y -= 1
    } else if (m > 11) {
      m = 0
      y += 1
    }
    setView({ y, m })
  }

  const pick = (iso: string) => {
    if (mode === 'single') {
      onSelect(iso, undefined)
      return
    }
    if (!start || (start && end)) {
      onSelect(iso, undefined) // begin a new range
    } else if (iso >= start) {
      onSelect(start, iso) // close the range
    } else {
      onSelect(iso, undefined) // clicked earlier — restart from here
    }
  }

  return (
    <div className={styles.cal}>
      <div className={styles.head}>
        <button
          type="button"
          className={styles.nav}
          onClick={() => canPrev && go(-1)}
          disabled={!canPrev}
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <span className={styles.monthLabel}>
          {MONTHS_LONG[view.m]} {view.y}
        </span>
        <button type="button" className={styles.nav} onClick={() => go(1)} aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.weekdays} aria-hidden>
        {WEEKDAYS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div className={styles.grid} role="grid">
        {cells.map((iso, i) => {
          if (!iso) return <span key={i} className={styles.pad} />
          const past = iso < today
          const isStart = iso === start
          const isEnd = iso === end
          const selected = isStart || isEnd
          const between = mode === 'range' && start && end ? iso > start && iso < end : false
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              disabled={past}
              onClick={() => pick(iso)}
              aria-pressed={selected}
              aria-label={formatLong(iso)}
              className={[
                styles.day,
                past ? styles.past : '',
                iso === today ? styles.today : '',
                selected ? styles.selected : '',
                between ? styles.between : '',
                isStart && end ? styles.rangeStart : '',
                isEnd && iso !== start ? styles.rangeEnd : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {parseISO(iso).getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function formatLong(iso: string): string {
  const d = parseISO(iso)
  return `${MONTHS_LONG[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
