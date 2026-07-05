# Kartikart — Web App Design Spec

- **Date:** 2026-07-05
- **Status:** Approved (pending written-spec review)
- **Owner:** Kartikart Tour & Travel Agency (Deoghar, Jharkhand)

---

## 1. Overview & Vision

Kartikart is a Deoghar-based tour & travel startup whose differentiator is the **full-journey promise** — *"Taxi se Hotel tak, Khana se Heritage tak — Sab Kuch Best, Sirf Aapke Liye!"* One partner owns the whole trip: cab → stay → food → heritage → experience. Kartikart owns **5 cars** and **2 hotels**, and partners with local Deoghar hotels and eateries. Focus is **Deoghar & local** with **pan-India** packages actively open.

The web app has two faces in a single application:

1. **Public site** — a beautiful, richly interactive, mobile-first marketing + booking experience that converts visitors into WhatsApp enquiries and builds trust through a growing wall of customer experience stories.
2. **Admin panel** — a login-protected dashboard (Payload CMS `/admin`) where the Kartikart team self-manages all content (packages, stories, fleet, hotels, food, contact details) with photo uploads and no code.

**Booking for v1 is via WhatsApp only** (pre-filled deep links to `+91 6201234567`). Razorpay/online payments are explicitly deferred to a later, separate spec.

## 2. Goals & Non-Goals

### Goals (v1)
- Convert visitors to WhatsApp enquiries with minimal friction, from anywhere on the site.
- Showcase the full-journey promise and owned-asset trust signals (5 cars, 2 hotels).
- Let a non-technical founder manage all content themselves via the admin panel.
- Grow an "experience stories" wall over time.
- Be SEO-strong (a travel business lives on organic search) and fast on mobile.
- Leave a clean architectural slot for Razorpay later.

### Non-Goals (deferred to later specs — YAGNI)
- Razorpay / online payments, invoicing.
- Real-time availability / seat or room inventory.
- Customer login accounts (only admin auth in v1).
- Public review/story submission by customers (stories are curated in admin for v1).
- Multi-language i18n toggle (copy is intentionally bilingual Hindi/English in content).
- Blog / content marketing engine.

## 3. Users & Primary Journeys

**Visitor (traveler, mostly mobile):**
1. Lands on Home → grasps the full-journey promise → browses Packages (filter by category / suited-for / region) → opens a package → taps **"Book on WhatsApp"** → arrives in WhatsApp with a pre-filled enquiry.
2. Or browses a single service (a cab, a hotel, a food experience) → books that on WhatsApp.
3. Or uses **"Plan My Trip"** (pick package/custom, dates, travelers, optional add-ons) → gets a tidy composed WhatsApp message.

**Admin (founder/staff):**
1. Logs into `/admin` → adds/edits a package, uploads a story with a photo, adds a car/hotel, edits contact info → content appears live on the public site.
2. Reviews incoming **Enquiries** (logged leads) in the admin.

## 4. Architecture

One **Next.js (App Router) + Payload CMS 3.x** application, single codebase, single deploy.

- **Public pages** render as **Server Components** reading content **directly from Payload's Local API** (no HTTP round-trip; fast, SEO-friendly). Interactive pieces (filters, "Plan My Trip", animations) are Client Components.
- **Admin panel** is Payload's auto-generated dashboard at `/admin`, protected by Payload auth (Users collection).
- **Booking** requires no backend in v1: a pure `buildWhatsappLink()` utility composes a `https://wa.me/<number>?text=<encoded message>` URL from the relevant entity + user selections. The WhatsApp number comes from **Site Settings** (editable in admin).
- **Enquiries logging (best-effort):** tapping "Book on WhatsApp" also fires a non-blocking `POST /api/enquiry` that saves a lead to the **Enquiries** collection. If it fails, the WhatsApp link still opens — logging never blocks booking.
- **Payments (deferred):** Next.js API routes (`/api/...`) are the future home for Razorpay order creation + webhook verification.

### Environments
- **Local dev:** SQLite (`@payloadcms/db-sqlite`) + local-disk media → runs instantly, **no cloud accounts required**. Seed script loads real + placeholder content.
- **Production:** Neon Postgres (`@payloadcms/db-postgres` / vercel-postgres) + Vercel Blob media (`@payloadcms/storage-vercel-blob`) on Vercel, domain `www.kartikart.in`. DB adapter + storage are swapped via environment config, not code changes to collections.

### Tech stack
- Next.js (App Router; Payload-supported version, currently 15.4.x or 16.2.6+).
- Payload CMS 3.x (`payload`, `@payloadcms/next`, `@payloadcms/db-sqlite`, `@payloadcms/db-postgres`, `@payloadcms/storage-vercel-blob`, `@payloadcms/richtext-lexical`).
- TypeScript throughout; Payload generates types from collections.
- Styling: Tailwind CSS + a small custom brand design-system layer. Animation via Framer Motion (or CSS where lighter).
- Testing: Vitest (unit) + Playwright (e2e smoke).

## 5. Content Model (Payload collections)

> All list/detail public queries filter to `status: published` (where applicable). All images live in **Media** with **required alt text**.

