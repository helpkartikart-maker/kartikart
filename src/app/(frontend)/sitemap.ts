import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'
import { getAllPackages } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPaths = ['', '/packages', '/fleet', '/stays', '/experiences', '/stories', '/about', '/contact']

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${siteConfig.url}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.8,
  }))

  const packages = await getAllPackages()
  const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${siteConfig.url}/packages/${pkg.slug}`,
    lastModified: pkg.updatedAt ? new Date(pkg.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticEntries, ...packageEntries]
}
