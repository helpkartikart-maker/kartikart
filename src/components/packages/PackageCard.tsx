import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Landmark } from 'lucide-react'
import type { Media, Package } from '@/payload-types'
import { AddToTripButton } from '../cart/AddToTripButton'
import type { CartItem } from '../cart/CartContext'
import { categoryLabel, durationLabel, formatPrice, regionLabel } from '@/lib/format'
import styles from './PackageCard.module.css'

function heroImage(pkg: Package): { url: string; alt: string } | null {
  const img = pkg.heroImage
  if (img && typeof img === 'object' && 'url' in img && img.url) {
    return { url: img.url, alt: (img as Media).alt || pkg.title }
  }
  return null
}

export function PackageCard({ pkg }: { pkg: Package }) {
  const img = heroImage(pkg)
  const price = formatPrice(pkg.priceFrom)
  const dur = durationLabel(pkg.durationNights, pkg.durationDays)
  const href = `/packages/${pkg.slug}`

  const cartItem: CartItem = {
    id: `package:${pkg.slug}`,
    kind: 'package',
    title: pkg.title,
    slug: pkg.slug,
    priceFrom: pkg.priceFrom ?? null,
    meta: [dur, regionLabel(pkg.region)].filter(Boolean).join(' · '),
  }

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.media} aria-label={pkg.title}>
        {img ? (
          <Image
            src={img.url}
            alt={img.alt}
            fill
            sizes="(max-width: 700px) 100vw, 380px"
            className={styles.img}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden>
            <Landmark size={30} strokeWidth={1.5} />
            <span>{categoryLabel(pkg.category)}</span>
          </div>
        )}
        <span className={styles.region}>{regionLabel(pkg.region)}</span>
      </Link>

      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className="kk-chip kk-chip--saffron">{categoryLabel(pkg.category)}</span>
          {dur ? <span className={styles.dur}>{dur}</span> : null}
        </div>

        <h3 className={styles.title}>
          <Link href={href}>{pkg.title}</Link>
        </h3>
        {pkg.shortPitch ? <p className={styles.pitch}>{pkg.shortPitch}</p> : null}

        <div className={styles.footer}>
          <span className={styles.price}>
            {price ? (
              <>
                <em>from</em> {price}
              </>
            ) : (
              'On request'
            )}
          </span>
          <Link href={href} className={styles.detailLink}>
            Details <ArrowRight size={15} />
          </Link>
        </div>

        <AddToTripButton item={cartItem} block />
      </div>
    </article>
  )
}
