'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { buildWhatsappLink, generalEnquiryMessage } from '@/lib/whatsapp'
import styles from './WhatsAppFab.module.css'

export function WhatsAppFab({ whatsappNumber }: { whatsappNumber: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const href = buildWhatsappLink({ whatsappNumber, message: generalEnquiryMessage() })

  return (
    <a
      className={styles.fab}
      data-show={show}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kartikart on WhatsApp"
    >
      <MessageCircle size={25} strokeWidth={2} />
      <span className={styles.tip}>Chat with us</span>
    </a>
  )
}
