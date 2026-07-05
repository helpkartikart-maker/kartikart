# Kartikart Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Kartikart Next.js + Payload CMS app with SQLite, the complete content model, a working admin panel, seed data, a tested WhatsApp-link utility, and a minimal live Home page that reads published content — the backbone every later phase builds on.

**Architecture:** One Next.js (App Router) application with Payload CMS 3.x embedded. Public pages are Server Components reading Payload's Local API directly; admin is Payload's auto-generated `/admin`. Local dev uses SQLite + local-disk media (zero cloud accounts). Content lives in Payload collections; booking is a pure WhatsApp-link builder (no payment backend in v1).

**Tech Stack:** Next.js (Payload-supported version), Payload CMS 3.x (`payload`, `@payloadcms/next`, `@payloadcms/db-sqlite`, `@payloadcms/richtext-lexical`), TypeScript (strict), Tailwind CSS, Vitest (unit tests).

## Global Constraints

- Next.js must be a Payload-supported version: **15.4.11–15.4.x or 16.2.6+**. Payload is **3.x**.
- TypeScript **strict** mode; run `npm run generate:types` after any collection change so `payload-types.ts` stays current.
- **Local dev DB = SQLite** via `@payloadcms/db-sqlite` (`DATABASE_URI=file:./kartikart.db`). Production Postgres + Vercel Blob is **deferred to Phase 5** — do not add cloud adapters now.
- Every **public** content query MUST filter `status: 'published'` (collections that have a `status` field: packages, fleet, stays, experiences, stories).
- **Media** uploads require non-empty `alt` text.
- WhatsApp number is read from the **Site Settings** global, never hardcoded in components. Digits-only for `wa.me`. Poster defaults: display phone `+91 9304781234`, WhatsApp `+91 6201234567`, Instagram `@kartikart.travels`, address Deoghar, Jharkhand 814112.
- Brand tokens: navy `#0F2557`, orange `#F7941E`. Keep bilingual (Hindi/English) taglines intact in seed copy.
- Preserve the existing `docs/` folder and git history when scaffolding.
- Commit after every task with a conventional-commit message.

---

## File Structure

```
/ (repo root — already has docs/, .git/)
├─ src/
│  ├─ payload.config.ts            # Payload config: db, collections, globals, admin
│  ├─ collections/
│  │  ├─ Media.ts                  # upload collection, required alt
│  │  ├─ Users.ts                  # auth + role
│  │  ├─ Packages.ts
│  │  ├─ Fleet.ts
│  │  ├─ Stays.ts
│  │  ├─ Experiences.ts
│  │  ├─ Stories.ts
│  │  └─ Enquiries.ts              # leads; public-create via API only
│  ├─ globals/
│  │  └─ SiteSettings.ts
│  ├─ lib/
│  │  ├─ whatsapp.ts               # pure link + message builders (TDD)
│  │  ├─ whatsapp.test.ts
│  │  └─ slug.ts                   # formatSlug helper
│  ├─ seed.ts                      # seed real + placeholder content
│  └─ app/
│     ├─ (frontend)/page.tsx       # minimal live Home (featured packages)
│     ├─ (frontend)/layout.tsx     # frontend root layout + brand fonts
│     └─ (payload)/…               # Payload admin (from template)
├─ payload-types.ts                # generated
├─ .env / .env.example
├─ tailwind.config.ts / postcss.config.js / globals.css
└─ package.json
```

---

### Task 1: Scaffold Next.js + Payload app (SQLite) into the repo

**Files:**
- Create: whole Next+Payload app at repo root (preserving `docs/`, `.git/`)

- [ ] **Step 1: Scaffold into a temp folder** (avoids the non-empty-dir issue)

Run from `/Users/mayanknarayan/Kartikart`:
```bash
npx create-payload-app@latest _scaffold --db sqlite -t blank --use-npm
```
If the CLI ignores flags and prompts interactively, choose: template **blank**, database **SQLite**, and let it install deps.

- [ ] **Step 2: Merge the scaffold into the repo root, keep our git + docs**

```bash
rsync -a --exclude='.git' _scaffold/ ./
rm -rf _scaffold
```

