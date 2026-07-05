import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/queries'
import { TripCheckout } from '@/components/cart/TripCheckout'
import styles from './trip.module.css'

export const metadata: Metadata = {
  title: 'Your Trip',
  description: 'Review your selected packages and get a trip quote on WhatsApp.',
}

export default async function TripPage() {
  const settings = await getSiteSettings()

  return (
    <main>
      <section className={styles.head}>
        <div className="kk-container">
          <span className="kk-eyebrow kk-eyebrow--light">Your Trip</span>
          <h1 className={styles.headTitle}>Review &amp; get your WhatsApp quote</h1>
          <p className={styles.headSub}>
            One message, your whole trip. We reply with the final quote — no forms, no payment now.
          </p>
        </div>
      </section>

      <section className={`kk-section ${styles.body}`}>
        <div className="kk-container">
          <TripCheckout whatsappNumber={settings.whatsappNumber} />
        </div>
      </section>
    </main>
  )
}
