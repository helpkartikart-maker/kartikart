'use client'

import { useEffect, useState } from 'react'
import { JourneyIntro } from './JourneyIntro'

// First-load brand intro: a car sets off across the map, a pin drops on the
// destination, and the Kartikart logo blooms — then the whole thing slides
// away to reveal the site. Plays once per browser session; skipped entirely
// for prefers-reduced-motion users.
export function LandingIntro() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('kk_intro_seen') === '1') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('kk_intro_seen', '1')
      return
    }
    sessionStorage.setItem('kk_intro_seen', '1')
    setShow(true)
  }, [])

  if (!show) return null
  return <JourneyIntro onDone={() => setShow(false)} />
}
