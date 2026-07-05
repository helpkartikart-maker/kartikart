import { Fraunces, Hanken_Grotesk, Space_Mono } from 'next/font/google'

// Display — warm, optical serif for emotional headlines (used with restraint)
export const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-display',
  display: 'swap',
})

// Body / UI — clean, warm humanist grotesque
export const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// Utility — journey-log data: Day 01, ₹ prices, distances
export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})
