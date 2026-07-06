import Image from 'next/image'
import { BedDouble, Car, Landmark, UtensilsCrossed } from 'lucide-react'
import { AddToTripButton } from '../cart/AddToTripButton'
import type { CartItem, CartKind } from '../cart/CartContext'
import { formatPrice } from '@/lib/format'
import styles from './ServiceCard.module.css'

const ICONS: Record<CartKind, typeof Car> = {
  car: Car,
  hotel: BedDouble,
  experience: UtensilsCrossed,
  package: Landmark,
}

export function ServiceCard({
  image,
  ribbon,
  chip,
  title,
  metaLines,
  priceFrom,
  compareAt,
  priceNote,
  cartItem,
  owned = false,
}: {
  image?: { url: string; alt: string } | null
  ribbon?: string | null
  chip: string
  title: string
  metaLines?: string[]
  priceFrom?: number | null
  compareAt?: number | null
  priceNote?: string | null
  cartItem: CartItem
  owned?: boolean
}) {
  const Icon = ICONS[cartItem.kind] ?? Landmark
  const price = formatPrice(priceFrom)
  const was = formatPrice(compareAt)

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <Image src={image.url} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 360px" className={styles.img} />
        ) : (
          <div className={styles.placeholder} aria-hidden>
            <Icon size={30} strokeWidth={1.5} />
          </div>
        )}
        {ribbon ? (
          <span className={styles.ribbon} data-owned={owned ? 'true' : 'false'}>
            {ribbon}
          </span>
        ) : null}
      </div>
      <div className={styles.body}>
        <span className="kk-chip kk-chip--saffron">{chip}</span>
        <h3 className={styles.title}>{title}</h3>
        {metaLines?.length ? (
          <ul className={styles.meta}>
            {metaLines.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        ) : null}
        <div className={styles.footer}>
          <span className={styles.price}>
            {price ? (
              <>
                <em>from</em> {price}
                {was ? <s className={styles.was}>{was}</s> : null}
                {priceNote ? <small> {priceNote}</small> : null}
              </>
            ) : (
              'On request'
            )}
          </span>
        </div>
        <AddToTripButton item={cartItem} block variant="outline" />
      </div>
    </article>
  )
}
