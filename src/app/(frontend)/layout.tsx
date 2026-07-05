import React from 'react'
import './styles.css'

export const metadata = {
  title: 'Kartikart — Tour & Travel Agency, Deoghar',
  description:
    'Taxi se Hotel tak, Khana se Heritage tak — Sab Kuch Best, Sirf Aapke Liye. Deoghar-based tour & travel packages across India.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
