import type { Metadata } from 'next'
import { getAllFleet } from '@/lib/queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Reveal } from '@/components/ui/Reveal'
import { FLEET_TYPE_LABELS, label } from '@/lib/format'
import { resolveMedia } from '@/lib/media'
import type { CartItem } from '@/components/cart/CartContext'

export const metadata: Metadata = {
  title: 'Our Fleet',
  description:
    'Kartikart’s own taxis — SUVs, sedans and tempo travellers with drivers who know Deoghar. Add a cab to your trip for one WhatsApp quote.',
}

export default async function FleetPage() {
  const cars = await getAllFleet()

  return (
    <main>
      <PageHeader
        eyebrow="Taxi Services"
        title="Our own fleet, at your service"
        sub="Clean, comfortable cars with drivers who know Deoghar and the roads beyond. Add a cab to your trip and we’ll quote it with the rest."
      />
      <section className="kk-section">
        <div className="kk-container">
          {cars.length ? (
            <div className="kk-card-grid">
              {cars.map((c, i) => {
                const typeLabel = label(FLEET_TYPE_LABELS, c.type)
                const metaLines = [
                  c.seats ? `${c.seats} seats` : null,
                  c.luggage ? `${c.luggage}` : null,
                  ...(c.features?.slice(0, 2).map((f) => f.item as string) ?? []),
                ].filter(Boolean) as string[]
                const cartItem: CartItem = {
                  id: `car:${c.id}`,
                  kind: 'car',
                  title: c.name,
                  priceFrom: c.rate ?? null,
                  meta: [typeLabel, c.seats ? `${c.seats} seats` : null].filter(Boolean).join(' · '),
                }
                return (
                  <Reveal key={c.id} delay={i * 50}>
                    <ServiceCard
                      chip={typeLabel}
                      title={c.name}
                      owned={Boolean(c.ownedByKartikart)}
                      ribbon={c.ownedByKartikart ? 'Kartikart-owned' : typeLabel}
                      image={resolveMedia(c.photo)}
                      metaLines={metaLines}
                      priceFrom={c.rate}
                      priceNote={c.rateNote}
                      cartItem={cartItem}
                    />
                  </Reveal>
                )
              })}
            </div>
          ) : (
            <p className="kk-empty">Fleet details are being added — check back soon.</p>
          )}
        </div>
      </section>
    </main>
  )
}
