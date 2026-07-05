import 'dotenv/config'
import { getPayload, type Where } from 'payload'
import config from './payload.config'

/**
 * Idempotent seed: safe to run repeatedly. Creates an admin user, Site Settings,
 * and a starter set of published content (a real Deoghar Baidyanath package, the
 * 5 owned cars, 2 owned hotels, a partner stay, a food experience, and a story).
 */
async function seed() {
  const payload = await getPayload({ config })

  // --- Admin user -----------------------------------------------------------
  const existingUser = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@kartikart.in' } },
  })
  if (existingUser.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@kartikart.in',
        password: 'changeme123',
        name: 'Kartikart Admin',
        role: 'admin',
      },
    })
    payload.logger.info('Created admin user admin@kartikart.in (password: changeme123)')
  }

  // --- Site settings --------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      brandTagline: 'Har Safar, Yaadgaar Safar',
      heroHeadline: 'Taxi se Hotel tak, Khana se Heritage tak',
      heroSubline: 'Sab Kuch Best, Sirf Aapke Liye!',
      phone: '+91 9304781234',
      whatsappNumber: '916201234567',
      instagram: '@kartikart.travels',
      address: 'Deoghar, Jharkhand 814112',
      whatsappDefaultMessage:
        'Hi Kartikart! I would like to plan a trip. Please help me with a quote.',
    },
  })

  // --- Helpers --------------------------------------------------------------
  const ensure = async (
    collection: 'packages' | 'fleet' | 'stays' | 'experiences' | 'stories',
    where: Where,
    data: Record<string, unknown>,
  ) => {
    const found = await payload.find({ collection, where, limit: 1 })
    if (found.totalDocs === 0) {
      await payload.create({ collection, data: data as never })
      payload.logger.info(`Seeded ${collection}: ${JSON.stringify(where)}`)
    }
  }

  // --- Packages -------------------------------------------------------------
  await ensure(
    'packages',
    { slug: { equals: 'baba-baidyanath-darshan' } },
    {
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
      highlights: [
        { item: 'Baidyanath Dham darshan' },
        { item: 'Tapovan & Nandan Pahar' },
        { item: 'Local prasad thali' },
      ],
      itinerary: [
        { day: 1, title: 'Arrival & Mandir darshan', details: 'Pickup, hotel check-in, evening aarti.' },
        { day: 2, title: 'Local heritage & food', details: 'Tapovan, Naulakha Mandir, heritage food trail.' },
        { day: 3, title: 'Departure', details: 'Breakfast and drop.' },
      ],
      inclusions: [{ item: 'AC taxi' }, { item: '2 nights stay' }, { item: 'Daily breakfast' }],
      exclusions: [{ item: 'Personal expenses' }, { item: 'Pooja items' }],
    },
  )

  await ensure(
    'packages',
    { slug: { equals: 'golden-triangle-placeholder' } },
    {
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
      shortPitch:
        'Delhi–Agra–Jaipur classic. Replace with your real itinerary via the admin panel.',
    },
  )

  await ensure(
    'packages',
    { slug: { equals: 'betla-wildlife-placeholder' } },
    {
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
    },
  )

  // --- Fleet: 5 owned cars --------------------------------------------------
  const cars = [
    { name: 'Toyota Innova Crysta', type: 'suv', seats: 7 },
    { name: 'Maruti Ertiga', type: 'suv', seats: 7 },
    { name: 'Toyota Etios', type: 'sedan', seats: 4 },
    { name: 'Maruti Dzire', type: 'sedan', seats: 4 },
    { name: 'Force Tempo Traveller', type: 'tempo', seats: 12 },
  ]
  for (const car of cars) {
    await ensure(
      'fleet',
      { name: { equals: car.name } },
      {
        ...car,
        ownedByKartikart: true,
        status: 'published',
        rateNote: 'on request',
        features: [{ item: 'AC' }, { item: 'Music system' }, { item: 'Experienced driver' }],
      },
    )
  }

  // --- Stays: 2 owned hotels + 1 partner ------------------------------------
  const stays = [
    { name: 'Kartikart Residency, Deoghar', ownership: 'owned', starRating: 3, priceFrom: 1999 },
    { name: 'Kartikart Grand, Deoghar', ownership: 'owned', starRating: 4, priceFrom: 3499 },
    { name: 'Shri Baidyanath Guest House (Partner)', ownership: 'partner', starRating: 3, priceFrom: 1499 },
  ]
  for (const stay of stays) {
    await ensure(
      'stays',
      { name: { equals: stay.name } },
      {
        ...stay,
        location: 'Deoghar',
        status: 'published',
        priceNote: 'per night',
        amenities: [{ item: 'Free WiFi' }, { item: 'Restaurant' }, { item: 'Near Baba Mandir' }],
      },
    )
  }

  // --- Experiences ----------------------------------------------------------
  await ensure(
    'experiences',
    { title: { equals: 'Deoghar Peda & Prasad Thali Trail' } },
    {
      title: 'Deoghar Peda & Prasad Thali Trail',
      kind: 'food',
      location: 'Deoghar',
      partnerEatery: 'Local partner eateries',
      featured: true,
      status: 'published',
    },
  )

  // --- Stories --------------------------------------------------------------
  await ensure(
    'stories',
    { customerName: { equals: 'Ramesh & Family' } },
    {
      customerName: 'Ramesh & Family',
      tripLabel: 'Baba Baidyanath Darshan, Mar 2026',
      tripType: 'spiritual',
      quote:
        'From the taxi to the hotel to the prasad thali — everything was handled. Truly Yaadgaar Safar!',
      rating: 5,
      status: 'published',
      featured: true,
    },
  )

  payload.logger.info('✅ Seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
