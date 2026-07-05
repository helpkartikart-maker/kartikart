import { test, expect } from '@playwright/test'

test('catalog filters by category', async ({ page }) => {
  await page.goto('/packages')
  await expect(page.locator('article').first()).toBeVisible()
  await page.getByRole('button', { name: 'Spiritual', exact: true }).click()
  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.locator('article').first()).toContainText('Baba Baidyanath')
})

test('catalog search narrows results', async ({ page }) => {
  await page.goto('/packages')
  await page.getByPlaceholder('Search journeys').fill('Golden Triangle')
  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.locator('article').first()).toContainText('Golden Triangle')
})
