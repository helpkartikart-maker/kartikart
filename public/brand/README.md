# Brand assets

Drop your real brand images here with these exact names and the site picks them up automatically
(a page refresh in `npm run dev`; a rebuild for `npm run build`). Until then, the site falls back
to the built-in "K" mark and the illustrated temple hero — nothing breaks.

| File | Used for | Best format |
|------|----------|-------------|
| `public/brand/logo.png` | Header logo (replaces the "K" mark) | **Transparent-background** PNG (or SVG named `logo.svg` — then set it in `Header.tsx`). The header is light/cream, so a transparent logo with your navy wordmark looks best. |
| `public/brand/hero-temple.jpg` | Blurred hero background (Baba Baidyanath Dham) | A landscape JPG/PNG, ideally ≥1600px wide. It's blurred + darkened automatically for text contrast. |

Tip: the logo mockup on a dark background won't sit well on the light header — export a version
with a **transparent** background if you can.
