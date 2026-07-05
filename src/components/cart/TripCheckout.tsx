'use client'

import Link from 'next/link'
import { useState, type ChangeEvent } from 'react'
import { ArrowRight, Luggage, MessageCircle, Trash2 } from 'lucide-react'
import { useCart } from './CartContext'
import { buildWhatsappLink, formatTripQuoteMessage, type QuoteItem } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/format'
import { logEnquiry } from '@/lib/actions'
import styles from './TripCheckout.module.css'

const EMPTY = { name: '', phone: '', travelers: '', dates: '', notes: '' }

export function TripCheckout({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, remove, clear, hydrated, count } = useCart()
  const [form, setForm] = useState(EMPTY)

  const update =
    (key: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  if (!hydrated) {
    return <div className={styles.loading}>Loading your trip…</div>
  }

  if (count === 0) {
    return (
      <div className={styles.empty}>
        <Luggage size={40} strokeWidth={1.4} />
        <h2>Your trip is empty</h2>
        <p>Add a few packages and we&apos;ll turn them into one tidy WhatsApp quote.</p>
        <Link href="/packages" className="kk-btn kk-btn--saffron">
          Browse packages <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  const quoteItems: QuoteItem[] = items.map((i) => ({
    title: i.title,
    meta: i.meta ?? undefined,
    priceFrom: i.priceFrom ?? null,
  }))
  const message = formatTripQuoteMessage({
    items: quoteItems,
    contact: {
      name: form.name || undefined,
      phone: form.phone || undefined,
      travelers: form.travelers || undefined,
      dates: form.dates || undefined,
      notes: form.notes || undefined,
    },
  })
  const href = buildWhatsappLink({ whatsappNumber, message })

  // Fire-and-forget lead capture, then let the link open WhatsApp.
  const onSend = () => {
    logEnquiry({
      name: form.name || undefined,
      phone: form.phone || undefined,
      travelers: form.travelers || undefined,
      dates: form.dates || undefined,
      subjectRef: items.map((i) => i.title).join(', '),
      message,
    }).catch(() => {})
  }

  return (
    <div className={styles.layout}>
      <div className={styles.items}>
        <div className={styles.itemsHead}>
          <h2>
            Your trip <span>({count})</span>
          </h2>
          <button type="button" className={styles.clear} onClick={clear}>
            Clear all
          </button>
        </div>
        <ul className={styles.itemList}>
          {items.map((i) => {
            const price = formatPrice(i.priceFrom ?? null)
            return (
              <li key={i.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <h3>{i.title}</h3>
                  {i.meta ? <span className={styles.meta}>{i.meta}</span> : null}
                </div>
                <div className={styles.itemRight}>
                  <span className={styles.price}>
                    {price ? (
                      <>
                        <em>from</em> {price}
                      </>
                    ) : (
                      'On request'
                    )}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${i.title}`}
                    onClick={() => remove(i.id)}
                    className={styles.remove}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <aside className={styles.checkout}>
        <div className={styles.card}>
          <h2>Send your quote</h2>
          <p className={styles.cardNote}>
            Fill in what you can — we reply on WhatsApp with the final price.
          </p>
          <div className={styles.fields}>
            <label>
              Name
              <input value={form.name} onChange={update('name')} placeholder="Your name" />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={update('phone')}
                placeholder="+91…"
                inputMode="tel"
              />
            </label>
            <div className={styles.row}>
              <label>
                Travellers
                <input
                  value={form.travelers}
                  onChange={update('travelers')}
                  placeholder="e.g. 4"
                  inputMode="numeric"
                />
              </label>
              <label>
                Dates
                <input value={form.dates} onChange={update('dates')} placeholder="e.g. 12–14 Mar" />
              </label>
            </div>
            <label>
              Notes
              <textarea
                value={form.notes}
                onChange={update('notes')}
                rows={3}
                placeholder="Anything specific — hotel type, pickup city, budget…"
              />
            </label>
          </div>
          <a
            className={`kk-btn kk-btn--wa ${styles.send}`}
            href={href}
            onClick={onSend}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} /> Send trip quote on WhatsApp
          </a>
          <p className={styles.disclaimer}>
            Opens WhatsApp with your trip prefilled. No payment now — quote first.
          </p>
        </div>
      </aside>
    </div>
  )
}