### Media (upload)
- `alt` (text, required), image file. Cloud storage adapter in prod.

### Users (auth)
- Payload auth collection: `email`, `password`, `name`, `role` (admin/staff). Founder + staff logins.

### Site Settings (global, singleton)
- `phone` (e.g. +91 9304781234), `whatsappNumber` (e.g. 916201234567, digits only for wa.me), `instagram` (@kartikart.travels), `email`, `address` (Deoghar, Jharkhand 814112), `mapEmbedUrl`.
- Hero: `brandTagline` (Har Safar, Yaadgaar Safar), `heroHeadline` (Taxi se Hotel tak…), `heroSubline` (Sab Kuch Best, Sirf Aapke Liye!), `heroImages` (Media[]).
- `whatsappDefaultMessage` (fallback booking message).

### Packages
- `title`, `slug` (unique, auto from title), `status` (draft/published), `featured` (bool).
- `category` (select: Spiritual | Adventure | Wildlife | Beach | Cultural).
- `suitedFor` (multi-select: Families | Couples | Groups | Solo Travelers).
- `region` (select: Deoghar & Local | Pan-India).
- `durationDays`, `durationNights`.
- `priceFrom` (number, ₹, optional) + `priceNote` ("on request" / "per person").
- `heroImage` (Media), `gallery` (Media[]).
- `shortPitch` (text), `description` (rich text).
- `highlights` (array of text).
- `itinerary` (array: `day` number, `title`, `details` rich text).
- `inclusions` (array of text), `exclusions` (array of text).
- Derived: WhatsApp CTA message auto-built from `title` + region.

### Fleet (Cars)
- `name`/`model` (e.g. Toyota Innova Crysta), `type` (SUV | Sedan | Tempo Traveller | Other), `seats`, `luggage`, `features` (array: AC, Music, etc.), `photo` (Media), `gallery` (Media[]).
- `rate` (number, per-km/day) + `rateNote` / "on request".
- `ownedByKartikart` (bool — the 5 own cars flagged), `status`.

### Stays (Hotels)
- `name`, `ownership` (select: Kartikart-owned | Partner), `location`, `starRating`, `amenities` (array), `photos` (Media[]), `shortDesc`, `description` (rich text), `priceFrom` + `priceNote`, `status`.
- The 2 owned hotels flagged `ownership = Kartikart-owned`.

### Experiences (Food & Heritage)
- `title`, `kind` (select: Food | Heritage Site | Cultural Experience), `location`, `description` (rich text), `photos` (Media[]), `partnerEatery` (text, optional), `featured`, `status`.

### Stories (customer experiences — the growing wall)
- `customerName`, `tripLabel` (e.g. "Baba Baidyanath Darshan, Mar 2026"), `tripType` (select mirroring package categories), `photos` (Media[]), `quote` (text), `rating` (1–5), `date`, `featured`, `status`.

### Enquiries (leads, admin-visible)
- Auto-created via `POST /api/enquiry`. Fields: `name` (optional), `phone` (optional), `subjectType` (Package | Car | Hotel | Experience | Custom), `subjectRef` (relationship/text), `message`, `travelers` (optional), `dates` (optional), `createdAt`. Read-oriented in admin; access control so only authenticated staff can read; public create allowed via the API route only (server-side, validated).

## 6. Public Site — Pages & Sections

Global: sticky header nav, footer (contact + socials + quick links), persistent **floating WhatsApp button**, smooth page transitions, scroll-reveal animations. Mobile-first.

- **`/` Home** — parallax brand hero (taglines + primary "Plan My Trip"/WhatsApp CTA); the taxi→hotel→food→heritage promise strip; 5 service pillars (Taxi / Hotel / Food / Heritage / Custom Pan-India); **featured packages** carousel/grid; "Why Kartikart" trust band (owned 5 cars + 2 hotels, local roots, full-journey); **featured stories**; Instagram/gallery peek; footer CTA.
- **`/packages`** — catalog with filters (category, suited-for, region Deoghar/Pan-India) + text search; animated cards; empty state when none.
- **`/packages/[slug]`** — hero + gallery; short pitch; highlights; **day-by-day itinerary**; inclusions/exclusions; price-from; **sticky "Book this on WhatsApp"** pre-filling the package; related packages.
- **`/fleet`** — cars, owned ones highlighted; each card → "Book this cab on WhatsApp".
- **`/stays`** — hotels; Kartikart-owned vs Partner clearly marked; each → WhatsApp.
- **`/experiences`** — food + heritage + cultural items; each → WhatsApp.
- **`/stories`** — full experience-story wall, filterable by trip type; grows over time.
- **`/about`** — brand story, the full-journey promise, owned assets, Deoghar roots, team.
- **`/contact`** — address (Deoghar 814112), phone, WhatsApp, Instagram, map embed, enquiry CTA.
- **404 / loading / error** states, branded.

*Decision: fleet/stays/experiences are separate routes (better SEO) rather than one tabbed page, linked from a services overview area on Home and in nav.*

## 7. Booking Flow (WhatsApp, v1)

