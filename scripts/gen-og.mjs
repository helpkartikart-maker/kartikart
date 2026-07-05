import sharp from 'sharp'

const W = 1200
const H = 630

// Darkened, blurred temple as the base (falls back gracefully if the file is swapped).
const base = await sharp('public/brand/hero-temple.jpg')
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.55 })
  .blur(3)
  .toBuffer()

const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b1e44" stop-opacity="0.88"/>
      <stop offset="0.58" stop-color="#0b1e44" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#d98a3d" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="80" y="140" font-family="Georgia, serif" font-size="24" letter-spacing="4" fill="#ffc66e">DEOGHAR &#183; BABA BAIDYANATH DHAM</text>
  <text x="80" y="262" font-family="Georgia, serif" font-size="74" font-weight="bold" fill="#ffffff">Taxi se Hotel tak,</text>
  <text x="80" y="346" font-family="Georgia, serif" font-size="74" font-weight="bold" fill="#ffffff">Khana se Heritage tak</text>
  <text x="80" y="418" font-family="Georgia, serif" font-size="33" font-style="italic" fill="#ffc66e">Sab Kuch Best, Sirf Aapke Liye!</text>
  <rect x="82" y="486" width="52" height="6" rx="3" fill="#f7941e"/>
  <text x="80" y="548" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#ffffff">Kartikart</text>
  <text x="238" y="548" font-family="Arial, sans-serif" font-size="23" fill="#dfe6f5">Tour &amp; Travel Agency &#183; Deoghar</text>
</svg>`)

await sharp(base)
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 85 })
  .toFile('public/og.jpg')

console.log('generated public/og.jpg (1200x630)')
