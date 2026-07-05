import { test, expect } from '@playwright/test'

test('robots.txt and sitemap.xml are served', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.ok()).toBeTruthy()
  expect(await robots.text()).toMatch(/Sitemap:/i)

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBeTruthy()
  expect(await sitemap.text()).toContain('/packages/baba-baidyanath-darshan')
})

test('package detail exposes Product JSON-LD', async ({ page }) => {
  await page.goto('/packages/baba-baidyanath-darshan')
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(scripts.join(' ')).toContain('"@type":"Product"')
})
