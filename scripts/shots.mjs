import { chromium } from 'playwright'

const base = process.env.BASE || 'http://127.0.0.1:3001'
const shots = [
  { path: '/', name: 'home', w: 1280, h: 900 },
  { path: '/fleet', name: 'fleet', w: 1280, h: 900 },
  { path: '/stays', name: 'stays', w: 1280, h: 900 },
  { path: '/experiences', name: 'experiences', w: 1280, h: 900 },
  { path: '/stories', name: 'stories', w: 1280, h: 900 },
  { path: '/about', name: 'about', w: 1280, h: 900 },
  { path: '/contact', name: 'contact', w: 1280, h: 900 },
  { path: '/fleet', name: 'fleet-mobile', w: 390, h: 844 },
]

const browser = await chromium.launch()
for (const s of shots) {
  const context = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto(base + s.path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `/tmp/kk-${s.name}.png`, fullPage: true })
  await context.close()
  console.log('shot', s.name)
}
await browser.close()
console.log('done')
