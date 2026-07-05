import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BedDouble, Car, Landmark, UtensilsCrossed } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Kartikart is a Deoghar-rooted tour & travel agency — one trusted partner for taxi, hotel, food and heritage, across India.',
}

const PILLARS = [
  { icon: Car, title: 'Taxi', text: 'Our own fleet, drivers who know the roads.' },
  { icon: BedDouble, title: 'Hotel', text: 'Owned stays and trusted partners.' },
  { icon: UtensilsCrossed, title: 'Khana', text: 'Prasad thali and heritage food.' },
  { icon: Landmark, title: 'Heritage', text: 'Deoghar darshan, done right.' },
]

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About Kartikart"
        title="Born in Deoghar, built for your yatra"
        sub="Har Safar, Yaadgaar Safar."
      />

      <section className="kk-section">
        <div className="kk-container">
          <Reveal>
            <div className={styles.lead}>
              <p className={styles.big}>
                Kartikart began at the doorstep of Baba Baidyanath Dham — with one idea: a single
                trusted partner for the whole journey, not five phone numbers for taxi, hotel, food
                and sightseeing.
              </p>
              <p>
                From a Deoghar darshan to a pan-India escape, we hold every step —{' '}
                <em>Taxi se Hotel tak, Khana se Heritage tak</em> — so you just travel and make
                memories.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className={styles.stats}>
              <div>
                <strong>5</strong>
                <span>cars in our own fleet</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Kartikart-owned hotels</span>
              </div>
              <div>
                <strong>1</strong>
                <span>partner for the whole trip</span>
              </div>
            </div>
          </Reveal>

          <div className={styles.pillars}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className={styles.pillar}>
                  <span className={styles.pillarIcon}>
                    <p.icon size={22} strokeWidth={1.8} />
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className={styles.cta}>
              <p>Owned, not outsourced — so quality and price stay in our hands.</p>
              <Link href="/packages" className="kk-btn kk-btn--saffron">
                Explore packages <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
