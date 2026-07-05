import type { Metadata } from 'next'
import { getAllPackages } from '@/lib/queries'
import { PackageExplorer } from '@/components/packages/PackageExplorer'
import styles from './packages.module.css'

export const metadata: Metadata = {
  title: 'Tour Packages',
  description:
    'Spiritual, cultural, wildlife, adventure and beach journeys across Deoghar and India. Add what you like to your trip and get a WhatsApp quote.',
}

export default async function PackagesPage() {
  const packages = await getAllPackages()

  return (
    <main>
      <section className={styles.head}>
        <div className="kk-container">
          <span className="kk-eyebrow kk-eyebrow--light">Tour Packages</span>
          <h1 className={styles.headTitle}>Find your next yaadgaar safar</h1>
          <p className={styles.headSub}>
            From Baba Baidyanath darshan to pan-India escapes. Add what you like to your trip — the
            quote comes to you on WhatsApp.
          </p>
        </div>
      </section>

      <section className={`kk-section ${styles.body}`}>
        <div className="kk-container">
          <PackageExplorer packages={packages} />
        </div>
      </section>
    </main>
  )
}
