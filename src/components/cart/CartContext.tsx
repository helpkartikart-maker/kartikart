'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartKind = 'package' | 'car' | 'hotel' | 'experience'

export type CartItem = {
  /** unique key, e.g. `package:baba-baidyanath-darshan` */
  id: string
  kind: CartKind
  title: string
  slug?: string
  priceFrom?: number | null
  meta?: string | null
}

type CartValue = {
  items: CartItem[]
  count: number
  hydrated: boolean
  has: (id: string) => boolean
  add: (item: CartItem) => void
  remove: (id: string) => void
  toggle: (item: CartItem) => void
  clear: () => void
}

const CartContext = createContext<CartValue | null>(null)
const STORAGE_KEY = 'kartikart-trip'

function loadInitial(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as CartItem[]
    }
  } catch {
    /* ignore corrupt storage */
  }
  return []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load after mount so server and first client render match (avoids hydration mismatch).
  useEffect(() => {
    setItems(loadInitial())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore quota / private mode */
    }
  }, [items, hydrated])

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items])
  const add = useCallback(
    (item: CartItem) => setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item])),
    [],
  )
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), [])
  const toggle = useCallback(
    (item: CartItem) =>
      setItems((prev) =>
        prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item],
      ),
    [],
  )
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartValue>(
    () => ({ items, count: items.length, hydrated, has, add, remove, toggle, clear }),
    [items, hydrated, has, add, remove, toggle, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
