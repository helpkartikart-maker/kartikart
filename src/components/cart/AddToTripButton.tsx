'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useCart, type CartItem, type CartSchedule } from './CartContext'
import { ScheduleModal } from './ScheduleModal'
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
  const { has, add, remove, hydrated } = useCart()
  const added = hydrated && has(item.id)
  const [picking, setPicking] = useState(false)

  const onClick = () => {
    if (added) {
      remove(item.id) // second click removes it
    } else {
      setPicking(true) // first click → pick dates, then add
    }
  }

  const confirm = (schedule?: CartSchedule) => {
    add(schedule ? { ...item, schedule } : item)
    setPicking(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={added}
        className={[styles.btn, styles[variant], added ? styles.added : '', block ? styles.block : '']
          .filter(Boolean)
          .join(' ')}
      >
        {added ? <Check size={17} strokeWidth={2.75} /> : <Plus size={17} strokeWidth={2.75} />}
        <span>{added ? 'Added to trip' : 'Add to trip'}</span>
      </button>
      {picking ? (
        <ScheduleModal item={item} onConfirm={confirm} onClose={() => setPicking(false)} />
      ) : null}
    </>
  )
}
