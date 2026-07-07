import Link from 'next/link'
import { AtSign, MapPin, MessageCircle, Phone } from 'lucide-react'
import { buildWhatsappLink, generalEnquiryMessage } from '@/lib/whatsapp'
import type { SiteSetting } from '@/payload-types'
import styles from './Footer.module.css'

export function Footer({ settings }: { settings: SiteSetting }) {
  const year = new Date().getFullYear()
  const wa = buildWhatsappLink({
    whatsappNumber: settings.whatsappNumber,
    message: generalEnquiryMessage(),
  })
  const igHandle = settings.instagram?.replace('@', '')

  return (
    <footer className={styles.footer}>
      <div className="kk-container">
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <span className={styles.mark}>K</span>
              <span>Kartikart</span>
            </div>
            <p className={styles.tag}>{settings.brandTagline || 'Har Safar, Yaadgaar Safar'}</p>
            <p className={styles.promise}>
              Taxi se Hotel tak, Khana se Heritage tak — one hand holds your whole journey across
              Deoghar and India.
            </p>
            <p className={styles.directors}>
              Directors — <strong>Alok Anand</strong> &amp; <strong>Gulshan</strong>
            </p>
          </div>

          <div className={styles.linksCol}>
            <h4>Explore</h4>
            <Link href="/packages">Packages</Link>
            <Link href="/fleet">Fleet</Link>
            <Link href="/stays">Stays</Link>
            <Link href="/experiences">Food &amp; Heritage</Link>
          </div>

          <div className={styles.linksCol}>
            <h4>Company</h4>
            <Link href="/stories">Stories</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/trip">Your Trip</Link>
          </div>

          <div className={styles.linksCol}>
            <h4>Reach us</h4>
            {settings.phone ? (
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>
                <Phone size={15} /> {settings.phone}
              </a>
            ) : null}
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> WhatsApp
            </a>
            {igHandle ? (
              <a href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer">
                <AtSign size={15} /> {settings.instagram}
              </a>
            ) : null}
            {settings.address ? (
              <span>
                <MapPin size={15} /> {settings.address}
              </span>
            ) : null}
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {year} Kartikart Tour &amp; Travel Agency</span>
          <span className={styles.desh}>Desh Dekho, Dil Se Jiyo.</span>
        </div>
      </div>
    </footer>
  )
}
