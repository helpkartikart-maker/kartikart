import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Package, Story, SiteSetting, Fleet, Stay, Experience } from '@/payload-types'
import * as sample from './content'

const published = { status: { equals: 'published' } }

/**
 * A Payload client when a backend is configured (PAYLOAD_SECRET set) and reachable;
 * otherwise null — callers then fall back to built-in sample content so the public
 * site stays live with no database.
 */
async function getClient() {
  if (!process.env.PAYLOAD_SECRET) return null
  try {
    return await getPayload({ config })
  } catch {
    return null
  }
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getClient()
  if (!payload) return sample.siteSettings
  try {
    return await payload.findGlobal({ slug: 'site-settings' })
  } catch {
    return sample.siteSettings
  }
}

export async function getFeaturedPackages(limit = 6): Promise<Package[]> {
  const payload = await getClient()
  if (!payload) return sample.packages.filter((p) => p.featured).slice(0, limit)
  try {
    const { docs } = await payload.find({
      collection: 'packages',
      where: { and: [published, { featured: { equals: true } }] },
      limit,
      sort: '-createdAt',
      depth: 1,
    })
    return docs
  } catch {
    return sample.packages.filter((p) => p.featured).slice(0, limit)
  }
}

export async function getAllPackages(): Promise<Package[]> {
  const payload = await getClient()
  if (!payload) return sample.packages
  try {
    const { docs } = await payload.find({
      collection: 'packages',
      where: published,
      limit: 100,
      sort: '-createdAt',
      depth: 1,
    })
    return docs
  } catch {
    return sample.packages
  }
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const payload = await getClient()
  if (!payload) return sample.packages.find((p) => p.slug === slug) ?? null
  try {
    const { docs } = await payload.find({
      collection: 'packages',
      where: { and: [published, { slug: { equals: slug } }] },
      limit: 1,
      depth: 2,
    })
    return docs[0] ?? null
  } catch {
    return sample.packages.find((p) => p.slug === slug) ?? null
  }
}

export async function getAllFleet(): Promise<Fleet[]> {
  const payload = await getClient()
  if (!payload) return sample.fleet
  try {
    const { docs } = await payload.find({
      collection: 'fleet',
      where: published,
      limit: 100,
      sort: '-ownedByKartikart',
      depth: 1,
    })
    return docs
  } catch {
    return sample.fleet
  }
}

export async function getAllStays(): Promise<Stay[]> {
  const payload = await getClient()
  if (!payload) return sample.stays
  try {
    const { docs } = await payload.find({
      collection: 'stays',
      where: published,
      limit: 100,
      sort: '-ownership',
      depth: 1,
    })
    return docs
  } catch {
    return sample.stays
  }
}

export async function getAllExperiences(): Promise<Experience[]> {
  const payload = await getClient()
  if (!payload) return sample.experiences
  try {
    const { docs } = await payload.find({
      collection: 'experiences',
      where: published,
      limit: 100,
      sort: '-featured',
      depth: 1,
    })
    return docs
  } catch {
    return sample.experiences
  }
}

export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  const payload = await getClient()
  if (!payload) return sample.stories.filter((s) => s.featured).slice(0, limit)
  try {
    const { docs } = await payload.find({
      collection: 'stories',
      where: { and: [published, { featured: { equals: true } }] },
      limit,
      sort: '-date',
      depth: 1,
    })
    return docs
  } catch {
    return sample.stories.filter((s) => s.featured).slice(0, limit)
  }
}

export async function getAllStories(): Promise<Story[]> {
  const payload = await getClient()
  if (!payload) return sample.stories
  try {
    const { docs } = await payload.find({
      collection: 'stories',
      where: published,
      limit: 100,
      sort: '-date',
      depth: 1,
    })
    return docs
  } catch {
    return sample.stories
  }
}