- **Link builder** — pure function `buildWhatsappLink({ whatsappNumber, subject, details })` → `https://wa.me/<digits>?text=<urlencoded>`. Unit-tested for encoding, number normalization, and template correctness.
- **Contextual buttons** — every bookable entity (package, car, hotel, experience) renders a "Book on WhatsApp" button pre-filling a relevant message, e.g.:
  > "Hi Kartikart! I'd like a quote for *Baba Baidyanath Darshan – 2N/3D* (Deoghar & Local). Please share details & availability."
- **Plan My Trip builder** (light) — a small multi-step/inline form: choose a package *or* "Custom", dates (optional), number of travelers, optional add-ons (cab / hotel / food) → composes a tidy message and opens the wa.me link. Pure client-side; no backend.
- **Enquiries logging** — on tap, fire-and-forget `POST /api/enquiry` to persist the lead; failures are swallowed (never block the WhatsApp handoff).
- WhatsApp number always sourced from **Site Settings** so the team can change it without a deploy.

## 8. Design / Aesthetic Direction

- **Brand colors:** deep navy (~`#0F2557`) + vibrant orange (~`#F7941E`) from the logo/poster; warm, premium, subtly spiritual (Baidyanath Dham heritage) — intentional, not templated.
- **Typography:** distinctive display face for headings + clean readable body; Devanagari-friendly accents for the Hindi taglines ("Har Safar, Yaadgaar Safar", "Nayi Jagah, Naya Swad, Nayi Yaadein!", "Desh Dekho, Dil Se Jiyo.").
- **Interactivity:** scroll-reveal, parallax hero, hover-animated cards, smooth route transitions, a story wall that feels alive. Performance-budgeted (animations must not tank mobile).
- **Responsive & accessible:** mobile-first (Indian travel traffic is mobile-heavy), semantic HTML, keyboard-navigable, enforced image alt text, sufficient contrast.
- The dedicated **frontend-design skill** is invoked during implementation for the visual craft.

## 9. SEO
- Per-page metadata + Open Graph/Twitter cards; dynamic OG for packages.
- Structured data: `TravelAgency`/`LocalBusiness` (name, Deoghar address, phone), `Product`/`Trip`-style markup for packages, `Review`/`AggregateRating` from stories where appropriate.
- `sitemap.xml`, `robots.txt`, clean slugs, fast SSR/SSG, image optimization.

## 10. Error Handling & Edge Cases
- Graceful **empty states** for no packages / no stories / no cars yet (branded placeholders, not blank).
- **Image fallbacks** to a brand placeholder when media missing.
- **Draft vs published** — only published content is public.
- WhatsApp handoff always works even if enquiry logging fails (best-effort, non-blocking).
- Form validation on Plan My Trip / enquiry inputs; server-side validation on `/api/enquiry`.
- Branded **404**, loading skeletons, and error boundaries.

## 11. Testing Strategy
- **Unit (Vitest):** `buildWhatsappLink()` (encoding, number normalization, templates), package **filter/search** logic, data mappers, price/duration formatters — pure functions, high value, TDD.
- **e2e smoke (Playwright):** Home renders; Packages filter narrows results; a "Book on WhatsApp" button produces the correct `wa.me` URL; `/admin` redirects unauthenticated users to login.
- **Manual/perf:** Lighthouse pass (mobile), responsive check, a11y sweep.

## 12. Build Phases (staged, reviewable — within this spec)
1. **Foundation** — scaffold Next + Payload; SQLite + local media; Users, Site Settings, Media, and all content collections; seed real + placeholder data; admin working end-to-end.
2. **Public core** — brand design system; layout (nav/footer/WhatsApp float); Home; Packages catalog + filters; Package detail + itinerary; WhatsApp booking + link builder (TDD).
3. **Services & stories** — Fleet, Stays, Experiences, Stories wall, About, Contact; Plan My Trip builder; Enquiries logging + admin lead view.
4. **Polish** — animations/interactions, SEO/OG/structured data, responsive/a11y/perf, empty states, error/404, tests green.
5. **Production readiness** — env-based swap to Postgres + Vercel Blob; deploy config for Vercel; docs for the team on using the admin.

## 13. Deferred / Out of Scope for v1
Razorpay & online payments (own future spec) · real-time availability/inventory · customer accounts · public story submission · i18n toggle · blog. The architecture (API routes, collections) leaves clean seams for these.

## 14. Assumptions & Open Items
- Contact details from the poster are treated as source of truth and made editable in Site Settings: phone `+91 9304781234`, WhatsApp `+91 6201234567`, Instagram `@kartikart.travels`, site `www.kartikart.in`, base Deoghar 814112. **Team to confirm which number receives WhatsApp bookings.**
- Content is a **mix** of a few real items (e.g. a Deoghar / Baba Baidyanath Jyotirlinga package, the 5 owned cars, 2 owned hotels) + polished placeholder to be replaced via admin.
- Real photos, prices, and itineraries will be supplied over time through the admin panel; the build ships with representative on-brand placeholders.
- Deployment to Vercel with `www.kartikart.in` happens when the team is ready; local SQLite build is fully functional before then.
