import sharp from 'sharp'

const W = 1200
const H = 800

const THEMES = {
  temple: {
    grad: [
      ['0', '#06122c'],
      ['0.42', '#0b1e44'],
      ['0.66', '#17285c'],
      ['0.85', '#7a4f86'],
      ['1', '#d98a3d'],
    ],
    motif: `
      <circle cx="880" cy="560" r="150" fill="#f7941e" opacity="0.5"/>
      <g fill="#0b1e44">
        <path d="M300,800 L300,660 C300,600 320,560 360,520 C400,560 420,600 420,660 L420,800 Z"/>
        <path d="M560,800 C560,700 590,630 640,556 C690,630 720,700 720,800 Z"/>
        <path d="M860,800 L860,690 C860,640 880,600 920,560 C960,600 980,640 980,690 L980,800 Z"/>
        <rect x="250" y="772" width="820" height="30"/>
        <circle cx="640" cy="552" r="7"/>
        <rect x="638" y="524" width="4" height="24"/>
      </g>
      <path d="M642,527 l22,7 l-22,7 Z" fill="#f7941e"/>`,
  },
  hill: {
    grad: [
      ['0', '#071a33'],
      ['0.4', '#0a2540'],
      ['0.72', '#14506b'],
      ['1', '#6fae9a'],
    ],
    motif: `
      <circle cx="905" cy="470" r="86" fill="#ffd59e" opacity="0.6"/>
      <path d="M0,800 L0,560 L260,360 L470,560 L700,320 L980,600 L1200,440 L1200,800 Z" fill="#0a2540" opacity="0.9"/>
      <path d="M0,800 L0,660 L300,500 L560,680 L820,470 L1200,660 L1200,800 Z" fill="#07203a"/>
      <path d="M652,362 L700,322 L748,362 L716,362 L700,346 L684,362 Z" fill="#ffffff" opacity="0.9"/>`,
  },
  rental: {
    grad: [
      ['0', '#0b1e44'],
      ['0.6', '#152c54'],
      ['1', '#0a1c40'],
    ],
    motif: `
      <path d="M455,800 L560,470 L645,470 L750,800 Z" fill="#16294d"/>
      <line x1="602" y1="478" x2="602" y2="800" stroke="#f7941e" stroke-width="7" stroke-dasharray="28 22" opacity="0.85"/>
      <g fill="#f7941e">
        <rect x="800" y="566" width="170" height="56" rx="16"/>
        <path d="M818,566 q12,-38 44,-38 l50,0 q30,0 40,38 Z"/>
        <circle cx="838" cy="622" r="17" fill="#0b1e44"/>
        <circle cx="932" cy="622" r="17" fill="#0b1e44"/>
      </g>`,
  },
}

const gradStops = (stops) => stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function buildSvg({ label, sublabel, theme }) {
  const t = THEMES[theme]
  const labelSize = label.length > 15 ? 54 : 64
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">${gradStops(t.grad)}</linearGradient>
      <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#06122c" stop-opacity="0.12"/>
        <stop offset="1" stop-color="#06122c" stop-opacity="0.66"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    ${t.motif}
    <rect width="${W}" height="${H}" fill="url(#scrim)"/>
    <text x="72" y="128" font-family="Georgia, serif" font-size="21" letter-spacing="5" fill="#ffc66e">${esc(sublabel).toUpperCase()}</text>
    <rect x="74" y="146" width="46" height="5" rx="3" fill="#f7941e"/>
    <text x="70" y="248" font-family="Georgia, serif" font-size="${labelSize}" font-weight="bold" fill="#ffffff">${esc(label)}</text>
    <text x="72" y="742" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff">Kartikart</text>
    <text x="230" y="742" font-family="Arial, sans-serif" font-size="20" fill="#c7d0e6">Tour &amp; Travel</text>
  </svg>`
}

const PACKAGES = [
  { slug: 'baba-baidyanath-darshan', label: 'Baba Baidyanath Dham', sublabel: 'Deoghar · Jyotirlinga', theme: 'temple' },
  { slug: 'deoghar-bashukinath', label: 'Basukinath Dham', sublabel: 'Deoghar · Darshan', theme: 'temple' },
  { slug: 'deoghar-sultanganj-bashukinath', label: 'Sultanganj Yatra', sublabel: 'Kanwar Route', theme: 'temple' },
  { slug: 'deoghar-bashukinath-trikut', label: 'Trikut Pahad', sublabel: 'Ropeway · Darshan', theme: 'hill' },
  { slug: 'deoghar-gangtok', label: 'Gangtok', sublabel: 'Sikkim Himalayas', theme: 'hill' },
  { slug: 'deoghar-darjeeling', label: 'Darjeeling', sublabel: 'Queen of the Hills', theme: 'hill' },
  { slug: 'deoghar-dhanbad-taxi', label: 'Deoghar – Dhanbad', sublabel: 'Taxi Service', theme: 'rental' },
  { slug: 'deoghar-ranchi-taxi', label: 'Deoghar – Ranchi', sublabel: 'Taxi Service', theme: 'rental' },
  { slug: 'daily-rentals', label: 'Daily Rentals', sublabel: 'By the Day', theme: 'rental' },
  { slug: 'marriage-event-rentals', label: 'Marriage & Events', sublabel: 'Decorated Fleet', theme: 'rental' },
]

for (const p of PACKAGES) {
  await sharp(Buffer.from(buildSvg(p))).jpeg({ quality: 82 }).toFile(`public/packages/${p.slug}.jpg`)
  console.log('wrote', p.slug)
}
console.log('done')
