import type { Metadata } from 'next'
import { getAllStories } from '@/lib/queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { StoriesWall } from '@/components/stories/StoriesWall'

export const metadata: Metadata = {
  title: 'Traveller Stories',
  description:
    'Real journeys, real memories — the Kartikart experience wall. See how we handle taxi to hotel to heritage, end to end.',
}

export default async function StoriesPage() {
  const stories = await getAllStories()

  return (
    <main>
      <PageHeader
        eyebrow="Yaadgaar Safar"
        title="Stories from our travellers"
        sub="Real journeys, real memories. This wall grows with every trip we help plan — from Baba Baidyanath darshan to pan-India escapes."
      />
      <section className="kk-section">
        <div className="kk-container">
          <StoriesWall stories={stories} />
        </div>
      </section>
    </main>
  )
}
