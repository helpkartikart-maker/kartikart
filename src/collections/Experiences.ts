import type { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: { singular: 'Experience', plural: 'Experiences' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'location', 'status'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { label: 'Food', value: 'food' },
        { label: 'Heritage Site', value: 'heritage' },
        { label: 'Cultural Experience', value: 'cultural' },
      ],
    },
    { name: 'location', type: 'text', defaultValue: 'Deoghar' },
    { name: 'specialty', type: 'text', admin: { description: 'e.g. "Peda · Rasgulla · Sweets"' } },
    { name: 'blurb', type: 'textarea', admin: { description: 'One or two lines shown on the card' } },
    { name: 'mapUrl', type: 'text', admin: { description: 'Google Maps link (optional — shows a "View on map" link)' } },
    { name: 'description', type: 'richText' },
    { name: 'photos', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'partnerEatery', type: 'text', admin: { description: 'Optional partner eatery / vendor name' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
