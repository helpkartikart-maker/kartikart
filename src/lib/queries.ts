import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Package, Story, SiteSetting, Fleet, Stay, Experience } from '@/payload-types'

const published = { status: { equals: 'published' } }

export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings' })
}

export async function getFeaturedPackages(limit = 6): Promise<Package[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'packages',
    where: { and: [published, { featured: { equals: true } }] },
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
    where: published,
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
    where: { and: [published, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function getAllFleet(): Promise<Fleet[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'fleet',
    where: published,
    limit: 100,
    sort: '-ownedByKartikart',
    depth: 1,
  })
  return docs
}

export async function getAllStays(): Promise<Stay[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'stays',
    where: published,
    limit: 100,
    sort: '-ownership',
    depth: 1,
  })
  return docs
}

export async function getAllExperiences(): Promise<Experience[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'experiences',
    where: published,
    limit: 100,
    sort: '-featured',
    depth: 1,
  })
  return docs
}

export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'stories',
    where: { and: [published, { featured: { equals: true } }] },
    limit,
    sort: '-date',
    depth: 1,
  })
  return docs
}

export async function getAllStories(): Promise<Story[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'stories',
    where: published,
    limit: 100,
    sort: '-date',
    depth: 1,
  })
  return docs
}
