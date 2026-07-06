import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

// Specific, recognizable landmark photos per destination (openly licensed, Wikimedia Commons).
// `local` reuses an on-disk photo; `tries` = ordered [searchQuery, titleMustInclude] attempts.
const TARGETS = [
  { slug: 'baba-baidyanath-darshan', local: 'public/brand/hero-temple.jpg', credit: 'Baba Baidyanath Dham, Deoghar — provided by Kartikart' },
  { slug: 'deoghar-bashukinath', tries: [['Basukinath temple', 'basukinath'], ['Baba Basukinath Dham', 'basukinath']] },
  { slug: 'deoghar-sultanganj-bashukinath', tries: [['Ajgaibinath temple', 'ajgaibinath'], ['Ajgaibinath Sultanganj', 'sultanganj'], ['Sultanganj Ganga temple', 'sultanganj']] },
  { slug: 'deoghar-bashukinath-trikut', tries: [['Trikut Pahar Deoghar', 'trikut'], ['Trikutachal Deoghar', 'trikut'], ['Trikut ropeway', 'trikut']] },
  { slug: 'deoghar-gangtok', tries: [['Gangtok city Sikkim', 'gangtok'], ['MG Marg Gangtok', 'gangtok'], ['Gangtok monastery', 'gangtok']] },
  { slug: 'deoghar-darjeeling', tries: [['Kanchenjunga Darjeeling', 'kanchenjunga'], ['Darjeeling tea estate', 'darjeeling'], ['Darjeeling town view', 'darjeeling']] },
  { slug: 'deoghar-dhanbad-taxi', tries: [['Maithon Dam', 'maithon'], ['Topchanchi Lake', 'topchanchi'], ['Panchet Dam', 'panchet']] },
  { slug: 'deoghar-ranchi-taxi', tries: [['Hundru Falls', 'hundru'], ['Dassam Falls', 'dassam'], ['Jonha Falls', 'jonha'], ['Patratu Valley', 'patratu']] },
  { slug: 'deoghar-gaya-bodhgaya', tries: [['Mahabodhi Temple Bodh Gaya', 'mahabodhi'], ['Mahabodhi Temple', 'mahabodhi'], ['Bodh Gaya temple', 'bodh']] },
  { slug: 'deoghar-tarapith', tries: [['Tarapith temple', 'tarapith'], ['Tarapith Mandir', 'tarapith'], ['Tara Maa Tarapith', 'tarapith']] },
]

const UA = 'KartikartSiteBot/1.0 (brand placeholder images; kartikart.in)'
const BAD = /map|logo|plan|diagram|flag|coat of arms|seal|banner|poster|sketch|drawing/i
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

async function candidates(q, inc) {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=20` +
    `&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json`
  const j = await (await fetch(url, { headers: { 'User-Agent': UA } })).json()
  return Object.values(j.query?.pages || {})
    .map((p) => (p.imageinfo?.[0] ? { title: p.title, ii: p.imageinfo[0] } : null))
    .filter(Boolean)
    .filter((c) => /\.(jpe?g)$/i.test(c.ii.url) && (c.ii.width || 0) >= 1000)
    .filter((c) => (c.ii.thumbwidth || 0) >= (c.ii.thumbheight || 1)) // landscape
    .filter((c) => !BAD.test(c.title))
    .filter((c) => c.title.toLowerCase().includes(inc)) // must be about the landmark
}

async function save(slug, buf) {
  await sharp(buf).resize(1200, 800, { fit: 'cover', position: 'centre' }).jpeg({ quality: 80 }).toFile(`public/packages/${slug}.jpg`)
}

const credits = [
  '# Photo credits',
  '',
  'Destination photos are **real, openly-licensed** images (Wikimedia Commons) used as placeholders.',
  'Keep the attribution if you keep the image, or replace it with your own (same filename) — see README.md.',
  '',
]

for (const t of TARGETS) {
  if (t.local) {
    const { readFileSync } = await import('node:fs')
    await save(t.slug, readFileSync(t.local))
    credits.push(`- **${t.slug}.jpg** — ${t.credit}`)
    console.log('OK ', t.slug, '<- (local)', t.local)
    continue
  }
  let ok = false
  for (const [q, inc] of t.tries) {
    if (ok) break
    const cands = await candidates(q, inc)
    for (const c of cands.slice(0, 6)) {
      try {
        const resp = await fetch(c.ii.thumburl, { headers: { 'User-Agent': UA } })
        if (!(resp.headers.get('content-type') || '').startsWith('image/')) {
          await sleep(600)
          continue
        }
        await save(t.slug, Buffer.from(await resp.arrayBuffer()))
        const author = stripHtml(c.ii.extmetadata?.Artist?.value) || 'Unknown'
        const lic = c.ii.extmetadata?.LicenseShortName?.value || 'see source'
        const page = 'https://commons.wikimedia.org/wiki/' + c.title.replace(/ /g, '_')
        credits.push(`- **${t.slug}.jpg** — “${c.title.replace('File:', '')}” · ${author} · ${lic} · ${page}`)
        console.log('OK ', t.slug, '<-', c.title.replace('File:', ''), `(${lic})`)
        ok = true
        break
      } catch {
        await sleep(600)
      }
    }
    await sleep(700)
  }
  if (!ok) console.log('KEEP placeholder:', t.slug)
}

writeFileSync('public/packages/CREDITS.md', credits.join('\n') + '\n')
console.log('done')
