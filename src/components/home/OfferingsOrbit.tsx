import Link from 'next/link'
import { BedDouble, Car, Cookie, Flame, Landmark, Plane, UtensilsCrossed } from 'lucide-react'
import styles from './OfferingsOrbit.module.css'

// Everything Kartikart offers, orbiting the brand at the centre. Pure-CSS
// rotation with each label counter-rotated so it stays upright; pauses on hover.
const NODES = [
  { icon: Car, label: 'Cab Rentals', sub: 'Own AC fleet', href: '/fleet' },
  { icon: BedDouble, label: 'Stays', sub: 'Hotel Kartik · Mastiff', href: '/stays' },
  { icon: UtensilsCrossed, label: 'Heritage Food', sub: 'Kailash Bhojnalaya', href: '/experiences' },
  { icon: Landmark, label: 'Special Darshan', sub: 'Baba Baidyanath Dham', href: '/packages' },
  { icon: Cookie, label: 'Heritage Prasadi', sub: 'Chamari Sah Mistaan', href: '/experiences' },
  { icon: Plane, label: 'Pan-India Tours', sub: 'Gangtok · Darjeeling · Gaya', href: '/packages' },
]

const RADIUS = 39 // % of the container

export function OfferingsOrbit() {
  return (
    <div className={styles.wrap}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.ring}>
        <div className={styles.orbitLine} aria-hidden />
        {NODES.map((n, i) => {
          const angle = (-90 + i * (360 / NODES.length)) * (Math.PI / 180)
          const x = 50 + RADIUS * Math.cos(angle)
          const y = 50 + RADIUS * Math.sin(angle)
          const Icon = n.icon
          return (
            <Link
              key={n.label}
              href={n.href}
              className={styles.node}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className={styles.nodeInner}>
                <span className={styles.nodeIcon}>
                  <Icon size={24} strokeWidth={1.8} />
                </span>
                <span className={styles.nodeLabel}>{n.label}</span>
                <span className={styles.nodeSub}>{n.sub}</span>
              </span>
            </Link>
          )
        })}
      </div>

      <div className={styles.center}>
        <span className={styles.centerMark}>
          <Flame size={30} strokeWidth={1.9} />
        </span>
        <span className={styles.centerName}>Kartikart</span>
        <span className={styles.centerTag}>Har Safar, Yaadgaar Safar</span>
      </div>
    </div>
  )
}
