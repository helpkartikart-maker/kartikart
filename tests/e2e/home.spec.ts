import { test, expect } from '@playwright/test'

test('home renders hero, logo and primary CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Kartikart/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Taxi se Hotel tak')
  await expect(page.getByRole('link', { name: /Explore packages/i }).first()).toBeVisible()
  await expect(page.locator('header img[alt*="Kartikart"]')).toBeVisible()
})

test('home exposes Open Graph + JSON-LD', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Kartikart/)
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(ld).toContain('TravelAgency')
})
