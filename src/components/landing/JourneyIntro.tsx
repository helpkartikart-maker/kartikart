'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import styles from './LandingIntro.module.css'

// Signature smooth deceleration (easeOutExpo) for entrances; a sharper
// accelerating curve for the exit — tuned to feel unhurried but not slow.
const EASE = [0.16, 1, 0.3, 1] as const
const EASE_OUT = [0.32, 0, 0.67, 0] as const

// The GPS route the car drives — a gentle curve from lower-left to the
// destination pin at upper-right. Shared by the drawn line and the car's path.
const ROUTE = 'M64 182 C 190 118, 330 200, 498 84'

// A stylised road network (Google-Maps-like), drawn as gently curved arterials
// and straighter side streets so it reads as a real map rather than a plain grid.
const MAJOR_ROADS = [
  'M-12 96 C 140 84, 250 104, 400 86 C 480 76, 540 88, 582 82',
  'M170 -12 C 178 70, 158 150, 182 252',
  'M330 -12 C 340 60, 352 140, 374 252',
  'M-12 38 C 120 90, 182 152, 264 252',
  'M300 252 C 386 202, 434 164, 582 150',
]
const MINOR_ROADS = [
  'M60 -10 L 74 250',
  'M112 -10 L 100 250',
  'M240 -10 L 252 250',
  'M430 -10 L 442 250',
  'M500 -10 L 490 250',
  'M-10 150 L 572 140',
  'M-10 202 L 572 206',
  'M-10 55 L 572 48',
]
const HIGHWAY = 'M-12 128 C 150 120, 262 138, 420 116 C 502 105, 552 118, 582 112'

export function JourneyIntro({ onDone }: { onDone?: () => void }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 4900)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence onExitComplete={() => onDone?.()}>
      {show && (
        <motion.div
          className={styles.overlay}
          aria-hidden
          onClick={() => setShow(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: 70, scale: 0.97 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <motion.div
            className={styles.glow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          <div className={styles.stage}>
            {/* Logo blooms in the centre */}
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 1.5, duration: 0.9, ease: EASE }}
            >
              <Image
                src="/brand/logo.png"
                alt="Kartikart"
                width={580}
                height={200}
                priority
                className={styles.logo}
              />
            </motion.div>

            {/* The map journey */}
            <motion.div
              className={styles.mapWrap}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
            >
              <svg
                viewBox="0 0 560 240"
                className={styles.map}
                role="img"
                aria-label="A car travels across the map to its destination"
              >
                <defs>
                  <clipPath id="kkCardClip">
                    <rect x="2" y="2" width="556" height="236" rx="20" />
                  </clipPath>
                </defs>

                <g clipPath="url(#kkCardClip)">
                  <rect x="2" y="2" width="556" height="236" className={styles.card} />

                  {/* water body + park (land features) */}
                  <path d="M-10 -10 C 66 -10, 116 24, 102 60 C 70 76, 18 64, -10 47 Z" className={styles.water} />
                  <path d="M452 252 C 460 206, 502 188, 548 197 C 578 203, 576 242, 566 256 Z" className={styles.park} />

                  {/* minor side streets (underneath) */}
                  {MINOR_ROADS.map((d, i) => (
                    <path key={`mi${i}`} d={d} className={styles.roadMinor} />
                  ))}

                  {/* major roads — dark casing first, lighter fill on top (the classic map look) */}
                  {MAJOR_ROADS.map((d, i) => (
                    <path key={`mc${i}`} d={d} className={styles.roadCasing} />
                  ))}
                  <path d={HIGHWAY} className={styles.highwayCasing} />
                  {MAJOR_ROADS.map((d, i) => (
                    <path key={`mf${i}`} d={d} className={styles.roadFill} />
                  ))}
                  <path d={HIGHWAY} className={styles.highway} />

                  {/* the route, drawn on */}
                  <motion.path
                    id="kkRoute"
                    d={ROUTE}
                    className={styles.route}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.7, duration: 1.1, ease: 'easeInOut' }}
                  />

                  {/* the car driving the route */}
                  <motion.g
                    style={{ offsetPath: `path('${ROUTE}')`, offsetRotate: 'auto' }}
                    initial={{ offsetDistance: '0%' }}
                    animate={{ offsetDistance: '100%' }}
                    transition={{ delay: 1.2, duration: 2.4, ease: 'easeInOut' }}
                  >
                    <ellipse cx="0" cy="11" rx="19" ry="3.5" fill="#000" opacity="0.18" />
                    <rect x="-19" y="-5" width="38" height="13" rx="5" fill="#ffc66e" />
                    <path d="M-11 -5 L-6 -14 L8 -14 L13 -5 Z" fill="#ffd98a" />
                    <rect x="-5" y="-12" width="11" height="6" rx="1.5" fill="#0b1e44" opacity="0.55" />
                    <circle cx="-10" cy="8" r="4.5" fill="#0b1e44" />
                    <circle cx="-10" cy="8" r="1.8" fill="#ffc66e" />
                    <circle cx="11" cy="8" r="4.5" fill="#0b1e44" />
                    <circle cx="11" cy="8" r="1.8" fill="#ffc66e" />
                    <circle cx="18" cy="-1" r="1.8" fill="#fff8e6" />
                  </motion.g>

                  {/* destination pin + ping */}
                  <g transform="translate(498 84)">
                    <motion.circle
                      cx="0"
                      cy="1"
                      r="0"
                      className={styles.ping}
                      initial={{ opacity: 0 }}
                      animate={{ r: [0, 16, 26], opacity: [0.55, 0.25, 0] }}
                      transition={{ delay: 3.5, duration: 0.9, ease: 'easeOut' }}
                    />
                    <motion.g
                      initial={{ y: -48, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.95, duration: 0.6, ease: EASE }}
                    >
                      <path d="M0 0 C -11 -15 -11 -28 0 -33 C 11 -28 11 -15 0 0 Z" className={styles.pin} />
                      <circle cx="0" cy="-21" r="4.6" className={styles.pinHole} />
                    </motion.g>
                  </g>

                  {/* the family setting off (couple + child) */}
                  <motion.g
                    fill="#efe6d0"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.6, ease: EASE }}
                  >
                    <circle cx="62" cy="196" r="5.5" />
                    <path d="M54 220 Q54 203 62 203 Q70 203 70 220 Z" />
                    <circle cx="80" cy="194" r="5.5" />
                    <path d="M72 220 Q72 201 80 201 Q88 201 88 220 Z" />
                    <circle cx="94" cy="202" r="4" />
                    <path d="M88 220 Q88 208 94 208 Q100 208 100 220 Z" />
                  </motion.g>
                </g>

                {/* card border on top */}
                <rect x="2" y="2" width="556" height="236" rx="20" className={styles.cardBorder} />
              </svg>
            </motion.div>

            {/* tagline */}
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.6, ease: EASE }}
            >
              Har Safar, Yaadgaar Safar
            </motion.p>
          </div>

          <motion.span
            className={styles.skip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 2.6, duration: 0.5 }}
          >
            Tap to skip
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
