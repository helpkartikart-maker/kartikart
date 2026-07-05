import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

export function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  align = 'left',
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  light?: boolean
  align?: 'left' | 'center'
}) {
  return (
    <div className={styles.wrap} data-align={align}>
      <span className={`kk-eyebrow ${light ? 'kk-eyebrow--light' : ''}`}>{eyebrow}</span>
      <h2 className={`kk-h2 ${styles.title}`} data-light={light}>
        {title}
      </h2>
      {intro ? (
        <p className={styles.intro} data-light={light}>
          {intro}
        </p>
      ) : null}
    </div>
  )
}
