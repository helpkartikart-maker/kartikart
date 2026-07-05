import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string
  title: ReactNode
  sub?: ReactNode
}) {
  return (
    <section className={styles.head}>
      <div className="kk-container">
        <span className="kk-eyebrow kk-eyebrow--light">{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        {sub ? <p className={styles.sub}>{sub}</p> : null}
      </div>
    </section>
  )
}
