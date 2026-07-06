'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import styles from './AnnouncementBar.module.css'

const KEY = 'kk-promo-dismissed-v1'

export function AnnouncementBar() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === '1') setShow(false)
    } catch {
      /* ignore */
    }
  }, [])

  if (!show) return null

  return (
    <div className={styles.bar} role="region" aria-label="Website offer">
      <span className={styles.shimmer} aria-hidden />
      <p className={styles.text}>
        <span className={styles.badge}>5% OFF</span> every booking made on the website —{' '}
        <em>Sab Kuch Best, Sirf Aapke Liye!</em>
      </p>
      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss offer"
        onClick={() => {
          try {
            localStorage.setItem(KEY, '1')
          } catch {
            /* ignore */
          }
          setShow(false)
        }}
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  )
}
