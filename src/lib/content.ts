import type { Experience, Fleet, Package, SiteSetting, Stay, Story } from '@/payload-types'

/**
 * Built-in sample content, used when no Payload backend is configured
 * (i.e. PAYLOAD_SECRET is unset — e.g. a zero-config Vercel deploy). This keeps
 * the public site fully live with no database. Once a production database +
 * PAYLOAD_SECRET are set, queries read from Payload/admin instead of this.
 * Mirrors src/seed.ts.
 */

const items = (arr: string[]) => arr.map((item, i) => ({ id: String(i + 1), item }))
const carFeatures = items(['AC', 'Music system', 'Experienced driver'])
const stayAmenities = items(['Free WiFi', 'Restaurant', 'Near Baba Mandir'])

export const siteSettings = {
  brandTagline: 'Har Safar, Yaadgaar Safar',
  heroHeadline: 'Taxi se Hotel tak, Khana se Heritage tak',
  heroSubline: 'Sab Kuch Best, Sirf Aapke Liye!',
  phone: '+91 9304781234',
  whatsappNumber: '916201234567',
  email: null,
  instagram: '@kartikart.travels',
  address: 'Deoghar, Jharkhand 814112',
  mapEmbedUrl: null,
  whatsappDefaultMessage: 'Hi Kartikart! I would like to plan a trip. Please help me with a quote.',
} as unknown as SiteSetting

export const packages = [
  {
    id: 1,
    title: 'Baba Baidyanath Jyotirlinga Darshan',
    slug: 'baba-baidyanath-darshan',
    status: 'published',
    featured: true,
    category: 'spiritual',
    region: 'deoghar',
    suitedFor: ['families', 'groups', 'solo'],
    durationDays: 3,
    durationNights: 2,
    priceFrom: 5999,
    priceNote: 'per person',
    shortPitch:
      'Darshan of one of the 12 Jyotirlingas, with taxi, stay and prasad-thali food handled end to end.',
    highlights: items(['Baidyanath Dham darshan', 'Tapovan & Nandan Pahar', 'Local prasad thali']),
    itinerary: [
      { id: '1', day: 1, title: 'Arrival & Mandir darshan', details: 'Pickup, hotel check-in, evening aarti.' },
      { id: '2', day: 2, title: 'Local heritage & food', details: 'Tapovan, Naulakha Mandir, heritage food trail.' },
      { id: '3', day: 3, title: 'Departure', details: 'Breakfast and drop.' },
    ],
    inclusions: items(['AC taxi', '2 nights stay', 'Daily breakfast']),
    exclusions: items(['Personal expenses', 'Pooja items']),
    heroImage: null,
    gallery: null,
    description: null,
  },
  {
    id: 2,
    title: 'Golden Triangle Explorer (Placeholder)',
    slug: 'golden-triangle-placeholder',
    status: 'published',
    featured: true,
    category: 'cultural',
    region: 'pan-india',
    suitedFor: ['families', 'couples'],
    durationDays: 5,
    durationNights: 4,
    priceFrom: 18999,
    priceNote: 'per person',
    shortPitch: 'Delhi–Agra–Jaipur classic. Replace with your real itinerary via the admin panel.',
    heroImage: null,
  },
  {
    id: 3,
    title: 'Betla Wildlife Escape (Placeholder)',
    slug: 'betla-wildlife-placeholder',
    status: 'published',
    featured: false,
    category: 'wildlife',
    region: 'pan-india',
    suitedFor: ['families', 'groups'],
    durationDays: 2,
    durationNights: 1,
    priceFrom: 7499,
    priceNote: 'per person',
    shortPitch: 'Jungle safari at Betla National Park. Placeholder — edit in admin.',
    heroImage: null,
  },
] as unknown as Package[]

export const fleet = [
  { id: 1, name: 'Toyota Innova Crysta', type: 'suv', seats: 7 },
  { id: 2, name: 'Maruti Ertiga', type: 'suv', seats: 7 },
  { id: 3, name: 'Toyota Etios', type: 'sedan', seats: 4 },
  { id: 4, name: 'Maruti Dzire', type: 'sedan', seats: 4 },
  { id: 5, name: 'Force Tempo Traveller', type: 'tempo', seats: 12 },
].map((c) => ({
  ...c,
  ownedByKartikart: true,
  status: 'published',
  rateNote: 'on request',
  features: carFeatures,
  photo: null,
})) as unknown as Fleet[]

export const stays = [
  { id: 1, name: 'Kartikart Residency, Deoghar', ownership: 'owned', starRating: 3, priceFrom: 1999 },
  { id: 2, name: 'Kartikart Grand, Deoghar', ownership: 'owned', starRating: 4, priceFrom: 3499 },
  { id: 3, name: 'Shri Baidyanath Guest House (Partner)', ownership: 'partner', starRating: 3, priceFrom: 1499 },
].map((s) => ({
  ...s,
  location: 'Deoghar',
  priceNote: 'per night',
  status: 'published',
  amenities: stayAmenities,
  photos: null,
})) as unknown as Stay[]

export const experiences = [
  {
    id: 1,
    title: 'Deoghar Peda & Prasad Thali Trail',
    kind: 'food',
    location: 'Deoghar',
    partnerEatery: 'Local partner eateries',
    featured: true,
    status: 'published',
    photos: null,
  },
] as unknown as Experience[]

export const stories = [
  {
    id: 1,
    customerName: 'Ramesh & Family',
    tripLabel: 'Baba Baidyanath Darshan, Mar 2026',
    tripType: 'spiritual',
    quote:
      'From the taxi to the hotel to the prasad thali — everything was handled. Truly Yaadgaar Safar!',
    rating: 5,
    featured: true,
    status: 'published',
    photos: null,
    date: null,
  },
] as unknown as Story[]
