'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Luggage } from 'lucide-react'
import { useCart } from '../cart/CartContext'
import { buildWhatsappLink, generalEnquiryMessage } from '@/lib/whatsapp'
import styles from './Header.module.css'

export function Header({ whatsappNumber }: { whatsappNumber: string }) {
  const { count, hydrated } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wa = buildWhatsappLink({ whatsappNumber, message: generalEnquiryMessage() })

  return (
    <header className={styles.header} data-scrolled={scrolled}>
      <div className={`kk-container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Kartikart — home">
          <span className={styles.mark}>K</span>
          <span className={styles.name}>Kartikart</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/packages">Packages</Link>
          <a href={wa} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </nav>

        <Link
          href="/trip"
          className={styles.trip}
          aria-label={`Your trip — ${hydrated ? count : 0} item${count === 1 ? '' : 's'}`}
        >
          <Luggage size={18} strokeWidth={2.25} />
          <span className={styles.tripLabel}>Trip</span>
          {hydrated && count > 0 ? <span className={styles.badge}>{count}</span> : null}
        </Link>
      </div>
    </header>
  )
}
