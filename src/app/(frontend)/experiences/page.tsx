import type { Metadata } from 'next'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { getAllExperiences } from '@/lib/queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Reveal } from '@/components/ui/Reveal'
import { EXPERIENCE_KIND_LABELS, label } from '@/lib/format'
import { resolveMedia } from '@/lib/media'
import type { CartItem } from '@/components/cart/CartContext'

// Show a partner photo only if the local file exists (public/experiences/<file>.jpg);
// otherwise fall back to the placeholder icon so a missing photo never 404s.
function experienceImage(photo: Parameters<typeof resolveMedia>[0]) {
  const m = resolveMedia(photo)
  if (m && m.url.startsWith('/experiences/') && !existsSync(join(process.cwd(), 'public', m.url.slice(1)))) {
    return null
  }
  return m
}

export const metadata: Metadata = {
  title: 'Food & Heritage',
  description:
    'Prasad thalis, heritage food trails and cultural experiences around Deoghar. Add an experience to your trip for one WhatsApp quote.',
}

export default async function ExperiencesPage() {
  const experiences = await getAllExperiences()

  return (
    <main>
      <PageHeader
        eyebrow="Food & Heritage"
        title="Taste the best, feel the culture"
        sub="From the famous Deoghar prasad thali to heritage walks — the flavours and stories that make a yatra yaadgaar. Add an experience to your trip."
      />
      <section className="kk-section">
        <div className="kk-container">
          {experiences.length ? (
            <div className="kk-card-grid">
              {experiences.map((e, i) => {
                const kindLabel = label(EXPERIENCE_KIND_LABELS, e.kind)
                const metaLines = [e.location ?? null, e.specialty ?? null].filter(Boolean) as string[]
                const cartItem: CartItem = {
                  id: `experience:${e.id}`,
                  kind: 'experience',
                  title: e.title,
                  priceFrom: null,
                  meta: [kindLabel, e.location].filter(Boolean).join(' · '),
                }
                return (
                  <Reveal key={e.id} delay={i * 50}>
                    <ServiceCard
                      chip={kindLabel}
                      title={e.title}
                      ribbon={e.featured ? 'Featured' : kindLabel}
                      image={experienceImage(e.photos?.[0]?.image)}
                      metaLines={metaLines}
                      blurb={e.blurb}
                      mapUrl={e.mapUrl}
                      priceFrom={null}
                      cartItem={cartItem}
                    />
                  </Reveal>
                )
              })}
            </div>
          ) : (
            <p className="kk-empty">Experiences are being added — check back soon.</p>
          )}
        </div>
      </section>
    </main>
  )
}
