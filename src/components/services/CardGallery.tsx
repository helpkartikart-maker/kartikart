'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './CardGallery.module.css'

/** A small crossfade photo carousel for a card's media area — arrows on hover, dots, and touch-swipe. */
export function CardGallery({ images }: { images: { url: string; alt: string }[] }) {
  const [i, setI] = useState(0)
  const [touchX, setTouchX] = useState<number | null>(null)
  const n = images.length
  const go = (d: number) => setI((prev) => (prev + d + n) % n)

  return (
    <div
      className={styles.gallery}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return
        const dx = e.changedTouches[0].clientX - touchX
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        setTouchX(null)
      }}
    >
      {images.map((img, idx) => (
        <Image
          key={idx}
          src={img.url}
          alt={img.alt}
          fill
          sizes="(max-width: 700px) 100vw, 360px"
          className={styles.img}
          style={{ opacity: idx === i ? 1 : 0 }}
          priority={idx === 0}
        />
      ))}

      <button
        type="button"
        className={`${styles.nav} ${styles.prev}`}
        onClick={() => go(-1)}
        aria-label="Previous photo"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        className={`${styles.nav} ${styles.next}`}
        onClick={() => go(1)}
        aria-label="Next photo"
      >
        <ChevronRight size={18} />
      </button>

      <div className={styles.dots}>
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`${styles.dot} ${idx === i ? styles.active : ''}`}
            onClick={() => setI(idx)}
            aria-label={`Photo ${idx + 1}`}
            aria-current={idx === i}
          />
        ))}
      </div>
    </div>
  )
}
