import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, ChevronRight, Landmark, X } from 'lucide-react'
import { getPackageBySlug } from '@/lib/queries'
import type { Media } from '@/payload-types'
import { AddToTripButton } from '@/components/cart/AddToTripButton'
import type { CartItem } from '@/components/cart/CartContext'
import { categoryLabel, durationLabel, formatPrice, regionLabel, SUITED_LABELS } from '@/lib/format'
import styles from './detail.module.css'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) return { title: 'Package not found' }
  return { title: pkg.title, description: pkg.shortPitch ?? undefined }
}

function heroImage(img: unknown): { url: string; alt: string } | null {
  if (img && typeof img === 'object' && 'url' in img && (img as Media).url) {
    const m = img as Media
    return { url: m.url as string, alt: m.alt || '' }
  }
  return null
}

export default async function PackageDetailPage({ params }: Params) {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) notFound()

  const img = heroImage(pkg.heroImage)
  const price = formatPrice(pkg.priceFrom)
  const dur = durationLabel(pkg.durationNights, pkg.durationDays)
  const suited = (pkg.suitedFor ?? []).map((s) => SUITED_LABELS[s] ?? s)

  const cartItem: CartItem = {
    id: `package:${pkg.slug}`,
    kind: 'package',
    title: pkg.title,
    slug: pkg.slug,
    priceFrom: pkg.priceFrom ?? null,
    meta: [dur, regionLabel(pkg.region)].filter(Boolean).join(' · '),
  }

  return (
    <main>
      {/* Header band */}
      <section className={styles.head}>
        <div className="kk-container">
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/packages">Packages</Link>
            <ChevronRight size={14} />
            <span>{categoryLabel(pkg.category)}</span>
          </nav>
          <div className={styles.headMeta}>
            <span className="kk-chip kk-chip--saffron">{categoryLabel(pkg.category)}</span>
            <span className={styles.region}>{regionLabel(pkg.region)}</span>
            {dur ? <span className={styles.dur}>{dur}</span> : null}
          </div>
          <h1 className={styles.title}>{pkg.title}</h1>
          {pkg.shortPitch ? <p className={styles.pitch}>{pkg.shortPitch}</p> : null}
          {suited.length ? (
            <p className={styles.suited}>Great for {suited.join(' · ')}</p>
          ) : null}
        </div>
      </section>

      <section className={`kk-section ${styles.body}`}>
        <div className={`kk-container ${styles.layout}`}>
          <div className={styles.main}>
            <div className={styles.media}>
              {img ? (
                <Image src={img.url} alt={img.alt || pkg.title} fill sizes="(max-width: 900px) 100vw, 720px" className={styles.mediaImg} />
              ) : (
                <div className={styles.mediaPlaceholder} aria-hidden>
                  <Landmark size={40} strokeWidth={1.4} />
                  <span>{pkg.title}</span>
                </div>
              )}
            </div>

            {pkg.highlights?.length ? (
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>Highlights</h2>
                <ul className={styles.highlights}>
                  {pkg.highlights.map((h) => (
                    <li key={h.id}>
                      <Check size={17} /> {h.item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {pkg.itinerary?.length ? (
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>Day by day</h2>
                <ol className={styles.itinerary}>
                  {pkg.itinerary.map((d, i) => (
                    <li key={d.id} className={styles.day}>
                      <span className={styles.dayMarker}>Day {String(d.day ?? i + 1).padStart(2, '0')}</span>
                      <div className={styles.dayBody}>
                        {d.title ? <h3>{d.title}</h3> : null}
                        {d.details ? <p>{d.details}</p> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {pkg.inclusions?.length || pkg.exclusions?.length ? (
              <section className={styles.block}>
                <div className={styles.inEx}>
                  {pkg.inclusions?.length ? (
                    <div>
                      <h3 className={styles.inExTitle}>What's included</h3>
                      <ul className={styles.incl}>
                        {pkg.inclusions.map((x) => (
                          <li key={x.id}>
                            <Check size={16} /> {x.item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {pkg.exclusions?.length ? (
                    <div>
                      <h3 className={styles.inExTitle}>Not included</h3>
                      <ul className={styles.excl}>
                        {pkg.exclusions.map((x) => (
                          <li key={x.id}>
                            <X size={16} /> {x.item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>

          {/* Booking card */}
          <aside className={styles.aside}>
            <div className={styles.bookCard}>
              <div className={styles.priceRow}>
                {price ? (
                  <>
                    <span className={styles.priceLabel}>from</span>
                    <span className={styles.price}>{price}</span>
                    {pkg.priceNote ? <span className={styles.priceNote}>{pkg.priceNote}</span> : null}
                  </>
                ) : (
                  <span className={styles.price}>On request</span>
                )}
              </div>
              <AddToTripButton item={cartItem} block />
              <Link href="/trip" className={styles.viewTrip}>
                View your trip <ArrowRight size={16} />
              </Link>
              <p className={styles.note}>
                Add to your trip and send one WhatsApp message — we reply with your final quote.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