- [ ] **Step 3: Install deps and generate types**

```bash
npm install
npm run generate:types
```

- [ ] **Step 4: Start dev server and verify it boots**

```bash
npm run dev
```
Expected: server on `http://localhost:3000`. Visit `/admin` → Payload "create first user" screen renders. Visit `/` → the template's frontend page renders. Stop the server (Ctrl-C).

- [ ] **Step 5: Confirm env + gitignore exist**

Verify `.env` contains `PAYLOAD_SECRET=...` and `DATABASE_URI=file:./kartikart.db`. Verify `.gitignore` ignores `node_modules`, `.env`, `*.db`, `.next`, and `/media` (add any missing). Create `.env.example` mirroring `.env` with empty/placeholder values.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Payload app with SQLite"
```

---

### Task 2: Brand tokens + Tailwind base

**Files:**
- Modify/Create: `tailwind.config.ts`, `src/app/(frontend)/globals.css` (or template's CSS entry)

- [ ] **Step 1: Confirm Tailwind is present** (blank template includes it). If not, install:

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
```

- [ ] **Step 2: Add brand tokens to Tailwind config**

In `tailwind.config.ts`, extend the theme (keep existing `content` globs):
```ts
theme: {
  extend: {
    colors: {
      navy: { DEFAULT: '#0F2557', 900: '#0A1A3F', 700: '#183465' },
      saffron: { DEFAULT: '#F7941E', 600: '#E07E0A' },
    },
  },
},
```

- [ ] **Step 3: Add CSS variables + base styles** to the frontend global stylesheet:
```css
:root { --navy: #0F2557; --saffron: #F7941E; }
html { -webkit-text-size-adjust: 100%; }
body { color: var(--navy); }
```

- [ ] **Step 4: Verify build compiles**

```bash
npm run dev   # load http://localhost:3000, confirm no CSS/build errors, then Ctrl-C
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Kartikart brand color tokens to Tailwind"
```

---

### Task 3: Media collection (required alt text)

**Files:**
- Create/Modify: `src/collections/Media.ts`
- Modify: `src/payload.config.ts` (register)

**Interfaces:**
- Produces: collection slug `'media'` (upload), used by every content collection via `type: 'upload', relationTo: 'media'`.

- [ ] **Step 1: Write the Media collection**
```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: true,
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Alt text (for accessibility & SEO)' },
  ],
}
```

- [ ] **Step 2: Register in `payload.config.ts`**

Ensure `import { Media } from './collections/Media'` and `Media` is in the `collections: [...]` array (replace the template's Media import if present).

- [ ] **Step 3: Regenerate types + verify in admin**
```bash
npm run generate:types
npm run dev   # /admin → Media appears, upload requires alt, then Ctrl-C
```

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "feat: media collection with required alt text"
```

---

### Task 4: Users collection (auth + role)

**Files:**
- Create/Modify: `src/collections/Users.ts`
- Modify: `src/payload.config.ts` (`admin.user` should point at `'users'`)

**Interfaces:**
- Produces: auth collection slug `'users'` with field `role: 'admin' | 'staff'`.

- [ ] **Step 1: Write the Users collection**
```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role', type: 'select', required: true, defaultValue: 'staff',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Register + point admin.user at it** in `payload.config.ts` (`admin: { user: Users.slug }`).

- [ ] **Step 3: Verify**
```bash
npm run generate:types
npm run dev   # /admin → create first user works; role field present; Ctrl-C
```

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "feat: users auth collection with role"
```

---

### Task 5: Site Settings global (contact + hero)

**Files:**
- Create: `src/globals/SiteSettings.ts`
- Modify: `src/payload.config.ts` (add `globals: [SiteSettings]`)

**Interfaces:**
- Produces: global slug `'site-settings'` with `whatsappNumber`, `phone`, `instagram`, `email`, `address`, `heroHeadline`, `heroSubline`, `brandTagline`, `heroImages`, `whatsappDefaultMessage`.

- [ ] **Step 1: Write the global**
```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  fields: [
    { name: 'brandTagline', type: 'text', defaultValue: 'Har Safar, Yaadgaar Safar' },
    { name: 'heroHeadline', type: 'text', defaultValue: 'Taxi se Hotel tak, Khana se Heritage tak' },
    { name: 'heroSubline', type: 'text', defaultValue: 'Sab Kuch Best, Sirf Aapke Liye!' },
    { name: 'heroImages', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'phone', type: 'text', defaultValue: '+91 9304781234' },
    { name: 'whatsappNumber', type: 'text', required: true, defaultValue: '916201234567',
      admin: { description: 'Digits only, with country code (used for wa.me links).' } },
    { name: 'email', type: 'email' },
    { name: 'instagram', type: 'text', defaultValue: '@kartikart.travels' },
    { name: 'address', type: 'textarea', defaultValue: 'Deoghar, Jharkhand 814112' },
    { name: 'mapEmbedUrl', type: 'text' },
    { name: 'whatsappDefaultMessage', type: 'textarea',
      defaultValue: 'Hi Kartikart! I would like to plan a trip. Please help me with a quote.' },
  ],
}
```

- [ ] **Step 2: Register** in `payload.config.ts`.

- [ ] **Step 3: Verify**
```bash
npm run generate:types
npm run dev   # /admin → Globals → Site Settings editable; Ctrl-C
```

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "feat: site settings global (contact + hero)"
```

