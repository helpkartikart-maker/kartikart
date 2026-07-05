'use client'

import { Check, Plus } from 'lucide-react'
import { useCart, type CartItem } from './CartContext'
import styles from './AddToTripButton.module.css'

export function AddToTripButton({
  item,
  variant = 'solid',
  block = false,
}: {
  item: CartItem
  variant?: 'solid' | 'outline'
  block?: boolean
}) {
  const { has, toggle, hydrated } = useCart()
  const added = hydrated && has(item.id)

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      aria-pressed={added}
      className={[styles.btn, styles[variant], added ? styles.added : '', block ? styles.block : '']
        .filter(Boolean)
        .join(' ')}
    >
      {added ? <Check size={17} strokeWidth={2.75} /> : <Plus size={17} strokeWidth={2.75} />}
      <span>{added ? 'Added to trip' : 'Add to trip'}</span>
    </button>
  )
}
