import styles from './PromoMarquee.module.css'

const ITEMS: { text: string; hot?: boolean }[] = [
  { text: 'on every booking made on the website', hot: true },
  { text: 'Har Safar, Yaadgaar Safar' },
  { text: 'Taxi se Hotel tak, Khana se Heritage tak' },
  { text: 'Deoghar · Bashukinath · Sultanganj · Trikut · Gaya · Bodh Gaya · Tarapith · Gangtok · Darjeeling' },
]

// Continuously scrolling promo ticker (CSS-only, not dismissible). Pauses on hover.
export function PromoMarquee() {
  const reel = Array.from({ length: 4 }, () => ITEMS).flat()
  return (
    <div className={styles.wrap} role="region" aria-label="Offers and destinations">
      <div className={styles.track}>
        {reel.map((it, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.sep} aria-hidden>
              ✦
            </span>
            {it.hot ? (
              <>
                <span className={styles.badge}>UP TO 10% OFF</span> {it.text}
              </>
            ) : (
              it.text
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