---

### Task 6: slug helper

**Files:**
- Create: `src/lib/slug.ts`

**Interfaces:**
- Produces: `formatSlug(value: string): string`; `slugField()` returns a Payload field config with a `beforeValidate` hook that fills slug from `title` when empty.

- [ ] **Step 1: Write the helper**
```ts
import type { Field } from 'payload'

export function formatSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function slugField(): Field {
  return {
    name: 'slug', type: 'text', required: true, unique: true, index: true,
    admin: { position: 'sidebar' },
    hooks: {
      beforeValidate: [
        ({ value, data }) => value || (data?.title ? formatSlug(String(data.title)) : value),
      ],
    },
  }
}
```

- [ ] **Step 2: Commit** (used by Task 7)
```bash
git add -A && git commit -m "feat: slug helper for content collections"
```

---

### Task 7: Packages collection

**Files:**
- Create: `src/collections/Packages.ts`
- Modify: `src/payload.config.ts`

**Interfaces:**
- Consumes: `slugField` (Task 6), `media` (Task 3).
- Produces: collection slug `'packages'`; fields `title, slug, status, featured, category, suitedFor, region, durationDays, durationNights, priceFrom, priceNote, heroImage, gallery, shortPitch, description, highlights[].item, itinerary[].{day,title,details}, inclusions[].item, exclusions[].item`.

- [ ] **Step 1: Write the collection**
```ts
import type { CollectionConfig } from 'payload'
import { slugField } from '../lib/slug'

export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'region', 'status', 'featured'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'status', type: 'select', required: true, defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'category', type: 'select', required: true, options: [
      { label: 'Spiritual', value: 'spiritual' }, { label: 'Adventure', value: 'adventure' },
      { label: 'Wildlife', value: 'wildlife' }, { label: 'Beach', value: 'beach' },
      { label: 'Cultural', value: 'cultural' } ] },
    { name: 'suitedFor', type: 'select', hasMany: true, options: [
      { label: 'Families', value: 'families' }, { label: 'Couples', value: 'couples' },
      { label: 'Groups', value: 'groups' }, { label: 'Solo Travelers', value: 'solo' } ] },
    { name: 'region', type: 'select', required: true, defaultValue: 'deoghar', options: [
      { label: 'Deoghar & Local', value: 'deoghar' }, { label: 'Pan-India', value: 'pan-india' } ] },
    { name: 'durationDays', type: 'number' },
    { name: 'durationNights', type: 'number' },
    { name: 'priceFrom', type: 'number' },
    { name: 'priceNote', type: 'text', admin: { description: 'e.g. "per person" or "on request"' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'shortPitch', type: 'textarea' },
    { name: 'description', type: 'richText' },
    { name: 'highlights', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'itinerary', type: 'array', fields: [
      { name: 'day', type: 'number' }, { name: 'title', type: 'text' }, { name: 'details', type: 'textarea' } ] },
    { name: 'inclusions', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'exclusions', type: 'array', fields: [{ name: 'item', type: 'text' }] },
  ],
}
```

