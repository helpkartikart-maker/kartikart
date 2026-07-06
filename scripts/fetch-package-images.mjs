import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

// Real, openly-licensed photos from Wikimedia Commons for destination packages.
// Rentals without a meaningful "place" photo keep their generated placeholder.
const TARGETS = [
  { slug: 'baba-baidyanath-darshan', q: 'Baidyanath temple Deoghar' },
  { slug: 'deoghar-bashukinath', q: 'Basukinath temple' },
  { slug: 'deoghar-sultanganj-bashukinath', q: 'Ajgaibinath Temple Sultanganj' },
  { slug: 'deoghar-bashukinath-trikut', q: 'Trikut Pahar Deoghar' },
  { slug: 'deoghar-gangtok', q: 'Gangtok Sikkim' },
  { slug: 'deoghar-darjeeling', q: 'Darjeeling Himalaya' },
  { slug: 'deoghar-dhanbad-taxi', q: 'Dhanbad Jharkhand' },
  { slug: 'deoghar-ranchi-taxi', q: 'Ranchi Jharkhand' },
]

const UA = 'KartikartSiteBot/1.0 (brand placeholder images; kartikart.in)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

async function candidates(q) {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=15` +
    `&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json`
  const j = await (await fetch(url, { headers: { 'User-Agent': UA } })).json()
  return Object.values(j.query?.pages || {})
    .map((p) => (p.imageinfo?.[0] ? { title: p.title, ii: p.imageinfo[0] } : null))
    .filter(Boolean)
    .filter((c) => /\.(jpe?g)$/i.test(c.ii.url) && (c.ii.width || 0) >= 900)
    .sort((a, b) => {
      const la = (a.ii.thumbwidth || 0) >= (a.ii.thumbheight || 1) ? 1 : 0
      const lb = (b.ii.thumbwidth || 0) >= (b.ii.thumbheight || 1) ? 1 : 0
      return lb - la
    })
}

const credits = [
  '# Photo credits',
  '',
  'The destination photos below are **real, openly-licensed** images from Wikimedia Commons,',
  'used as placeholders. Keep the attribution if you keep the image, or replace it with your own',
  'photo (same filename) — see README.md. Files not listed here are generated brand placeholders.',
  '',
]

for (const t of TARGETS) {
  const cands = await candidates(t.q)
  let ok = false
  for (const c of cands.slice(0, 6)) {
    try {
      const resp = await fetch(c.ii.thumburl, { headers: { 'User-Agent': UA } })
      if (!(resp.headers.get('content-type') || '').startsWith('image/')) {
        await sleep(700)
        continue
      }
      const buf = Buffer.from(await resp.arrayBuffer())
      await sharp(buf).resize(1200, 800, { fit: 'cover', position: 'centre' }).jpeg({ quality: 80 }).toFile(`public/packages/${t.slug}.jpg`)
      const author = stripHtml(c.ii.extmetadata?.Artist?.value) || 'Unknown'
      const lic = c.ii.extmetadata?.LicenseShortName?.value || 'see source'
      const page = 'https://commons.wikimedia.org/wiki/' + c.title.replace(/ /g, '_')
      credits.push(`- **${t.slug}.jpg** — “${c.title.replace('File:', '')}” · ${author} · ${lic} · ${page}`)
      console.log('OK ', t.slug, '<-', c.title.replace('File:', ''), `(${lic})`)
      ok = true
      break
    } catch {
      await sleep(700)
    }
  }
  if (!ok) console.log('KEEP placeholder:', t.slug)
  await sleep(900)
}

writeFileSync('public/packages/CREDITS.md', credits.join('\n') + '\n')
console.log('done')
