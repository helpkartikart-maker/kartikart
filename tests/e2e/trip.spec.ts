import { test, expect } from '@playwright/test'

test('add to trip updates header count and checkout builds a WhatsApp quote link', async ({
  page,
}) => {
  await page.goto('/packages')
  await page
    .getByRole('button', { name: /Add to trip/i })
    .first()
    .click()

  // Header Trip button shows the count badge
  await expect(page.locator('header a[href="/trip"]')).toContainText('1')

  await page.goto('/trip')
  await expect(page.getByRole('heading', { name: /Your trip/i })).toBeVisible()

  const send = page.getByRole('link', { name: /Send trip quote on WhatsApp/i })
  await expect(send).toHaveAttribute('href', /^https:\/\/wa\.me\/916201234567\?text=/)
})