- [ ] **Step 2: Register** in `payload.config.ts`.

- [ ] **Step 3: Verify** — create a package in admin, set status=published, featured=true.
```bash
npm run generate:types
npm run dev   # /admin → Packages CRUD works; Ctrl-C
```

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "feat: packages collection"
```

---

### Task 8: Fleet collection

**Files:**
- Create: `src/collections/Fleet.ts`; Modify: `src/payload.config.ts`

**Interfaces:**
- Produces: slug `'fleet'`; fields `name, type, seats, luggage, features[].item, photo, gallery, rate, rateNote, ownedByKartikart, status`.

- [ ] **Step 1: Write the collection**
```ts
import type { CollectionConfig } from 'payload'

export const Fleet: CollectionConfig = {
  slug: 'fleet',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'type', 'seats', 'ownedByKartikart', 'status'] },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Toyota Innova Crysta' } },
    { name: 'type', type: 'select', required: true, options: [
      { label: 'SUV', value: 'suv' }, { label: 'Sedan', value: 'sedan' },
      { label: 'Tempo Traveller', value: 'tempo' }, { label: 'Other', value: 'other' } ] },
    { name: 'seats', type: 'number' },
    { name: 'luggage', type: 'text' },
    { name: 'features', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'rate', type: 'number' },
    { name: 'rateNote', type: 'text', admin: { description: 'e.g. "per km" or "on request"' } },
    { name: 'ownedByKartikart', type: 'checkbox', defaultValue: false, label: 'Owned by Kartikart' },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', admin: { position: 'sidebar' },
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
  ],
}
```

- [ ] **Step 2: Register + verify + commit**
```bash
npm run generate:types
git add -A && git commit -m "feat: fleet collection"
```

---

### Task 9: Stays collection

**Files:**
- Create: `src/collections/Stays.ts`; Modify: `src/payload.config.ts`

**Interfaces:**
- Produces: slug `'stays'`; fields `name, ownership, location, starRating, amenities[].item, photos, shortDesc, description, priceFrom, priceNote, status`.

- [ ] **Step 1: Write the collection**
```ts
import type { CollectionConfig } from 'payload'

