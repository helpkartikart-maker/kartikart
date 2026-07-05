import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Package, Story, SiteSetting } from '@/payload-types'

export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings' })
}

export async function getFeaturedPackages(limit = 6): Promise<Package[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'packages',
    where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
    limit,
    sort: '-createdAt',
    depth: 1,
  })
  return docs
}

export async function getAllPackages(): Promise<Package[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'packages',
    where: { status: { equals: 'published' } },
    limit: 100,
    sort: '-createdAt',
    depth: 1,
  })
  return docs
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'packages',
    where: { and: [{ status: { equals: 'published' } }, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'stories',
    where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
    limit,
    sort: '-date',
    depth: 1,
  })
  return docs
}
