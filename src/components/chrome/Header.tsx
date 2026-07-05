'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Luggage, Menu, X } from 'lucide-react'
import { useCart } from '../cart/CartContext'
import { buildWhatsappLink, generalEnquiryMessage } from '@/lib/whatsapp'
import styles from './Header.module.css'

const LINKS = [
  { href: '/packages', label: 'Packages' },
  { href: '/fleet', label: 'Fleet' },
  { href: '/stays', label: 'Stays' },
  { href: '/experiences', label: 'Food & Heritage' },
  { href: '/stories', label: 'Stories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header({ whatsappNumber }: { whatsappNumber: string }) {
  const { count, hydrated } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const wa = buildWhatsappLink({ whatsappNumber, message: generalEnquiryMessage() })

  return (
    <header className={styles.header} data-scrolled={scrolled} data-open={open}>
      <div className={`kk-container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Kartikart — home">
          <span className={styles.mark}>K</span>
          <span className={styles.name}>Kartikart</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} data-active={pathname === l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link
            href="/trip"
            className={styles.trip}
            aria-label={`Your trip — ${hydrated ? count : 0} item${count === 1 ? '' : 's'}`}
          >
            <Luggage size={18} strokeWidth={2.25} />
            <span className={styles.tripLabel}>Trip</span>
            {hydrated && count > 0 ? <span className={styles.badge}>{count}</span> : null}
          </Link>
          <button
            type="button"
            className={styles.burger}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className={styles.drawer}>
          <nav className={styles.drawerNav} aria-label="Mobile">
            <Link href="/" data-active={pathname === '/'}>
              Home
            </Link>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} data-active={pathname === l.href}>
                {l.label}
              </Link>
            ))}
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