export const Stays: CollectionConfig = {
  slug: 'stays',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'ownership', 'location', 'starRating', 'status'] },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'ownership', type: 'select', required: true, defaultValue: 'partner', options: [
      { label: 'Kartikart-owned', value: 'owned' }, { label: 'Partner', value: 'partner' } ] },
    { name: 'location', type: 'text' },
    { name: 'starRating', type: 'number', min: 1, max: 5 },
    { name: 'amenities', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'photos', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'shortDesc', type: 'textarea' },
    { name: 'description', type: 'richText' },
    { name: 'priceFrom', type: 'number' },
    { name: 'priceNote', type: 'text' },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', admin: { position: 'sidebar' },
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
  ],
}
```

- [ ] **Step 2: Register + verify + commit**
```bash
npm run generate:types
git add -A && git commit -m "feat: stays (hotels) collection"
```

---

### Task 10: Experiences collection

**Files:**
- Create: `src/collections/Experiences.ts`; Modify: `src/payload.config.ts`

**Interfaces:**
- Produces: slug `'experiences'`; fields `title, kind, location, description, photos, partnerEatery, featured, status`.

- [ ] **Step 1: Write the collection**
```ts
import type { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'kind', 'location', 'status'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'kind', type: 'select', required: true, options: [
      { label: 'Food', value: 'food' }, { label: 'Heritage Site', value: 'heritage' },
      { label: 'Cultural Experience', value: 'cultural' } ] },
    { name: 'location', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'photos', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'partnerEatery', type: 'text' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', admin: { position: 'sidebar' },
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
  ],
}
```

- [ ] **Step 2: Register + verify + commit**
```bash
npm run generate:types
git add -A && git commit -m "feat: experiences (food & heritage) collection"
```

---

### Task 11: Stories collection

**Files:**
- Create: `src/collections/Stories.ts`; Modify: `src/payload.config.ts`

**Interfaces:**
- Produces: slug `'stories'`; fields `customerName, tripLabel, tripType, photos, quote, rating, date, featured, status`.

- [ ] **Step 1: Write the collection**
```ts
import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: { useAsTitle: 'customerName', defaultColumns: ['customerName', 'tripLabel', 'rating', 'status'] },
  access: { read: () => true },
  fields: [
    { name: 'customerName', type: 'text', required: true },
    { name: 'tripLabel', type: 'text', admin: { description: 'e.g. "Baba Baidyanath Darshan, Mar 2026"' } },
    { name: 'tripType', type: 'select', options: [
      { label: 'Spiritual', value: 'spiritual' }, { label: 'Adventure', value: 'adventure' },
      { label: 'Wildlife', value: 'wildlife' }, { label: 'Beach', value: 'beach' },
      { label: 'Cultural', value: 'cultural' } ] },
    { name: 'photos', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'date', type: 'date' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', admin: { position: 'sidebar' },
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
  ],
}
```

- [ ] **Step 2: Register + verify + commit**
```bash
npm run generate:types
git add -A && git commit -m "feat: stories collection"
```

---

### Task 12: Enquiries collection (leads)

**Files:**
- Create: `src/collections/Enquiries.ts`; Modify: `src/payload.config.ts`

**Interfaces:**
- Produces: slug `'enquiries'`; fields `name, phone, subjectType, subjectRef, message, travelers, dates`. Access: only authenticated users can `read`/`update`/`delete`; `create` is server-side only (the API route in Phase 3 uses an authenticated Local API call, so public `create` stays `false`).

- [ ] **Step 1: Write the collection**
```ts
import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: { useAsTitle: 'subjectType', defaultColumns: ['subjectType', 'name', 'phone', 'createdAt'] },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,   // created server-side via Local API (Phase 3 route)
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'subjectType', type: 'select', required: true, options: [
      { label: 'Package', value: 'package' }, { label: 'Car', value: 'car' },
      { label: 'Hotel', value: 'hotel' }, { label: 'Experience', value: 'experience' },
      { label: 'Custom', value: 'custom' } ] },
    { name: 'subjectRef', type: 'text', admin: { description: 'Package title / car / hotel referenced' } },
    { name: 'message', type: 'textarea' },
    { name: 'travelers', type: 'number' },
    { name: 'dates', type: 'text' },
  ],
}
```

- [ ] **Step 2: Register + verify** (visible only when logged in) **+ commit**
```bash
npm run generate:types
git add -A && git commit -m "feat: enquiries (leads) collection with auth-gated access"
```

---

### Task 13: WhatsApp link builder (TDD)

**Files:**
- Create: `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`
- Modify: `package.json` (test script), add Vitest

**Interfaces:**
- Produces: `normalizeWhatsappNumber(raw: string): string`; `buildWhatsappLink({ whatsappNumber, message }): string`; `packageEnquiryMessage(pkg): string`.

- [ ] **Step 1: Install Vitest + add script**
```bash
npm install -D vitest
```
Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 2: Write the failing test** — `src/lib/whatsapp.test.ts`
```ts
import { describe, it, expect } from 'vitest'
import { normalizeWhatsappNumber, buildWhatsappLink, packageEnquiryMessage } from './whatsapp'

describe('normalizeWhatsappNumber', () => {
  it('strips spaces, plus, and punctuation to digits only', () => {
    expect(normalizeWhatsappNumber('+91 62012 34567')).toBe('916201234567')
  })
})

describe('buildWhatsappLink', () => {
  it('builds a wa.me link with a URL-encoded message', () => {
    const url = buildWhatsappLink({ whatsappNumber: '+91 6201234567', message: 'Hi & welcome!' })
    expect(url).toBe('https://wa.me/916201234567?text=Hi%20%26%20welcome!')
  })
})

