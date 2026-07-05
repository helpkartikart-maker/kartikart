import type { Metadata } from 'next'
import { AtSign, MapPin, MessageCircle, Phone } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { getSiteSettings } from '@/lib/queries'
import { buildWhatsappLink, generalEnquiryMessage } from '@/lib/whatsapp'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Call, WhatsApp or visit Kartikart in Deoghar, Jharkhand. We’ll help you plan taxi, hotel, food and heritage — end to end.',
}

export default async function ContactPage() {
  const s = await getSiteSettings()
  const wa = buildWhatsappLink({ whatsappNumber: s.whatsappNumber, message: generalEnquiryMessage() })
  const igHandle = s.instagram?.replace('@', '')

  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Let’s plan your safar"
        sub="Call, WhatsApp or drop by — we’re happy to help you build the perfect trip."
      />
      <section className="kk-section">
        <div className="kk-container">
          <div className={styles.grid}>
            <div className={styles.cards}>
              {s.phone ? (
                <a className={styles.card} href={`tel:${s.phone.replace(/\s/g, '')}`}>
                  <span className={styles.icon}>
                    <Phone size={20} />
                  </span>
                  <div>
                    <h3>Call us</h3>
                    <span>{s.phone}</span>
                  </div>
                </a>
              ) : null}
              <a className={styles.card} href={wa} target="_blank" rel="noopener noreferrer">
                <span className={styles.icon} data-wa="true">
                  <MessageCircle size={20} />
                </span>
                <div>
                  <h3>WhatsApp</h3>
                  <span>Chat &amp; get a quote</span>
                </div>
              </a>
              {igHandle ? (
                <a
                  className={styles.card}
                  href={`https://instagram.com/${igHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.icon}>
                    <AtSign size={20} />
                  </span>
                  <div>
                    <h3>Instagram</h3>
                    <span>{s.instagram}</span>
                  </div>
                </a>
              ) : null}
              {s.address ? (
                <div className={styles.card}>
                  <span className={styles.icon}>
                    <MapPin size={20} />
                  </span>
                  <div>
                    <h3>Visit us</h3>
                    <span>{s.address}</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className={styles.mapWrap}>
              {s.mapEmbedUrl ? (
                <iframe
                  title="Kartikart location"
                  src={s.mapEmbedUrl}
                  loading="lazy"
                  className={styles.map}
                />
              ) : (
                <div className={styles.mapPlaceholder}>
                  <MapPin size={30} strokeWidth={1.5} />
                  <span>{s.address || 'Deoghar, Jharkhand 814112'}</span>
                  <small>Add a Google Maps embed URL in admin → Site Settings</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
