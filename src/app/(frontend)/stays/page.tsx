import type { Metadata } from 'next'
import { getAllStays } from '@/lib/queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Reveal } from '@/components/ui/Reveal'
import { STAY_OWNERSHIP_LABELS, label } from '@/lib/format'
import { resolveMedia } from '@/lib/media'
import type { CartItem } from '@/components/cart/CartContext'

export const metadata: Metadata = {
  title: 'Stays & Hotels',
  description:
    'Kartikart-owned hotels and handpicked partner stays in Deoghar. Add a room to your trip for one WhatsApp quote.',
}

export default async function StaysPage() {
  const stays = await getAllStays()

  return (
    <main>
      <PageHeader
        eyebrow="Stays & Hotels"
        title="Rest easy, near the Dham"
        sub="Our own hotels plus trusted local partners — comfortable rooms a short hop from Baba Baidyanath. Add a stay to your trip and we’ll quote it together."
      />
      <section className="kk-section">
        <div className="kk-container">
          {stays.length ? (
            <div className="kk-card-grid">
              {stays.map((s, i) => {
                const ownershipLabel = label(STAY_OWNERSHIP_LABELS, s.ownership)
                const owned = s.ownership === 'owned'
                const metaLines = [
                  s.starRating ? `${s.starRating}★` : null,
                  s.location ?? null,
                  ...(s.amenities?.slice(0, 2).map((a) => a.item as string) ?? []),
                ].filter(Boolean) as string[]
                const cartItem: CartItem = {
                  id: `hotel:${s.id}`,
                  kind: 'hotel',
                  title: s.name,
                  priceFrom: s.priceFrom ?? null,
                  meta: [ownershipLabel, s.location].filter(Boolean).join(' · '),
                }
                return (
                  <Reveal key={s.id} delay={i * 50}>
                    <ServiceCard
                      chip={ownershipLabel}
                      title={s.name}
                      owned={owned}
                      ribbon={owned ? 'Kartikart-owned' : 'Partner stay'}
                      image={resolveMedia(s.photos?.[0]?.image)}
                      metaLines={metaLines}
                      priceFrom={s.priceFrom}
                      priceNote={s.priceNote}
                      cartItem={cartItem}
                    />
                  </Reveal>
                )
              })}
            </div>
          ) : (
            <p className="kk-empty">Stays are being added — check back soon.</p>
          )}
        </div>
      </section>
    </main>
  )
}