describe('packageEnquiryMessage', () => {
  it('includes bolded title, duration, and region', () => {
    const msg = packageEnquiryMessage({
      title: 'Baba Baidyanath Darshan', region: 'Deoghar & Local', durationNights: 2, durationDays: 3,
    })
    expect(msg).toContain('*Baba Baidyanath Darshan*')
    expect(msg).toContain('(2N/3D)')
    expect(msg).toContain('[Deoghar & Local]')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**
```bash
npm test
```
Expected: FAIL — cannot resolve `./whatsapp`.

- [ ] **Step 4: Write minimal implementation** — `src/lib/whatsapp.ts`
```ts
export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/\D/g, '')
}

export function buildWhatsappLink(params: { whatsappNumber: string; message: string }): string {
  const digits = normalizeWhatsappNumber(params.whatsappNumber)
  return `https://wa.me/${digits}?text=${encodeURIComponent(params.message)}`
}

export function packageEnquiryMessage(pkg: {
  title: string; region?: string; durationNights?: number | null; durationDays?: number | null
}): string {
  const dur = pkg.durationNights && pkg.durationDays ? ` (${pkg.durationNights}N/${pkg.durationDays}D)` : ''
  const region = pkg.region ? ` [${pkg.region}]` : ''
  return `Hi Kartikart! I'd like a quote for *${pkg.title}*${dur}${region}. Please share details & availability.`
}
```

- [ ] **Step 5: Run test to verify it passes**
```bash
npm test
```
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**
```bash
git add -A && git commit -m "feat: tested WhatsApp link + message builders"
```

---

### Task 14: Seed script (real + placeholder content)

**Files:**
- Create: `src/seed.ts`; Modify: `package.json` (seed script)

**Interfaces:**
- Consumes: all collections + Site Settings.
- Produces: an idempotent `npm run seed` that creates an admin user, Site Settings, and a starter set of published content (including a real Deoghar Baidyanath package, the 5 owned cars, 2 owned hotels) plus placeholder items.

- [ ] **Step 1: Add the seed script to `package.json`**
```json
"seed": "PAYLOAD_SEED=true tsx src/seed.ts"
```
Install tsx if not present: `npm install -D tsx`.

- [ ] **Step 2: Write `src/seed.ts`** (uses Payload Local API; guards against duplicates)
```ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  const payload = await getPayload({ config })

  // Admin user (idempotent)
  const existing = await payload.find({ collection: 'users', where: { email: { equals: 'admin@kartikart.in' } } })
  if (existing.totalDocs === 0) {
    await payload.create({ collection: 'users', data: {
      email: 'admin@kartikart.in', password: 'changeme123', name: 'Kartikart Admin', role: 'admin' } })
  }

  // Site settings
  await payload.updateGlobal({ slug: 'site-settings', data: {
    phone: '+91 9304781234', whatsappNumber: '916201234567',
    instagram: '@kartikart.travels', address: 'Deoghar, Jharkhand 814112',
    brandTagline: 'Har Safar, Yaadgaar Safar',
    heroHeadline: 'Taxi se Hotel tak, Khana se Heritage tak',
    heroSubline: 'Sab Kuch Best, Sirf Aapke Liye!' } })

  // Helper: only create a package if its slug is new
  async function ensurePackage(data: any) {
    const found = await payload.find({ collection: 'packages', where: { slug: { equals: data.slug } } })
    if (found.totalDocs === 0) await payload.create({ collection: 'packages', data })
  }

  await ensurePackage({
    title: 'Baba Baidyanath Jyotirlinga Darshan', slug: 'baba-baidyanath-darshan',
    status: 'published', featured: true, category: 'spiritual', region: 'deoghar',
    suitedFor: ['families', 'groups', 'solo'], durationDays: 3, durationNights: 2,
    priceFrom: 5999, priceNote: 'per person',
    shortPitch: 'Darshan of one of the 12 Jyotirlingas, with taxi, stay, and prasad-thali food handled end to end.',
    highlights: [{ item: 'Baidyanath Dham darshan' }, { item: 'Tapovan & Nandan Pahar' }, { item: 'Local prasad thali' }],
    itinerary: [
      { day: 1, title: 'Arrival & Mandir darshan', details: 'Pickup, hotel check-in, evening aarti.' },
      { day: 2, title: 'Local heritage & food', details: 'Tapovan, Naulakha Mandir, heritage food trail.' },
      { day: 3, title: 'Departure', details: 'Breakfast and drop.' } ],
    inclusions: [{ item: 'AC taxi' }, { item: '2 nights stay' }, { item: 'Daily breakfast' }],
    exclusions: [{ item: 'Personal expenses' }, { item: 'Pooja items' }] })

  // Placeholder pan-India package
  await ensurePackage({
    title: 'Golden Triangle Explorer (Placeholder)', slug: 'golden-triangle-placeholder',
    status: 'published', featured: true, category: 'cultural', region: 'pan-india',
    suitedFor: ['families', 'couples'], durationDays: 5, durationNights: 4, priceFrom: 18999, priceNote: 'per person',
    shortPitch: 'Delhi–Agra–Jaipur classic. Replace with your real itinerary via the admin panel.' })

  // 5 owned cars
  const cars = [
    { name: 'Toyota Innova Crysta', type: 'suv', seats: 7 },
    { name: 'Maruti Ertiga', type: 'suv', seats: 7 },
    { name: 'Toyota Etios', type: 'sedan', seats: 4 },
    { name: 'Maruti Dzire', type: 'sedan', seats: 4 },
    { name: 'Force Tempo Traveller', type: 'tempo', seats: 12 },
  ]
  for (const c of cars) {
    const found = await payload.find({ collection: 'fleet', where: { name: { equals: c.name } } })
    if (found.totalDocs === 0) await payload.create({ collection: 'fleet', data: {
      ...c, ownedByKartikart: true, status: 'published', rateNote: 'on request',
      features: [{ item: 'AC' }, { item: 'Music system' }, { item: 'Experienced driver' }] } })
  }

  // 2 owned hotels
  const hotels = [
    { name: 'Kartikart Residency, Deoghar', location: 'Deoghar', starRating: 3 },
    { name: 'Kartikart Grand, Deoghar', location: 'Deoghar', starRating: 4 },
  ]
  for (const h of hotels) {
    const found = await payload.find({ collection: 'stays', where: { name: { equals: h.name } } })
    if (found.totalDocs === 0) await payload.create({ collection: 'stays', data: {
      ...h, ownership: 'owned', status: 'published', priceFrom: 1999, priceNote: 'per night',
      amenities: [{ item: 'Free WiFi' }, { item: 'Restaurant' }, { item: 'Near Baba Mandir' }] } })
  }

  // One story
  const s = await payload.find({ collection: 'stories', where: { customerName: { equals: 'Ramesh & Family' } } })
  if (s.totalDocs === 0) await payload.create({ collection: 'stories', data: {
    customerName: 'Ramesh & Family', tripLabel: 'Baba Baidyanath Darshan, Mar 2026', tripType: 'spiritual',
    quote: 'From the taxi to the hotel to the prasad thali — everything was handled. Truly Yaadgaar Safar!',
    rating: 5, status: 'published', featured: true } })

  console.log('✅ Seed complete')
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
```

- [ ] **Step 3: Run the seed**
```bash
npm run seed
```
Expected: `✅ Seed complete`. Re-run once more → no duplicates (idempotent).

- [ ] **Step 4: Verify in admin**
```bash
npm run dev   # /admin → login admin@kartikart.in / changeme123 → see 2 packages, 5 cars, 2 hotels, 1 story; Ctrl-C
```

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "feat: idempotent seed script (real + placeholder content)"
```

---

### Task 15: Minimal live Home page (proves Payload → public data flow)

**Files:**
- Modify/Create: `src/app/(frontend)/page.tsx`, `src/app/(frontend)/layout.tsx`

**Interfaces:**
- Consumes: `packages` collection, `site-settings` global, `buildWhatsappLink` + `packageEnquiryMessage` (Task 13).

- [ ] **Step 1: Write a minimal branded Home** — `src/app/(frontend)/page.tsx`
```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { buildWhatsappLink, packageEnquiryMessage } from '@/lib/whatsapp'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const { docs: featured } = await payload.find({
    collection: 'packages',
    where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
    limit: 6,
  })

  return (
    <main style={{ padding: '2rem', color: '#0F2557', fontFamily: 'system-ui' }}>
      <p style={{ color: '#F7941E', fontWeight: 600 }}>{settings.brandTagline}</p>
      <h1 style={{ fontSize: '2rem', margin: '0.25rem 0' }}>{settings.heroHeadline}</h1>
      <p>{settings.heroSubline}</p>

      <h2 style={{ marginTop: '2rem' }}>Featured Journeys</h2>
      <ul style={{ display: 'grid', gap: '1rem', listStyle: 'none', padding: 0 }}>
        {featured.map((pkg) => (
          <li key={pkg.id} style={{ border: '1px solid #0F2557', borderRadius: 8, padding: '1rem' }}>
            <h3 style={{ margin: 0 }}>{pkg.title}</h3>
            {pkg.shortPitch && <p>{pkg.shortPitch}</p>}
            <a
              href={buildWhatsappLink({
                whatsappNumber: settings.whatsappNumber,
                message: packageEnquiryMessage({
                  title: pkg.title, region: pkg.region === 'deoghar' ? 'Deoghar & Local' : 'Pan-India',
                  durationNights: pkg.durationNights, durationDays: pkg.durationDays,
                }),
              })}
              target="_blank" rel="noopener noreferrer"
              style={{ color: '#fff', background: '#25D366', padding: '0.5rem 1rem', borderRadius: 6, textDecoration: 'none', display: 'inline-block' }}
            >
              Book on WhatsApp
            </a>
          </li>
        ))}
      </ul>
      {featured.length === 0 && <p>No featured journeys yet — add one in the admin panel.</p>}
    </main>
  )
}
```

- [ ] **Step 2: Ensure the `@/` alias resolves** — confirm `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }` and `"@payload-config"` mapping (the template sets `@payload-config`). Add the `@/*` path if missing.

- [ ] **Step 3: Verify the page renders real seeded data**
```bash
npm run dev
```
Visit `http://localhost:3000` → hero taglines + the two featured packages render, each with a working "Book on WhatsApp" link (hover shows a `wa.me/916201234567?text=...` URL). Ctrl-C.

- [ ] **Step 4: Run the full test suite**
```bash
npm test
```
Expected: PASS (Task 13 tests still green).

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "feat: minimal live Home reading published featured packages"
```

---

## Self-Review

**1. Spec coverage (Phase 1 scope):**
- Scaffold Next+Payload + SQLite → Task 1 ✅
- Brand tokens → Task 2 ✅
- Content model: Media ✅(3), Users ✅(4), Site Settings ✅(5), Packages ✅(7), Fleet ✅(8), Stays ✅(9), Experiences ✅(10), Stories ✅(11), Enquiries ✅(12)
- WhatsApp link builder (tested) → Task 13 ✅
- Seed real+placeholder (Baidyanath package, 5 cars, 2 hotels) → Task 14 ✅
- Working admin end-to-end → verified in Tasks 4/14 ✅
- Public data-flow proof (minimal Home) → Task 15 ✅
- *Deferred (correctly out of Phase 1):* full public site + design polish (Phase 2), services/stories pages + Plan-My-Trip + Enquiries API route (Phase 3), SEO/animation/a11y/Playwright (Phase 4), Postgres+Blob+deploy (Phase 5).

**2. Placeholder scan:** No TBD/TODO steps; every code step contains real code; commands have expected output. ✅

**3. Type consistency:** `buildWhatsappLink`/`packageEnquiryMessage`/`normalizeWhatsappNumber` signatures identical across Tasks 13 & 15. `slugField()` defined in Task 6, consumed in Task 7. Collection slugs (`media`, `users`, `packages`, `fleet`, `stays`, `experiences`, `stories`, `enquiries`, `site-settings`) referenced consistently in seed (14) and Home (15). ✅

**Note on testing altitude:** collection-schema tasks are verified by typegen + admin CRUD (not fake unit tests); genuine unit tests are reserved for pure logic (the WhatsApp builders). Playwright e2e smoke tests are scheduled for Phase 4, when a stable public UI exists to drive.
