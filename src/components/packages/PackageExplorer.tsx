'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Package } from '@/payload-types'
import { PackageCard } from './PackageCard'
import { CATEGORY_LABELS } from '@/lib/format'
import styles from './PackageExplorer.module.css'

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS)
const REGIONS = [
  { v: 'all', l: 'All India' },
  { v: 'deoghar', l: 'Deoghar & Local' },
  { v: 'pan-india', l: 'Pan-India' },
]

export function PackageExplorer({ packages }: { packages: Package[] }) {
  const [category, setCategory] = useState('all')
  const [region, setRegion] = useState('all')
  const [q, setQ] = useState('')

  const categories = useMemo(() => {
    const present = new Set(packages.map((p) => p.category).filter(Boolean) as string[])
    return ['all', ...CATEGORY_ORDER.filter((c) => present.has(c))]
  }, [packages])

  const filtered = useMemo(
    () =>
      packages.filter((p) => {
        if (category !== 'all' && p.category !== category) return false
        if (region !== 'all' && p.region !== region) return false
        if (q.trim()) {
          const hay = `${p.title} ${p.shortPitch ?? ''}`.toLowerCase()
          if (!hay.includes(q.trim().toLowerCase())) return false
        }
        return true
      }),
    [packages, category, region, q],
  )

  return (
    <div>
      <div className={styles.filters}>
        <div className={styles.pills}>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={styles.pill}
              data-active={category === c}
            >
              {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <div className={styles.right}>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={styles.select}
            aria-label="Filter by region"
          >
            {REGIONS.map((r) => (
              <option key={r.v} value={r.v}>
                {r.l}
              </option>
            ))}
          </select>
          <label className={styles.search}>
            <Search size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search journeys"
              aria-label="Search packages"
            />
          </label>
        </div>
      </div>

      <p className={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'journey' : 'journeys'}
      </p>

      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No journeys match that yet.</p>
          <button
            type="button"
            className="kk-btn kk-btn--ghost"
            onClick={() => {
              setCategory('all')
              setRegion('all')
              setQ('')
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
