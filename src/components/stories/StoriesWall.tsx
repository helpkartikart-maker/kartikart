'use client'

import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import type { Story } from '@/payload-types'
import { CATEGORY_LABELS } from '@/lib/format'
import styles from './StoriesWall.module.css'

const TYPES = ['all', ...Object.keys(CATEGORY_LABELS)]

export function StoriesWall({ stories }: { stories: Story[] }) {
  const [type, setType] = useState('all')
  const filtered = useMemo(
    () => stories.filter((s) => type === 'all' || s.tripType === type),
    [stories, type],
  )

  return (
    <div>
      <div className={styles.filters}>
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={styles.pill}
            data-active={type === t}
          >
            {t === 'all' ? 'All' : CATEGORY_LABELS[t]}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((s) => (
            <figure key={s.id} className={styles.card}>
              <div className={styles.stars} aria-label={`${s.rating ?? 5} out of 5`}>
                {Array.from({ length: s.rating ?? 5 }).map((_, k) => (
                  <Star key={k} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote>“{s.quote}”</blockquote>
              <figcaption>
                <strong>{s.customerName}</strong>
                {s.tripLabel ? <span>{s.tripLabel}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="kk-empty">No stories in this category yet — new ones are added often.</p>
      )}
    </div>
  )
}
